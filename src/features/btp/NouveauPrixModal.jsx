import { useState } from 'react'

/**
 * NouveauPrixModal — modal to add a new price entry to the article.
 */
export default function NouveauPrixModal({ onClose, onAdd, isSubmitting }) {
  const [form, setForm] = useState({
    pu: '',
    date: '',
    fourniture: '',
    accessoires: '',
    pose: '',
    cadence: '',
    coefficient: '',
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const isValid = form.pu && form.date

  const handleAdd = () => {
    if (!isValid) return
    onAdd({
      prixUnitaire: parseFloat(form.pu) || 0,
      dateDebut: form.date,
      fourniture: parseFloat(form.fourniture) || 0,
      accessoires: parseFloat(form.accessoires) || 0,
      pose: parseFloat(form.pose) || 0,
      cadence: parseInt(form.cadence) || 0,
      coefficientVente: parseFloat(form.coefficient) || 0,
    })
    onClose()
  }

  return (
    <div
      className="modal d-block"
      style={{ zIndex: 9100, backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 420 }}>
        <div className="modal-content border-0 shadow-lg rounded-4">

          {/* Header */}
          <div className="modal-header border-0 px-4 pt-4 pb-2 d-flex align-items-center gap-2">
            <div
              className="rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 28, height: 28, background: '#EFF6FF' }}
            >
              <i className="fi fi-rr-plus" style={{ color: '#0978E8', fontSize: 13 }} />
            </div>
            <h5 className="modal-title fw-bold text-dark mb-0" style={{ fontSize: 15 }}>
              Ajouter un prix
            </h5>
          </div>

          {/* Body */}
          <div className="modal-body px-4 py-3">

            {/* PU + Date */}
            <div className="row g-3 mb-3">
              <div className="col-6">
                <FieldLabel text="Prix unitaire" required />
                <input
                  type="number"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="40.50 €"
                  value={form.pu}
                  onChange={e => set('pu', e.target.value)}
                />
              </div>
              <div className="col-6">
                <FieldLabel text="Date" required />
                <input
                  type="date"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                />
              </div>
            </div>

            {/* Fourniture + Accessoires + Pose */}
            <div className="row g-3 mb-3">
              <div className="col-4">
                <FieldLabel text="Fourniture (€)" />
                <input
                  type="number"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="10.50 €"
                  value={form.fourniture}
                  onChange={e => set('fourniture', e.target.value)}
                />
              </div>
              <div className="col-4">
                <FieldLabel text="Accessoires (€)" />
                <input
                  type="number"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="10.50 €"
                  value={form.accessoires}
                  onChange={e => set('accessoires', e.target.value)}
                />
              </div>
              <div className="col-4">
                <FieldLabel text="Pose (€)" />
                <input
                  type="number"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="10.50 €"
                  value={form.pose}
                  onChange={e => set('pose', e.target.value)}
                />
              </div>
            </div>

            {/* Cadence + Coefficient */}
            <div className="row g-3">
              <div className="col-6">
                <FieldLabel text="Cadence en heure" />
                <input
                  type="number"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="2"
                  value={form.cadence}
                  onChange={e => set('cadence', e.target.value)}
                />
              </div>
              <div className="col-6">
                <FieldLabel text="Coefficient de vente" />
                <input
                  type="number"
                  step="0.1"
                  className="form-control form-control-sm bg-light border-0 rounded-3"
                  placeholder="3"
                  value={form.coefficient}
                  onChange={e => set('coefficient', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 px-4 pb-4 pt-2 d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              style={{ minWidth: 110, fontSize: 14 }}
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="btn rounded-pill px-4 fw-semibold"
              style={{
                minWidth: 110, fontSize: 14,
                background: isValid && !isSubmitting ? '#0978E8' : '#cbd5e1',
                color: '#fff', border: 'none',
              }}
              disabled={!isValid || isSubmitting}
              onClick={handleAdd}
            >
              {isSubmitting ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

function FieldLabel({ text, required }) {
  return (
    <label className="form-label mb-1 fw-semibold text-dark" style={{ fontSize: 13 }}>
      {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
  )
}
