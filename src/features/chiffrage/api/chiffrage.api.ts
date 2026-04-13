import { getBackendURL } from '../../../shared/lib/api-bridge';

// ── Types ──────────────────────────────────────────────────────────────────

/** Fournisseur-side project status */
export type ProjetStatus = 'en_attente' | 'en_cours' | 'termine' | 'expire' | 'archive';

/** Intern-side review decision (set after supplier submits devis) */
export type ProjetStatusInterne = 'accepte_interne' | 'refuse_interne' | null;

/**
 * Article status — two-phase lifecycle:
 * Phase 1 (fournisseur): en_attente_chiffrage → chiffre | signale
 * Phase 2 (intern):      en_attente_validation → valide | rejete
 */
export type ArticleStatus =
  | 'en_attente_chiffrage'
  | 'chiffre'
  | 'signale'
  | 'en_attente_validation'
  | 'valide'
  | 'rejete';

export interface ArticleProjetFournisseurResponse {
  id: number;
  status: ArticleStatus;
  remarque: string;
  dateChiffrage: string;
  quantite: number;
  prixUnitaire: number;
  prixTotalHt: number;
  tva: number;
  prixTotal: number;
  rabais: number;
  articleId: number | null;
  unite: string;
  description: string;
  // Phase 1 — supplier flags a problem
  motifSignalement?: string;
  descriptionSignalement?: string;
  photoSignalement?: string;
  // Phase 2 — intern rejects a price
  motifRefusInterne?: string;
  descriptionRefusInterne?: string;
  fichiers?: FichierResponse[];
}

export interface ProjetLotFournisseurResponse {
  id: number;
  nomProjetLot: string;
  interneLotId?: number;
  prixTotal: number;
  prixVente: number | null;
  articles: ArticleProjetFournisseurResponse[];
}

export interface ProjetFournisseurResponse {
  id: number;
  publicId: string;
  nomProjet: string;
  projetId: number;
  /** Fournisseur-side status */
  status: ProjetStatus;
  /** Intern-side review decision */
  statusInterne: ProjetStatusInterne;
  userEntreprise: string;
  deadline: string;
  dateEnvoi?: string;
  dateRetour?: string;
  prixTotal: number;
  prixVente: number | null;
  fournisseurNom?: string;
  // Fournisseur refusal motifs
  motifRefusFournisseur?: string;
  descriptionRefusFournisseur?: string;
  // Intern refusal motifs
  motifRefusInterne?: string;
  descriptionRefusInterne?: string;
  lots?: ProjetLotFournisseurResponse[];
  fichiers?: FichierResponse[];
}

export interface FichierResponse {
  id: number;
  publicId: string;
  nomFichier: string;
  mimeType: string;
  taille: number;
  ajouteAt: string;
  url: string; // Presigned URL
}

// ── Auth Helper ────────────────────────────────────────────────────────────

const getAuthHeaders = (): Record<string, string> => {
  const token = sessionStorage.getItem('fournisseur_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ── API Calls ──────────────────────────────────────────────────────────────

/** Fetch all projects for a supplier company */
export async function fetchDemandesParEntreprise(userEntreprise: string): Promise<ProjetFournisseurResponse[]> {
  const url = `${getBackendURL()}/api/projet-fournisseur/projets?userEntreprise=${encodeURIComponent(userEntreprise)}`;
  const response = await fetch(url, { headers: getAuthHeaders() });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Non autorisé. Veuillez vous reconnecter.');
    throw new Error('Erreur lors de la récupération des demandes de chiffrage.');
  }

  const result = await response.json();
  const data = result.data || result || [];
  return Array.isArray(data) ? data : [];
}

/** Fetch a single project by its internal DB id */
export async function fetchDemandeById(id: number): Promise<ProjetFournisseurResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/projets/${id}`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Erreur lors de la récupération du détail du projet.');
  const result = await response.json();
  return result.data;
}

/**
 * Supplier prices an article.
 * Transitions article status: en_attente_chiffrage → chiffre
 */
export async function chiffrerArticle(articleProjetId: number, payload: {
  prixUnitaire: number;
  tva: number;
  rabais: number;
  remarque: string;
}): Promise<ArticleProjetFournisseurResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/articles-projet/${articleProjetId}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erreur lors de l\'enregistrement du prix.');
  const result = await response.json();
  return result.data;
}

/**
 * Supplier submits the complete devis.
 * Transitions project status: en_cours → termine
 * Backend automatically transitions all articles: chiffre → en_attente_validation
 */
export async function soumettreDevis(projetId: number, fournisseurNom: string): Promise<ProjetFournisseurResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/projets/${projetId}/status?fournisseurNom=${encodeURIComponent(fournisseurNom)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: 'termine' }),
  });
  if (!response.ok) throw new Error('Erreur lors de la soumission du devis.');
  const result = await response.json();
  return result.data;
}

/**
 * Supplier refuses the project.
 * Transitions project status: en_attente → expire
 */
export async function refuserProjet(projetId: number, payload: {
  motifRefus: string;
  descriptionRefus: string;
  photoRefusUrl?: string;
}): Promise<ProjetFournisseurResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/projets/${projetId}/status`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status: 'expire',
      motifRefus: payload.motifRefus,
      descriptionRefus: payload.descriptionRefus,
      photoRefusUrl: payload.photoRefusUrl,
    }),
  });
  if (!response.ok) throw new Error('Erreur lors du refus du projet.');
  const result = await response.json();
  return result.data;
}

/**
 * Supplier signals a problem with an article.
 * Transitions article status: en_attente_chiffrage → signale
 */
export async function signalerArticle(articleProjetId: number, payload: {
  motif: string;
  description: string;
  photoUrl?: string;
}): Promise<ArticleProjetFournisseurResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/articles-projet/${articleProjetId}/signaler`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erreur lors du signalement de l\'article.');
  const result = await response.json();
  return result.data;
}

/**
 * Generic project status update (used internally for custom transitions).
 * Prefer typed wrappers: refuserProjet(), soumettreDevis() when possible.
 */
export async function updateProjetStatus(projetId: number, payload: {
  status: string;
  motifRefus?: string;
  descriptionRefus?: string;
  photoRefusUrl?: string;
}): Promise<ProjetFournisseurResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/projets/${projetId}/status`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Erreur lors de la mise à jour du statut.');
  const result = await response.json();
  return result.data;
}

/** Upload a file attached to a project */
export async function uploadProjetFichier(projetId: number, file: File): Promise<FichierResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/projets/${projetId}/fichiers`;
  const formData = new FormData();
  formData.append('file', file);
  const token = sessionStorage.getItem('fournisseur_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { method: 'POST', headers, body: formData });
  if (!response.ok) throw new Error('Erreur lors du téléversement du fichier.');
  const result = await response.json();
  return result.data;
}

/** Upload a file attached to an article */
export async function uploadArticleFichier(articleProjetId: number, file: File): Promise<FichierResponse> {
  const url = `${getBackendURL()}/api/projet-fournisseur/articles-projet/${articleProjetId}/fichiers`;
  const formData = new FormData();
  formData.append('file', file);
  const token = sessionStorage.getItem('fournisseur_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, { method: 'POST', headers, body: formData });
  if (!response.ok) throw new Error('Erreur lors du téléversement du fichier article.');
  const result = await response.json();
  return result.data;
}
