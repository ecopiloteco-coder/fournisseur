/**
 * dashboardService.jsx
 *
 * Client API pour le dashboard du fournisseur.
 * Service: projet-fournisseur-service (via gateway :8080)
 *
 * Endpoints:
 *   GET /api/projet-fournisseur/dashboard/analytics → dashboard KPI, charts, recent projects
 */

import { getBackendURL } from '../../shared/lib/api-bridge'

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE = () => `${getBackendURL()}/api/projet-fournisseur/dashboard`

function authHeaders() {
  const token = sessionStorage.getItem('fournisseur_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(res) {
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`)
  return json?.data ?? json
}

// ─── Dashboard Analytics ──────────────────────────────────────────────────────

/**
 * Fetch dashboard analytics: KPI overview, monthly evolution, project status, recent projects.
 * @param {string} userEntreprise - UUID of the user's entreprise
 * @returns {Promise<Object>} Dashboard analytics data
 */
export async function fetchDashboardAnalytics(userEntreprise) {
  const query = userEntreprise
    ? `?userEntreprise=${encodeURIComponent(userEntreprise)}`
    : ''
  const url = `${BASE()}/analytics${query}`
  console.log('Fetching dashboard analytics from:', url)
  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  })
  const json = await res.json().catch(() => ({}))
  console.log('Dashboard API response:', { status: res.status, data: json })
  if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`)
  return json?.data ?? json
}
