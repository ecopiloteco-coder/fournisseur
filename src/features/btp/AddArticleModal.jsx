import { useState, useRef } from 'react'
import { LOTS_OPTIONS, UNITES_OPTIONS, EMPTY_FORM } from './catalogueData'

/**
 * AddArticleModal — modal to add a new article to the library.
 * @param {Object} props
 * @param {Function} props.onClose - callback when modal closes
 * @param {Function} props.onAdd - callback when article is added (receives form, file)
 * @param {string} [props.serverError] - optional error message to display
 * @param {Object} [props.initialData] - optional initial form data for pre-filling
 * @param {boolean} [props.isSubmitting] - optional override for submit button state
 */
export default function AddArticleModal({ onClose, onAdd, serverError, initialData, isSubmitting: isSubmittingProp }) {
  const [form, setForm] = useState(initialData || EMPTY_FORM)
  const [isSubmitting, setSubmitting] = useState(false)
  const fileRef = useRef(null)

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const isValid = form.lot && form.ref && form.nom && form.date && form.pu && form.unite

  const handleAdd = async () => {
    if (!isValid || isSubmitting) return
    setSubmitting(true)
    try {
      // Passe (form, fichier) séparément — le parent appelle l'API
      await onAdd(form, form.document || null)
      // onClose est appelé par le parent si tout va bien
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal d-block"
      style={{ zIndex: 9001, backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
        style={{ maxWidth: 480 }}
      >
        <div className="modal-content border-0 shadow-lg rounded-4">

          {/* Header */}
          <div className="modal-header border-0 px-4 pt-4 pb-2 d-flex align-items-center gap-2">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 30, height: 30, background: '#EFF6FF' }}
            >
              <i className="fi fi-rr-plus" style={{ color: '#0978E8', fontSize: 14 }} />
            </div>
            <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: 15 }}>
              Ajouter un article dans la bibliothèque
            </h5>
          </div>

          {/* Body */}
          <div className="modal-body px-4 pb-2 pt-3">

            {/* Row 1 — Lot + REF */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <FormLabel text="Lot d'article" required />
                <select
                  className="form-select form-select-sm bg-light border-0 rounded-3"
                  style={{ color: form.lot ? '#1e2235' : '#94a3b8' }}
                  value={form.lot}
                  onChange={e => set('lot', e.target.value)}
                >
                  <option value="">Choisir le lot</option>
                  {LOTS_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="col-6">
                <FormLabel text="REF" required />
                <input
                  type="text"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="Saisir la référence"
                  value={form.ref}
                  onChange={e => set('ref', e.target.value)}
                />
              </div>
            </div>

            {/* Row 2 — Nom */}
            <div className="mb-3">
              <FormLabel text="Nom de l'article" required />
              <input
                type="text"
                className="form-control form-control-sm bg-light border-0 rounded-3"
                placeholder="Saisir le nom de l'article"
                value={form.nom}
                onChange={e => set('nom', e.target.value)}
              />
            </div>

            {/* Row 3 — Date */}
            <div className="mb-3">
              <FormLabel text="Date" required />
              <input
                type="date"
                className="form-control form-control-sm bg-light border-0 rounded-3"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>

            {/* Row 4 — PU + Unité */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <FormLabel text="Prix unitaire" required />
                <input
                  type="number"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="Saisir le prix unitaire"
                  value={form.pu}
                  onChange={e => set('pu', e.target.value)}
                />
              </div>
              <div className="col-6">
                <FormLabel text="Unité" required />
                <select
                  className="form-select form-select-sm bg-light border-0 rounded-3"
                  style={{ color: form.unite ? '#1e2235' : '#94a3b8' }}
                  value={form.unite}
                  onChange={e => set('unite', e.target.value)}
                >
                  <option value="">Saisir l'unité</option>
                  {UNITES_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Document */}
            <div className="mb-3">
              <FormLabel text="Document" />
              <button
                type="button"
                className="btn btn-sm d-flex align-items-center gap-2 rounded-3 border"
                style={{ background: '#F8FAFC', color: '#0978E8', borderColor: '#CBD5E1', fontSize: 13 }}
                onClick={() => fileRef.current?.click()}
              >
                <i className="fi fi-rr-upload" />
                {form.document ? form.document.name : 'Importer un document'}
              </button>
              <input
                ref={fileRef}
                type="file"
                className="d-none"
                onChange={e => set('document', e.target.files?.[0] || null)}
              />
            </div>

            {/* Decompose Checkbox */}
            <div className="form-check mb-3 d-flex align-items-center gap-2">
              <input
                className="form-check-input mt-0 shadow-none"
                type="checkbox"
                id="decomposeCheck"
                checked={form.decompose || false}
                onChange={e => set('decompose', e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label className="form-check-label text-muted fw-medium" htmlFor="decomposeCheck" style={{ fontSize: '13px', cursor: 'pointer' }}>
                Je souhaite décomposer le prix
              </label>
            </div>

            {/* Conditional Decompose Fields */}
            {form.decompose && (
              <div className="animate__animated animate__fadeIn" style={{ marginBottom: '1rem' }}>

                {/* Row 5 — Fourniture + Accessoires + Pose */}
                <div className="row g-3 mb-3">
                  <div className="col-4">
                    <FormLabel text="Fourniture (€)" />
                    <input
                      type="number"
                      className="form-control form-control-sm bg-light border-0 rounded-3"
                      placeholder="Saisir le montant"
                      value={form.fourniture}
                      onChange={e => set('fourniture', e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <FormLabel text="Accessoires (€)" />
                    <input
                      type="number"
                      className="form-control form-control-sm bg-light border-0 rounded-3"
                      placeholder="Saisir le montant"
                      value={form.accessoires}
                      onChange={e => set('accessoires', e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <FormLabel text="Pose (€)" />
                    <input
                      type="number"
                      className="form-control form-control-sm bg-light border-0 rounded-3"
                      placeholder="Saisir le montant"
                      value={form.pose}
                      onChange={e => set('pose', e.target.value)}
                    />
                  </div>
                </div>

                {/* Row 6 — Cadence + Coefficient */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <FormLabel text="Cadence en heure" />
                    <input
                      type="number"
                      className="form-control form-control-sm bg-light border-0 rounded-3"
                      placeholder="Saisir la cadence"
                      value={form.cadence}
                      onChange={e => set('cadence', e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <FormLabel text="Coefficient de vente" />
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-sm bg-light border-0 rounded-3"
                      placeholder="Saisir le coefficient"
                      value={form.coefficient}
                      onChange={e => set('coefficient', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Erreur serveur */}
          {serverError && (
            <div
              className="mx-4 mb-2 px-3 py-2 rounded-3 d-flex align-items-center gap-2"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', fontSize: 12, color: '#dc2626' }}
            >
              <i className="fi fi-rr-exclamation" />
              {serverError}
            </div>
          )}

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              style={{ minWidth: 120, fontSize: 14 }}
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="btn rounded-pill px-4 fw-semibold d-flex align-items-center gap-2"
              style={{
                minWidth: 120, fontSize: 14,
                background: isValid && !isSubmitting && !isSubmittingProp ? '#0978E8' : '#cbd5e1',
                color: '#fff', border: 'none',
              }}
              onClick={handleAdd}
              disabled={!isValid || isSubmitting || isSubmittingProp}
            >
              {(isSubmitting || isSubmittingProp) && (
                <span className="spinner-border spinner-border-sm" role="status" />
              )}
              {isSubmitting || isSubmittingProp ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function FormLabel({ text, required }) {
  return (
    <label className="form-label mb-1 fw-semibold text-dark" style={{ fontSize: 13 }}>
      {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
  )
}
