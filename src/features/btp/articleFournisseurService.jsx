/**
 * articleFournisseurService.jsx
 *
 * Client API pour le catalogue d'articles du fournisseur.
 * Service: projet-fournisseur-service (via gateway :8080)
 *
 * Endpoints:
 *   GET    /api/projet-fournisseur/articles              → liste active
 *   POST   /api/projet-fournisseur/articles              → créer article
 *   POST   /api/projet-fournisseur/articles/{id}/prix    → ajouter un prix
 *   POST   /api/projet-fournisseur/articles/{id}/fichiers → upload document MinIO
 */

import { getBackendURL } from '../../shared/lib/api-bridge'

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE = () => `${getBackendURL()}/api/projet-fournisseur/articles`

function authHeaders() {
  const token = sessionStorage.getItem('fournisseur_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`)
  return json?.data ?? json
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export async function fetchArticlesFournisseur() {
  const res = await fetch(BASE(), { 
    headers: { 
      ...authHeaders(),
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    } 
  })
  return handleResponse(res)
}

export async function fetchHistoriquePrixAnalytics(userEntreprise) {
  const query = userEntreprise
    ? `?userEntreprise=${encodeURIComponent(userEntreprise)}`
    : ''
  const res = await fetch(`${BASE()}/analytics/historique${query}`, {
    headers: {
      ...authHeaders(),
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
  return handleResponse(res)
}

export async function createArticleFournisseur(payload) {
  const res = await fetch(BASE(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

// ─── Prix ─────────────────────────────────────────────────────────────────────

export async function addPrixFournisseur(articleId, payload) {
  const res = await fetch(`${BASE()}/${articleId}/prix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

// ─── Documents MinIO ──────────────────────────────────────────────────────────

export async function uploadDocumentArticle(articleId, file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE()}/${articleId}/fichiers`, {
    method: 'POST',
    headers: authHeaders(), // pas de Content-Type → browser gère le boundary
    body: form,
  })
  return handleResponse(res)
}

// ─── Flow complet ─────────────────────────────────────────────────────────────

export async function createArticleComplet(form, documentFile, ajouteParUUID) {
  const coefficientVente = form.coefficient === '' || form.coefficient == null
    ? null
    : parseFloat(form.coefficient)

  const article = await createArticleFournisseur({
    lot: form.lot,
    nomArticle: form.nom,
    refArticle: form.ref,
    unite: form.unite,
    description: form.commentaires || '',
    ajoutePar: ajouteParUUID,
  })

  const prix = await addPrixFournisseur(article.id, {
    prixUnitaire: parseFloat(form.pu) || 0,
    fourniture: parseFloat(form.fourniture) || 0,
    accessoires: parseFloat(form.accessoires) || 0,
    pose: parseFloat(form.pose) || 0,
    cadence: parseFloat(form.cadence) || 0,
    coefficientVente,
    dateDebut: form.date,
    ajoutePar: ajouteParUUID,
  })

  const fichier = documentFile
    ? await uploadDocumentArticle(article.id, documentFile)
    : null

  return { article, prix, fichier }
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

export function mapArticleToRow(a) {
  const activePrix = a.prix?.find(p => p.isActive) ?? a.prix?.[0] ?? null

  return {
    id: a.id,
    publicId: a.publicId,
    lot: a.lot || '—',
    ref: a.refArticle || '—',
    nom: a.nomArticle || a.description || '—',
    unite: a.unite || '—',
    pu: activePrix?.prixUnitaire ?? 0,
    lastUpdate: activePrix?.dateDebut
      ? new Date(activePrix.dateDebut).toLocaleDateString('fr-FR').replace(/\//g, ' / ')
      : '—',
    status: activePrix ? 'a_jour' : 'chiffre',
    addedBy: a.ajoutePar || '',
    documentNom: a.fichiers?.[0]?.nomFichier || null,
    documentUrl: a.fichiers?.[0]?.url || null,
    prixList: a.prix || [],
    fichiers: a.fichiers || [],
    fourniture: activePrix?.fourniture ?? 0,
    accessoires: activePrix?.accessoires ?? 0,
    pose: activePrix?.pose ?? 0,
    cadence: activePrix?.cadence ?? 0,
    coefficient: activePrix?.coefficientVente ?? 0,
    annualPU: (a.prix || []).map(p => parseFloat(p.prixUnitaire) || 0).reverse(),
    priceHistory: (a.prix || []).map(p => ({
      id: p.id,
      pu: parseFloat(p.prixUnitaire) || 0,
      date: p.dateDebut
        ? new Date(p.dateDebut).toLocaleDateString('fr-FR').replace(/\//g, ' / ')
        : '—',
      addedBy: a.ajoutePar || '',
      nombreProjets: p.nombreProjets || 0,
      isActive: p.isActive,
    })),
  }
}
