import { getBackendURL } from '../../shared/lib/api-bridge';

const API_URL = `${getBackendURL()}/api/fournisseurs`;

function authHeaders() {
    const token = sessionStorage.getItem('fournisseur_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getEquipeMembers = async () => {
    const response = await fetch(`${API_URL}/equipe`, {
        headers: {
            ...authHeaders()
        }
    });

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des membres');
    }

    const data = await response.json();
    return data.data;
};

export const inviteEquipeMember = async (memberData) => {
    const response = await fetch(`${API_URL}/equipe`, {
        method: 'POST',
        headers: {
            ...authHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erreur lors de l\'invitation du membre');
    }

    return response.json();
};

