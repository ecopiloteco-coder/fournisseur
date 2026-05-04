import { fetchDemandesParEntreprise, type ProjetFournisseurResponse } from '../../chiffrage/api/chiffrage.api';
import { getBackendURL } from '../../../shared/lib/api-bridge';

const BACKEND_URL = getBackendURL();

type ProjectGroupKey = string;

export type ClientProject = {
  id: number;
  projetId: number;
  publicId: string;
  nomProjet: string;
  status: string;
  deadline: string | null;
  dateEnvoi: string | null;
  dateRetour: string | null;
  articlesCount: number;
  amountHt: number;
  interneEntreprisePublicId?: string;
};

export type EntrepriseInterne = {
  id_entreprise?: number;
  entrepriseId?: number;
  nom_entreprise?: string;
  nomEntreprise?: string;
  adresse?: string;
  adresse_mail?: string;
  addresseMail?: string;
  public_id?: string;
};

export type ClientCompany = {
  id: string;
  nom: string;
  contactPrincipal: string;
  adresse: string;
  email: string;
  projets: ClientProject[];
  entrepriseInterne?: EntrepriseInterne;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = sessionStorage.getItem('fournisseur_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

function getEntreprisePublicId(project: ProjetFournisseurResponse): string {
  return project.userEntreprise || `projet-${project.projetId || project.id}`;
}

function getEntrepriseNom(entreprise: EntrepriseInterne): string {
  return entreprise.nom_entreprise || entreprise.nomEntreprise || 'Entreprise inconnue';
}

function getEntrepriseAdresse(entreprise: EntrepriseInterne): string {
  return entreprise.adresse || 'N/A';
}

function getEntrepriseEmail(entreprise: EntrepriseInterne): string {
  return entreprise.adresse_mail || entreprise.adresseMail || (entreprise as any).addresseMail || 'N/A';
}

async function fetchEntrepriseInterne(publicId: string): Promise<EntrepriseInterne> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${BACKEND_URL}/api/projet-fournisseur/entreprise-interne?publicId=${encodeURIComponent(publicId)}`,
      { headers }
    );

    if (!response.ok) {
      return {};
    }

    const json = await response.json();
    return json.data || {};
  } catch (error) {
    console.error('[ClientAPI] Error fetching entreprise interne:', error);
    return {};
  }
}

async function fetchEntrepriseInterneById(id: number): Promise<EntrepriseInterne> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${BACKEND_URL}/api/projet-fournisseur/entreprise-interne?id=${id}`,
      { headers }
    );

    if (!response.ok) {
      return {};
    }

    const json = await response.json();
    return json.data || {};
  } catch (error) {
    console.error('[ClientAPI] Error fetching entreprise interne by id:', error);
    return {};
  }
}

function formatNumber(value: unknown) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function getArticlesCount(project: ProjetFournisseurResponse) {
  const lots = Array.isArray(project.lots) ? project.lots : [];
  return lots.reduce((sum: number, lot: any) => sum + (Array.isArray(lot?.articles) ? lot.articles.length : 0), 0);
}

function getAmountHt(project: ProjetFournisseurResponse) {
  const direct = formatNumber(project.prixTotal ?? 0);
  if (direct > 0) return direct;

  const lots = Array.isArray(project.lots) ? project.lots : [];
  return lots.reduce((sum: number, lot: any) => sum + formatNumber(lot?.prixTotal || 0), 0);
}

function mapProject(project: ProjetFournisseurResponse): ClientProject {
  return {
    id: project.id,
    projetId: project.projetId || project.id,
    publicId: project.publicId || String(project.id),
    nomProjet: project.nomProjet || `Projet ${project.projetId || project.id}`,
    status: String(project.status || 'inconnu'),
    deadline: project.deadline || null,
    dateEnvoi: (project as any).dateEnvoi || null,
    dateRetour: project.dateRetour || null,
    articlesCount: getArticlesCount(project),
    amountHt: getAmountHt(project),
    interneEntreprisePublicId: project.userEntreprise,
  };
}

async function groupProjects(projects: ProjetFournisseurResponse[]): Promise<ClientCompany[]> {
  const groupedProjects = new Map<ProjectGroupKey, ProjetFournisseurResponse[]>();

  for (const project of projects) {
    const groupKey = getEntreprisePublicId(project);
    const currentGroup = groupedProjects.get(groupKey) || [];
    currentGroup.push(project);
    groupedProjects.set(groupKey, currentGroup);
  }

  const companies: ClientCompany[] = [];

  for (const [groupKey, groupedItems] of groupedProjects.entries()) {
    const interneId = groupedItems[0]?.interneEntrepriseId;
    const publicId = groupedItems[0]?.userEntreprise;
    console.log('[ClientAPI] Resolving entreprise for group:', groupKey, '| interneEntrepriseId:', interneId, '| userEntreprise:', publicId);
    const entrepriseInterne = interneId
      ? await fetchEntrepriseInterneById(interneId)
      : (publicId ? await fetchEntrepriseInterne(publicId) : {});
    
    console.log('[ClientAPI] Enterprise data received for group:', groupKey, ':', entrepriseInterne);
    
    const companyName = getEntrepriseNom(entrepriseInterne);
    const companyAddress = getEntrepriseAdresse(entrepriseInterne);
    const companyEmail = getEntrepriseEmail(entrepriseInterne);

    companies.push({
      id: String(groupKey || groupedItems[0]?.projetId || groupedItems[0]?.id),
      nom: companyName,
      contactPrincipal: companyName,
      adresse: companyAddress,
      email: companyEmail,
      projets: groupedItems
        .map(mapProject)
        .sort((a, b) => {
          const dateA = new Date(a.dateRetour || a.deadline || a.dateEnvoi || '').getTime() || 0;
          const dateB = new Date(b.dateRetour || b.deadline || b.dateEnvoi || '').getTime() || 0;
          return dateB - dateA;
        }),
      entrepriseInterne,
    });
  }

  return companies.sort((a, b) => b.projets.length - a.projets.length || a.nom.localeCompare(b.nom));
}

export async function fetchClientCompanies(userEntreprise: string): Promise<ClientCompany[]> {
  const projects = await fetchDemandesParEntreprise(userEntreprise);
  return groupProjects(projects);
}

export function getClientCompaniesTotalProjects(companies: ClientCompany[]) {
  return companies.reduce((sum, company) => sum + company.projets.length, 0);
}
