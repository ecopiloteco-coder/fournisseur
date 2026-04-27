import { getBackendURL } from '../../shared/lib/api-bridge';

const API_URL = `${getBackendURL()}/api/fournisseurs`;

const authHeaders = () => {
    const token = sessionStorage.getItem('fournisseur_token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

// ─── Mon Profil ───────────────────────────────────────────────────
export const getMyProfile = async () => {
    const res = await fetch(`${API_URL}/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Erreur chargement profil');
    const data = await res.json();
    return data.data;
};

export const updateMyProfile = async (profileData) => {
    const res = await fetch(`${API_URL}/me`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur mise à jour du profil');
    return data;
};

// ─── Mon Entreprise ───────────────────────────────────────────────
export const getMyEntreprise = async () => {
    const res = await fetch(`${API_URL}/entreprises/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Erreur chargement entreprise');
    const data = await res.json();
    return data.data;
};

export const updateMyEntreprise = async (entrepriseData) => {
    const res = await fetch(`${API_URL}/entreprises/me`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(entrepriseData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erreur mise à jour entreprise');
    return data;
};

// ─── Mon Abonnement ───────────────────────────────────────────────
export const getMyAbonnement = async () => {
    const res = await fetch(`${API_URL}/abonnements/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Erreur chargement abonnement');
    const data = await res.json();
    return data.data;
};
