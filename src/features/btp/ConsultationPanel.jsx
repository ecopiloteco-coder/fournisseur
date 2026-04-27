import { useEffect, useRef } from 'react'
import { YEARS_LABELS } from './catalogueData'

/**
 * ConsultationPanel — slide-in panel showing article details, annual PU chart, and price history.
 */
export default function ConsultationPanel({ article, onClose }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!article || !window.ApexCharts || !chartRef.current) return

    const chart = new window.ApexCharts(chartRef.current, {
      series: [
        { name: 'PU', data: article.annualPU },
        { name: 'Année', data: article.annualYear },
      ],
      chart: {
        type: 'line',
        height: 200,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 600 },
      },
      stroke: { curve: 'smooth', width: 2 },
      colors: ['#F59E0B', '#FB923C'],
      xaxis: {
        categories: YEARS_LABELS,
        labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 50,
        tickAmount: 5,
        labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        markers: { radius: 50 },
        fontSize: '11px',
      },
      grid: { borderColor: '#f1f5f9', strokeDashArray: 3 },
      markers: { size: 3 },
      tooltip: { theme: 'light' },
    })

    chart.render()
    return () => chart.destroy()
  }, [article])

  if (!article) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="offcanvas-backdrop fade show"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="offcanvas offcanvas-end show border-0 shadow-lg"
        style={{ visibility: 'visible', width: 380, zIndex: 9999, background: '#fff' }}
      >
        {/* Header */}
        <div className="offcanvas-header px-4 py-3 border-bottom d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, background: '#FEF3C7' }}
            >
              <i className="fi fi-rr-settings" style={{ color: '#F59E0B', fontSize: 16 }} />
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: 14 }}>
                Consultation de l'article
              </div>
              <div className="text-muted" style={{ fontSize: 11 }}>
                Ajouté par : {article.addedBy}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="border-0 bg-transparent d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 28, height: 28, color: '#ef4444', cursor: 'pointer' }}
          >
            <i className="fi fi-rr-cross-small" style={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className="offcanvas-body px-4 py-3" style={{ overflowY: 'auto' }}>
          {/* Article title */}
          <div className="mb-3">
            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: 16 }}>
              {article.nom}
            </h6>
            <div className="d-flex align-items-center gap-3 mt-1">
              <span className="text-muted fw-semibold" style={{ fontSize: 12 }}>
                {article.ref}
              </span>
              <span className="text-muted" style={{ fontSize: 12 }}>
                {article.lastUpdate.replace(/ \/ /g, '/')}
              </span>
            </div>
          </div>

          {/* Metrics grid */}
          <div
            className="rounded-3 overflow-hidden border mb-3"
            style={{ borderColor: '#e2e8f0' }}
          >
            {/* Row 1 */}
            <div className="d-flex" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <MetricCell label="Prix unitaire" value={`${article.pu.toFixed(0)} €`} border />
              <MetricCell label="Unité" value={article.unite} />
            </div>
            {/* Row 2 */}
            <div className="d-flex" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <MetricCell label="Fourniture (€)" value={`${article.fourniture.toFixed(2)} €`} border />
              <MetricCell label="Accessoires (€)" value={`${article.accessoires.toFixed(2)} €`} border />
              <MetricCell label="Pose (€)" value={`${article.pose.toFixed(2)} €`} />
            </div>
            {/* Row 3 */}
            <div className="d-flex">
              <MetricCell label="Cadence en heure" value={article.cadence} border />
              <MetricCell label="Coefficient de vente" value={article.coefficient} />
            </div>
          </div>

          {/* Chart */}
          <div className="mb-3">
            <div className="fw-bold text-dark mb-2" style={{ fontSize: 13 }}>
              Evolution annuelle du prix unitaire de l'article
            </div>
            <div ref={chartRef} />
          </div>

          {/* History table */}
          <div className="fw-bold text-dark mb-2" style={{ fontSize: 13 }}>
            Prix de l'article
          </div>
          <div className="rounded-3 overflow-hidden">
            <table className="table table-borderless mb-0" style={{ fontSize: 12 }}>
              <thead style={{ backgroundColor: '#0978E8' }}>
                <tr>
                  <th className="text-white py-2 px-3" style={{ fontWeight: 600 }}>PU</th>
                  <th className="text-white py-2 px-3" style={{ fontWeight: 600 }}>Date</th>
                  <th className="text-white py-2 px-3" style={{ fontWeight: 600 }}>Ajouté par</th>
                </tr>
              </thead>
              <tbody>
                {article.priceHistory.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td className="py-2 px-3 text-dark fw-semibold">{row.pu.toFixed(2)}€</td>
                    <td className="py-2 px-3 text-muted">{row.date}</td>
                    <td className="py-2 px-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 28, height: 28,
                          background: 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                          fontSize: 10, color: '#fff', fontWeight: 700,
                        }}
                      >
                        {article.addedBy.split(' ').map(w => w[0]).join('')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Tiny helper ──────────────────────────────────────────────────────────────
function MetricCell({ label, value, border }) {
  return (
    <div
      className="flex-1 px-3 py-2 text-center"
      style={{ borderRight: border ? '1px solid #e2e8f0' : 'none' }}
    >
      <div className="text-muted" style={{ fontSize: 10 }}>{label}</div>
      <div className="fw-bold text-dark" style={{ fontSize: 13 }}>{value}</div>
    </div>
  )
}
