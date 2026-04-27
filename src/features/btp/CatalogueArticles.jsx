/**
 * CatalogueArticles.jsx — Page "Ma bibliothèque"
 *
 * Responsabilité : affichage du tableau d'articles + navigation.
 * Toute la logique métier est déléguée au hook useArticlesFournisseur.
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useArticlesFournisseur } from './useArticlesFournisseur.jsx'
import ConsultationPanel from './ConsultationPanel'
import AddArticleModal from './AddArticleModal'

const ITEMS_PER_PAGE = 10

// ─── Composants UI purs ───────────────────────────────────────────────────────

function StatCard({ icon, iconBg, iconColor, value, label }) {
  return (
    <div
      className="d-flex align-items-center gap-3 p-3 bg-white rounded-4"
      style={{ flex: 1, border: '1px solid #E8ECF4' }}
    >
      <div
        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 50, height: 50, background: iconBg }}
      >
        <i className={`fi ${icon}`} style={{ color: iconColor, fontSize: 22 }} />
      </div>
      <div>
        <div className="fw-bold text-dark" style={{ fontSize: 26, lineHeight: 1 }}>{value}</div>
        <div className="text-muted" style={{ fontSize: 13 }}>{label}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const isAJour = status === 'a_jour'
  return (
    <span
      className="rounded-pill px-3 py-1 fw-semibold"
      style={{
        fontSize: 12,
        background: isAJour ? '#DCFCE7' : '#EFF6FF',
        color: isAJour ? '#16a34a' : '#1d4ed8',
      }}
    >
      {isAJour ? 'A jour' : 'Chiffré'}
    </span>
  )
}

function ActionBtn({ icon, color, title, onClick }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="border-0 bg-transparent d-flex align-items-center justify-content-center"
      style={{ width: 30, height: 30, cursor: 'pointer', color }}
    >
      <i className={`fi ${icon}`} style={{ fontSize: 16 }} />
    </button>
  )
}

function TablePagination({ page, total, onPageChange }) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  if (totalPages <= 1) return null

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-4">
      <button
        className="border-0 bg-transparent text-muted"
        style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        onClick={() => page > 1 && onPageChange(page - 1)}
      >
        <i className="fi fi-rr-angle-left" style={{ fontSize: 14 }} />
      </button>

      {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          className="border-0 rounded-circle d-flex align-items-center justify-content-center fw-semibold"
          style={{
            width: 34, height: 34, fontSize: 14, cursor: 'pointer',
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
          <span className="text-muted">…</span>
          <button
            className="border-0 bg-transparent rounded-circle fw-semibold"
            style={{ width: 34, height: 34, fontSize: 14, color: '#64748b', cursor: 'pointer' }}
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
        <i className="fi fi-rr-angle-right" style={{ fontSize: 14 }} />
      </button>
    </div>
  )
}

function DocumentCell({ nom, url }) {
  if (!nom) return <span className="text-muted" style={{ fontSize: 12 }}>—</span>
  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noreferrer"
      className="d-flex align-items-center gap-1 text-decoration-none"
      style={{ color: '#0978E8', fontSize: 12 }}
      title={nom}
    >
      <i className="fi fi-rr-file" style={{ fontSize: 13 }} />
      <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
        {nom}
      </span>
    </a>
  )
}

function LoadingRows({ cols }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
      {Array.from({ length: cols }).map((__, j) => (
        <td key={j} className="px-3 py-3">
          <div
            className="rounded"
            style={{ height: 14, background: '#E8ECF4', animation: 'pulse 1.5s infinite' }}
          />
        </td>
      ))}
    </tr>
  ))
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div
      className="d-flex align-items-center justify-content-between px-4 py-3 rounded-3 mb-3"
      style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
    >
      <div className="d-flex align-items-center gap-2 text-danger" style={{ fontSize: 13 }}>
        <i className="fi fi-rr-exclamation" />
        {message}
      </div>
      <button
        className="btn btn-sm btn-outline-danger rounded-pill px-3"
        style={{ fontSize: 12 }}
        onClick={onRetry}
      >
        Réessayer
      </button>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function CatalogueArticles() {
  const navigate = useNavigate()
  const { rows, isLoading, error, addArticle, removeArticle, reload } = useArticlesFournisseur()

  const [searchTerm, setSearchTerm]     = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [page, setPage]                 = useState(1)
  const [consultArticle, setConsultArticle] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addError, setAddError]         = useState(null)

  // ── Filtrage ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return rows.filter(a => {
      const matchSearch = !q || a.nom.toLowerCase().includes(q)
        || a.ref.toLowerCase().includes(q)
        || a.lot.toLowerCase().includes(q)
      const matchStatus = filterStatus === 'all' || a.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [rows, searchTerm, filterStatus])

  const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalAJour  = rows.filter(a => a.status === 'a_jour').length

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSearch = (e) => { setSearchTerm(e.target.value); setPage(1) }
  const handleFilterStatus = (e) => { setFilterStatus(e.target.value); setPage(1) }

  const handleAdd = async (form, documentFile) => {
    setAddError(null)
    try {
      await addArticle(form, documentFile)  // prepend to rows immediately
      setShowAddModal(false)                 // ferme le modal après succès
      setPage(1)
    } catch (err) {
      // L'erreur reste dans le modal — l'utilisateur peut corriger
      setAddError(err.message || "Erreur lors de l'ajout.")
    }
  }

  const handleModifier = (art) => {
    navigate(`/catalogue/articles/${art.id}/modifier`, { state: { article: art } })
  }

  const handleDelete = (id) => {
    // Optimistic UI — suppression locale immédiate
    removeArticle(id)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>

      {/* En-tête */}
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <h1 className="fw-bold text-dark mb-1" style={{ fontSize: 22 }}>
            Ma bibliothèque
          </h1>
          <p className="text-muted mb-0" style={{ fontSize: 13 }}>
            Centralisez tous vos articles en un seul endroit organisé.
          </p>
        </div>
        <button
          className="btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 fw-semibold"
          style={{ background: '#0978E8', color: '#fff', fontSize: 14, border: 'none' }}
          onClick={() => setShowAddModal(true)}
        >
          <i className="fi fi-rr-plus" style={{ fontSize: 14 }} />
          Ajouter un article
        </button>
      </div>

      {/* Stat Cards */}
      <div className="d-flex gap-3 mb-4" style={{ maxWidth: 520 }}>
        <StatCard
          icon="fi-rr-box-alt"
          iconBg="linear-gradient(135deg,#a78bfa,#7c3aed)"
          iconColor="#fff"
          value={isLoading ? '…' : rows.length}
          label="Total articles"
        />
        <StatCard
          icon="fi-rr-check-circle"
          iconBg="#DCFCE7"
          iconColor="#16a34a"
          value={isLoading ? '…' : totalAJour}
          label="Prix à jour"
        />
      </div>

      {/* Erreur réseau */}
      {error && <ErrorBanner message={error} onRetry={reload} />}

      {/* Filtres */}
      <div className="d-flex align-items-center justify-content-end gap-2 mb-3">
        <div
          className="d-flex align-items-center rounded-pill bg-white px-3"
          style={{ border: '1px solid #E8ECF4', height: 38, minWidth: 240 }}
        >
          <i className="fi fi-rr-search text-muted me-2" style={{ fontSize: 13 }} />
          <input
            type="text"
            className="border-0 bg-transparent w-100"
            style={{ outline: 'none', fontSize: 13 }}
            placeholder="Rechercher"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <select
          className="form-select form-select-sm rounded-pill bg-white fw-semibold"
          style={{ width: 110, fontSize: 13, border: '1px solid #E8ECF4', height: 38 }}
          value={filterStatus}
          onChange={handleFilterStatus}
        >
          <option value="all">Statut</option>
          <option value="a_jour">A jour</option>
          <option value="chiffre">Chiffré</option>
        </select>
        <select
          className="form-select form-select-sm rounded-pill bg-white fw-semibold"
          style={{ width: 100, fontSize: 13, border: '1px solid #E8ECF4', height: 38 }}
        >
          <option>Date</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-4 overflow-hidden" style={{ border: '1px solid #E8ECF4' }}>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead style={{ background: '#0978E8' }}>
              <tr style={{ fontSize: 13 }}>
                {['Lot', 'Réf. / Nom', 'Unité', 'PU', 'Dernière MAJ', 'Document', 'Statut', 'Action'].map(col => (
                  <th key={col} className="text-white fw-semibold py-3 px-3" style={{ whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading && <LoadingRows cols={8} />}

              {!isLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-5" style={{ fontSize: 14 }}>
                    {error ? 'Erreur de chargement.' : 'Aucun article trouvé.'}
                  </td>
                </tr>
              )}

              {!isLoading && paginated.map((art, i) => (
                <tr
                  key={art.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: i % 2 === 0 ? '#fff' : '#FAFBFF',
                  }}
                >
                  <td className="px-3 py-3 fw-semibold text-dark" style={{ fontSize: 13 }}>{art.lot}</td>

                  <td className="px-3 py-3" style={{ minWidth: 220 }}>
                    <div className="fw-semibold text-dark" style={{ fontSize: 13 }}>{art.nom}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>{art.ref}</div>
                  </td>

                  <td className="px-3 py-3 text-dark" style={{ fontSize: 13 }}>{art.unite}</td>

                  <td className="px-3 py-3 fw-semibold text-dark" style={{ fontSize: 13 }}>
                    {parseFloat(art.pu).toFixed(2)} €
                  </td>

                  <td className="px-3 py-3 text-dark" style={{ fontSize: 13 }}>{art.lastUpdate}</td>

                  <td className="px-3 py-3">
                    <DocumentCell nom={art.documentNom} url={art.documentUrl} />
                  </td>

                  <td className="px-3 py-3">
                    <StatusBadge status={art.status} />
                  </td>

                  <td className="px-3 py-3">
                    <div className="d-flex align-items-center gap-1">
                      <ActionBtn
                        icon="fi-rr-eye"
                        color="#F59E0B"
                        title="Consulter"
                        onClick={() => setConsultArticle(art)}
                      />
                      <ActionBtn
                        icon="fi-rr-edit"
                        color="#0978E8"
                        title="Modifier"
                        onClick={() => handleModifier(art)}
                      />
                      <ActionBtn
                        icon="fi-rr-trash"
                        color="#ef4444"
                        title="Supprimer"
                        onClick={() => handleDelete(art.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination page={page} total={filtered.length} onPageChange={setPage} />
      </div>

      {/* Panneau consultation */}
      {consultArticle && (
        <ConsultationPanel
          article={consultArticle}
          onClose={() => setConsultArticle(null)}
        />
      )}

      {/* Modal ajout */}
      {showAddModal && (
        <AddArticleModal
          serverError={addError}
          onClose={() => { setShowAddModal(false); setAddError(null) }}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
