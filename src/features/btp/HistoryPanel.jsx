import { useRef, useEffect } from 'react'

/**
 * HistoryPanel — original "Intelligence Prix" slide-in panel.
 */
export default function HistoryPanel({ article, onClose }) {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!article || !window.ApexCharts || !chartRef.current) return

    const history = article.priceHistory || []
    const chart = new window.ApexCharts(chartRef.current, {
      series: [{ name: 'Prix Unitaire (€)', data: history.map(h => h.pu) }],
      chart: { type: 'area', height: 220, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: {
        categories: history.map(h => h.date),
        labels: { style: { colors: '#a1a1aa', fontSize: '11px' } },
      },
      yaxis: {
        labels: {
          formatter: val => val.toFixed(2) + ' €',
          style: { colors: '#a1a1aa', fontSize: '11px' },
        },
      },
      colors: ['var(--bs-primary, #0978E8)'],
      fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 },
      },
      grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
      markers: { size: 5, strokeColors: '#fff', strokeWidth: 2 },
      tooltip: { y: { formatter: val => val.toFixed(2) + ' €' } },
    })
    chart.render()
    return () => chart.destroy()
  }, [article])

  if (!article) return null

  const prices = article.priceHistory.map(h => h.pu)
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length
  const variation = prices.length > 1
    ? ((prices[0] - prices[prices.length - 1]) / prices[prices.length - 1]) * 100
    : 0

  return (
    <>
      <div
        className="offcanvas-backdrop fade show"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />
      <div
        className="offcanvas offcanvas-end show border-0 shadow-lg"
        style={{ visibility: 'visible', width: 420, zIndex: 9999, background: '#fdfdfd' }}
      >
        <div className="offcanvas-header border-bottom p-4 bg-white">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, background: '#EFF6FF' }}
            >
              <i className="fi fi-rr-stats" style={{ color: '#0978E8', fontSize: 18 }} />
            </div>
            <div>
              <h5 className="offcanvas-title fw-bold text-dark mb-0">Intelligence Prix</h5>
              <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                Analyse détaillée de l'article
              </p>
            </div>
          </div>
          <button type="button" className="btn-close shadow-none" onClick={onClose} />
        </div>

        <div className="offcanvas-body p-4" style={{ overflowY: 'auto' }}>
          {/* Article info */}
          <div className="mb-4">
            <h5 className="fw-bold text-primary mb-1">{article.nom}</h5>
            <div className="d-flex gap-2">
              <span className="badge bg-light text-muted border">{article.ref}</span>
              <span className="badge bg-light text-muted border">{article.lot}</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="row g-3 mb-4">
            <div className="col-6">
              <div className="card border-0 bg-white shadow-sm p-3 rounded-4 text-center">
                <small className="text-muted d-block mb-1" style={{ fontSize: 10 }}>
                  PRIX MOYEN
                </small>
                <h4 className="fw-bold mb-0 text-dark">{avg.toFixed(2)} €</h4>
              </div>
            </div>
            <div className="col-6">
              <div className="card border-0 bg-white shadow-sm p-3 rounded-4 text-center">
                <small className="text-muted d-block mb-1" style={{ fontSize: 10 }}>
                  VARIATION
                </small>
                <h4
                  className="fw-bold mb-0"
                  style={{ color: variation > 0 ? '#22c55e' : '#ef4444' }}
                >
                  {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                </h4>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="card border-0 bg-white shadow-sm p-3 mb-4 rounded-4">
            <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
              <i className="fi fi-rr-chart-histogram text-primary" /> Évolution Temporelle
            </h6>
            <div ref={chartRef} />
          </div>

          {/* History list */}
          <h6 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
            <i className="fi fi-rr-list-check text-primary" /> Historique des Prix
          </h6>
          <div className="card border-0 bg-white shadow-sm overflow-hidden rounded-4">
            <ul className="list-group list-group-flush">
              {article.priceHistory.map((op, i) => (
                <li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center px-3 py-3"
                  style={{ borderBottom: '1px dashed #e5e7eb' }}
                >
                  <span className="text-muted" style={{ fontSize: 12 }}>{op.date}</span>
                  <span className="fw-bold text-primary">{op.pu.toFixed(2)} €</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
