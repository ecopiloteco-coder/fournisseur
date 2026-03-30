import { getBackendURL } from '../../../shared/lib/api-bridge';

export interface ProjetFournisseurResponse {
  id: number;
  publicId: string;
  nomProjet: string;
  projetId: number;
  status: 'en_attente' | 'en_cours' | 'termine';
  userEntreprise: string;
  deadline: string;
  prixTotal: number;
  prixVente: number | null;
  lots?: ProjetLotFournisseurResponse[];
  fichiers?: FichierResponse[];
}

export interface ProjetLotFournisseurResponse {
  id: number;
  nomProjetLot: string;
  prixTotal: number;
  prixVente: number | null;
  articles: ArticleProjetFournisseurResponse[];
}

export interface ArticleProjetFournisseurResponse {
  id: number;
  status: string;
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

// Helper pour obtenir les headers avec le token
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('fournisseur_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function fetchDemandesParEntreprise(userEntreprise: string): Promise<ProjetFournisseurResponse[]> {
  const baseUrl = getBackendURL();
  const url = `${baseUrl}/api/projet-fournisseur/projets?userEntreprise=${encodeURIComponent(userEntreprise)}`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  
  if (!response.ok) {
    if (response.status === 401) throw new Error('Non autorisé. Veuillez vous reconnecter.');
    throw new Error('Erreur lors de la récupération des demandes de chiffrage.');
  }
  
  const result = await response.json();
  return result.data || [];
}

export async function fetchDemandeById(id: number): Promise<ProjetFournisseurResponse> {
  const baseUrl = getBackendURL();
  const url = `${baseUrl}/api/projet-fournisseur/projets/${id}`;
  const response = await fetch(url, { headers: getAuthHeaders() });
  
  if (!response.ok) throw new Error('Erreur lors de la récupération du détail du projet.');
  
  const result = await response.json();
  return result.data;
}

export async function chiffrerArticle(articleProjetId: number, payload: {
  prixUnitaire: number;
  tva: number;
  rabais: number;
  remarque: string;
}): Promise<ArticleProjetFournisseurResponse> {
  const baseUrl = getBackendURL();
  const url = `${baseUrl}/api/projet-fournisseur/articles-projet/${articleProjetId}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) throw new Error('Erreur lors de l\'enregistrement du prix.');
  
  const result = await response.json();
  return result.data;
}

export async function soumettreDevis(projetId: number, fournisseurNom: string): Promise<ProjetFournisseurResponse> {
  const baseUrl = getBackendURL();
  const url = `${baseUrl}/api/projet-fournisseur/projets/${projetId}/status?status=termine&fournisseurNom=${encodeURIComponent(fournisseurNom)}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) throw new Error('Erreur lors de la soumission du devis.');
  
  const result = await response.json();
  return result.data;
}

export async function uploadProjetFichier(projetId: number, file: File): Promise<FichierResponse> {
  const baseUrl = getBackendURL();
  const url = `${baseUrl}/api/projet-fournisseur/projets/${projetId}/fichiers`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  const token = sessionStorage.getItem('fournisseur_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers, // Do NOT set Content-Type to application/json, fetch will set multipart/form-data
    body: formData
  });
  
  if (!response.ok) throw new Error('Erreur lors du téléversement du fichier.');
  
  const result = await response.json();
  return result.data;
}

export async function uploadArticleFichier(articleProjetId: number, file: File): Promise<FichierResponse> {
  const baseUrl = getBackendURL();
  const url = `${baseUrl}/api/projet-fournisseur/articles-projet/${articleProjetId}/fichiers`;
  
  const formData = new FormData();
  formData.append('file', file);
  
  const token = sessionStorage.getItem('fournisseur_token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData
  });
  
  if (!response.ok) throw new Error('Erreur lors du téléversement du fichier article.');
  
  const result = await response.json();
  return result.data;
}
