import { useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NouveauPrixModal from './NouveauPrixModal'
import DeletePrixConfirm from './DeletePrixConfirm'
import { LOTS_OPTIONS, UNITES_OPTIONS } from './catalogueData'
import { addPrixFournisseur } from './articleFournisseurService.jsx'

const PRIX_PER_PAGE = 5

function getConnectedUserUUID() {
  try {
    const user = JSON.parse(sessionStorage.getItem('fournisseur_user') || '{}')
    return user.keycloakId || null
  } catch {
    return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ReadonlyField({ label, value, required, wide }) {
  return (
    <div className={wide ? 'col-12 col-md-6' : 'col-6 col-md-4'}>
      <label className="form-label fw-semibold text-dark mb-1" style={{ fontSize: 13 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div
        className="rounded-3 px-3 py-2 d-flex align-items-center gap-2"
        style={{ background: '#F1F5F9', fontSize: 13, color: '#475569', minHeight: 38 }}
      >
        {value || '—'}
      </div>
    </div>
  )
}

function Pagination({ page, total, onPageChange }) {
  const totalPages = Math.ceil(total / PRIX_PER_PAGE)
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= Math.min(totalPages, 9); i++) pages.push(i)

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-3">
      <button
        className="border-0 bg-transparent text-muted"
        style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        onClick={() => page > 1 && onPageChange(page - 1)}
      >
        <i className="fi fi-rr-angle-left" style={{ fontSize: 13 }} />
      </button>
      {pages.map(p => (
        <button
          key={p}
          className="border-0 rounded-circle d-flex align-items-center justify-content-center fw-semibold"
          style={{
            width: 32, height: 32, fontSize: 13, cursor: 'pointer',
            background: p === page ? '#0978E8' : 'transparent',
            color: p === page ? '#fff' : '#64748b',
          }}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {totalPages > 9 && (
        <>
          <span className="text-muted" style={{ fontSize: 13 }}>...</span>
          <button
            className="border-0 bg-transparent rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32, fontSize: 13, color: '#64748b', cursor: 'pointer' }}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        className="border-0 bg-transparent text-muted"
        style={{
          opacity: page === totalPages ? 0.4 : 1,
          cursor: page === totalPages ? 'not-allowed' : 'pointer',
        }}
        onClick={() => page < totalPages && onPageChange(page + 1)}
      >
        <i className="fi fi-rr-angle-right" style={{ fontSize: 13 }} />
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ModifierArticlePage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Article passed via navigation state
  const article = location.state?.article

  const [prices, setPrices] = useState(
    (article?.priceHistory || []).map(p => ({
      id: p.id,
      pu: p.pu,
      date: p.date,
      addedBy: p.addedBy || article?.addedBy || '—',
    }))
  )

  const [prixPage, setPrixPage] = useState(1)
  const [showNouveauPrix, setShowNouveauPrix] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // price id to delete

  const paginated = useMemo(
    () => prices.slice((prixPage - 1) * PRIX_PER_PAGE, prixPage * PRIX_PER_PAGE),
    [prices, prixPage]
  )

  // ── Handlers ────────────────────────────────────────────────────────────────
  const [isSubmittingPrix, setIsSubmittingPrix] = useState(false)

  const handleAddPrice = async (newPriceData) => {
    setIsSubmittingPrix(true)
    try {
      const uuid = getConnectedUserUUID()
      const payload = { ...newPriceData, ajoutePar: uuid }

      const createdPrix = await addPrixFournisseur(article.id, payload)

      setPrices(prev => [
        {
          id: createdPrix.id || Date.now(),
          pu: createdPrix.prixUnitaire,
          date: createdPrix.dateDebut
            ? new Date(createdPrix.dateDebut).toLocaleDateString('fr-FR').replace(/\//g, ' / ')
            : newPriceData.dateDebut,
          addedBy: article?.addedBy || '—'
        },
        ...prev,
      ])
      setShowNouveauPrix(false)
    } catch (err) {
      alert("Erreur lors de l'ajout du prix : " + err.message)
    } finally {
      setIsSubmittingPrix(false)
    }
  }

  const handleDeletePrice = () => {
    setPrices(prev => prev.filter(p => p.id !== deleteTarget))
    setDeleteTarget(null)
    if (paginated.length === 1 && prixPage > 1) setPrixPage(p => p - 1)
  }

  // ── Guard ────────────────────────────────────────────────────────────────────
  if (!article) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 300 }}>
        <p className="text-muted mb-3">Article introuvable.</p>
        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={() => navigate('/catalogue/articles')}
        >
          Retour au catalogue
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          type="button"
          className="border-0 bg-transparent d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: 36, height: 36, cursor: 'pointer',
            background: '#EFF6FF', color: '#0978E8',
          }}
          onClick={() => navigate('/catalogue/articles')}
        >
          <i className="fi fi-rr-arrow-left" style={{ fontSize: 16 }} />
        </button>
        <h1 className="fw-bold text-primary mb-0" style={{ fontSize: 22 }}>
          Modifier un article
        </h1>
      </div>

      {/* ── Article Details Card ─────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-4 p-4 mb-4"
        style={{ border: '1px solid #E8ECF4' }}
      >
        <h6 className="fw-bold text-dark mb-3" style={{ fontSize: 15 }}>
          Détails de l'article
        </h6>
        <div className="row g-3">
          {/* Row 1 */}
          <ReadonlyField label="Lot d'article" value={article.lot} required />
          <ReadonlyField label="Réf" value={article.ref} required />
          <ReadonlyField label="Unité" value={article.unite} required />
          {/* Row 2 */}
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold text-dark mb-1" style={{ fontSize: 13 }}>
              Nom de l'article <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div
              className="rounded-3 px-3 py-2"
              style={{ background: '#F1F5F9', fontSize: 13, color: '#475569', minHeight: 38 }}
            >
              {article.nom}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold text-dark mb-1" style={{ fontSize: 13 }}>
              Document
            </label>
            {article.documentNom ? (
              <a
                href={article.documentUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="rounded-3 px-3 py-2 d-flex align-items-center gap-2 text-decoration-none"
                style={{ background: '#F1F5F9', fontSize: 13, color: '#0978E8', minHeight: 38 }}
                title={article.documentNom}
              >
                <i className="fi fi-rr-file" style={{ fontSize: 13 }} />
                <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.documentNom}
                </span>
              </a>
            ) : (
              <div
                className="rounded-3 px-3 py-2 d-flex align-items-center gap-2 text-muted"
                style={{ background: '#F1F5F9', fontSize: 13, minHeight: 38 }}
              >
                —
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Prix List Card ───────────────────────────────────────────────────── */}
      <div
        className="bg-white rounded-4 overflow-hidden"
        style={{ border: '1px solid #E8ECF4' }}
      >
        {/* Card header */}
        <div className="d-flex align-items-center justify-content-between px-4 py-3">
          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: 15 }}>
            Liste des prix
          </h6>
          <button
            className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-semibold"
            style={{ background: '#0978E8', color: '#fff', fontSize: 13, border: 'none' }}
            onClick={() => setShowNouveauPrix(true)}
          >
            <i className="fi fi-rr-plus" style={{ fontSize: 13 }} />
            Nouveau Prix
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead style={{ background: '#0978E8' }}>
              <tr style={{ fontSize: 13 }}>
                {['Prix unitaire', 'Dernière mise à jour', 'Ajouté par', 'Action'].map(col => (
                  <th key={col} className="text-white fw-semibold py-3 px-4">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-5" style={{ fontSize: 14 }}>
                    Aucun prix enregistré
                  </td>
                </tr>
              )}
              {paginated.map((p, i) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: i % 2 === 0 ? '#fff' : '#FAFBFF',
                  }}
                >
                  <td className="px-4 py-3 fw-semibold text-dark" style={{ fontSize: 13 }}>
                    {p.pu.toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-dark" style={{ fontSize: 13 }}>
                    {p.date}
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 30, height: 30,
                          background: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                          fontSize: 10, color: '#fff', fontWeight: 700,
                        }}
                      >
                        {p.addedBy?.split(' ').map(w => w[0]).join('') || 'J'}
                      </div>
                      <span style={{ fontSize: 13 }}>{p.addedBy}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      {/* Edit price — placeholder for future */}
                      <button
                        type="button"
                        className="border-0 bg-transparent d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, color: '#0978E8', cursor: 'pointer' }}
                        title="Modifier le prix"
                      >
                        <i className="fi fi-rr-edit" style={{ fontSize: 15 }} />
                      </button>
                      {/* Delete price */}
                      <button
                        type="button"
                        className="border-0 bg-transparent d-flex align-items-center justify-content-center"
                        style={{ width: 30, height: 30, color: '#ef4444', cursor: 'pointer' }}
                        title="Supprimer le prix"
                        onClick={() => setDeleteTarget(p.id)}
                      >
                        <i className="fi fi-rr-trash" style={{ fontSize: 15 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination page={prixPage} total={prices.length} onPageChange={setPrixPage} />
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {showNouveauPrix && (
        <NouveauPrixModal
          onClose={() => setShowNouveauPrix(false)}
          onAdd={handleAddPrice}
          isSubmitting={isSubmittingPrix}
        />
      )}

      {deleteTarget !== null && (
        <DeletePrixConfirm
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeletePrice}
        />
      )}
    </div>
  )
}
