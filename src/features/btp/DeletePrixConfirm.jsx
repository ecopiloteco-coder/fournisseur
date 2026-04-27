/**
 * DeletePrixConfirm — small confirmation popup before deleting a price row.
 */
export default function DeletePrixConfirm({ onClose, onConfirm }) {
  return (
    <div
      className="modal d-block"
      style={{ zIndex: 9001, backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 300 }}>
        <div className="modal-content border-0 shadow-lg rounded-4 text-center px-4 py-4">

          {/* Icon */}
          <div
            className="rounded-3 d-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 52, height: 52, background: '#FEF2F2' }}
          >
            <i className="fi fi-rr-trash" style={{ color: '#ef4444', fontSize: 22 }} />
          </div>

          {/* Title */}
          <h5 className="fw-bold text-dark mb-1" style={{ fontSize: 16 }}>
            Supprimez le prix
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: 13 }}>
            Souhaitez-vous vraiment supprimer ce prix ?
          </p>

          {/* Actions */}
          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              style={{ fontSize: 14, minWidth: 100 }}
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              className="btn rounded-pill px-4 fw-semibold"
              style={{
                fontSize: 14, minWidth: 100,
                background: '#0978E8', color: '#fff', border: 'none',
              }}
              onClick={onConfirm}
            >
              Confirmer
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
