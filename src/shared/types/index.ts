// Shared TypeScript types for the fournisseur portal

export interface FournisseurUser {
  id: number;
  email: string;
  nomEntreprise: string;
  nomContact: string;
  telephone?: string;
  isActive: boolean;
  keycloakId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DemandeChiffrage {
  id: number;
  projetId: number;
  projetNom: string;
  client: string;
  dateReception: string;
  dateEcheance: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE';
  nombreArticles: number;
  montantEstime?: number;
}

export interface ArticleCatalogue {
  id: number;
  reference: string;
  designation: string;
  unite: string;
  prixUnitaire: number;
  dateMAJ: string;
  categorie: string;
  niveau1?: string;
  niveau2?: string;
}

export interface DevisEnvoye {
  id: number;
  reference: string;
  projetNom: string;
  dateEnvoi: string;
  montantTotal: number;
  statut: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE' | 'EN_NEGOCIATION';
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  children?: NavItem[];
}
