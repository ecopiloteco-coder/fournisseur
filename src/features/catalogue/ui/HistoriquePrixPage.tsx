import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ARTICLES = [
  { id: 1, code: 'MAT-001', label: "Béton prêt à l'emploi C25/30", category: 'Gros Œuvre', unit: 'M3', history: [{ date: 'Oct', price: 82.50 }, { date: 'Nov', price: 84.00 }, { date: 'Déc', price: 83.50 }, { date: 'Jan', price: 85.00 }, { date: 'Fév', price: 87.50 }, { date: 'Mar', price: 88.00 }] },
  { id: 2, code: 'MAT-002', label: 'Acier HA12 (Barre 6m)', category: 'Gros Œuvre', unit: 'KG', history: [{ date: 'Oct', price: 11.20 }, { date: 'Nov', price: 11.50 }, { date: 'Déc', price: 11.80 }, { date: 'Jan', price: 12.10 }, { date: 'Fév', price: 12.30 }, { date: 'Mar', price: 12.50 }] },
  { id: 3, code: 'EL-105', label: 'Interrupteur Legrand Dooxie', category: 'Électricité', unit: 'U', history: [{ date: 'Oct', price: 4.05 }, { date: 'Nov', price: 4.10 }, { date: 'Déc', price: 4.10 }, { date: 'Jan', price: 4.15 }, { date: 'Fév', price: 4.20 }, { date: 'Mar', price: 4.50 }] },
  { id: 4, code: 'PL-302', label: 'Mitigeur Lavabo Grohe', category: 'Plomberie', unit: 'U', history: [{ date: 'Oct', price: 108.00 }, { date: 'Nov', price: 110.00 }, { date: 'Déc', price: 111.00 }, { date: 'Jan', price: 112.00 }, { date: 'Fév', price: 114.00 }, { date: 'Mar', price: 115.00 }] },
  { id: 5, code: 'PE-010', label: 'Peinture Blanche Satin 10L', category: 'Peinture', unit: 'ENS', history: [{ date: 'Oct', price: 42.00 }, { date: 'Nov', price: 42.50 }, { date: 'Déc', price: 43.50 }, { date: 'Jan', price: 44.00 }, { date: 'Fév', price: 44.20 }, { date: 'Mar', price: 45.00 }] },
];

export function HistoriquePrixPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const chartRef = useRef<HTMLDivElement>(null);

  const globalIndexData = useMemo(() => {
    const dates = ['Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar'];
    return dates.map((date, idx) => {
      const variations = ARTICLES.map(art => { const base = art.history[0].price; const cur = art.history[idx]?.price ?? base; return ((cur - base) / base) * 100; });
      return { date, value: parseFloat((variations.reduce((a, b) => a + b, 0) / variations.length).toFixed(2)) };
    });
  }, []);

  const topMovers = useMemo(() => {
    return ARTICLES.map(art => {
      const first = art.history[0].price; const last = art.history[art.history.length - 1].price;
      return { ...art, variation: ((last - first) / first) * 100 };
    }).sort((a, b) => Math.abs(b.variation) - Math.abs(a.variation)).slice(0, 4);
  }, []);

  useEffect(() => {
    if ((window as any).ApexCharts && chartRef.current) {
      const options = {
        series: [{ name: 'Variation Moyenne (%)', data: globalIndexData.map(d => d.value) }],
        chart: { type: 'area', height: 350, toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 4, colors: ['#4f46e5'] },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.5, opacityTo: 0.1, stops: [0, 90, 100], colorStops: [{ offset: 0, color: '#4f46e5', opacity: 0.5 }, { offset: 100, color: '#4f46e5', opacity: 0.1 }] } },
        xaxis: { categories: globalIndexData.map(d => d.date), axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#64748b', fontSize: '12px' } } },
        yaxis: { labels: { formatter: (v: number) => v + '%', style: { colors: '#64748b', fontSize: '12px' } } },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
        markers: { size: 6, colors: ['#4f46e5'], strokeColors: '#fff', strokeWidth: 3 },
        tooltip: { theme: 'light', y: { formatter: (v: number) => v + '%' } }
      };
      const chart = new (window as any).ApexCharts(chartRef.current, options);
      chart.render();
      return () => chart.destroy();
    }
  }, [globalIndexData]);

  const STATS = [
    { value: '+6.4%', label: 'Index Global (6m)', icon: 'fi-rr-chart-line-up', color: 'primary', extra: <><div className="progress mb-2" style={{ height: '6px' }}><div className="progress-bar bg-primary" style={{ width: '64%' }}></div></div><small className="text-muted">Tendance haussière modérée</small></> },
    { value: null, label: 'Forte Hausse', icon: 'fi-rr-arrow-trend-up', color: 'danger', extra: <><h5 className="fw-extrabold mb-0">Acier HA12</h5><span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 mt-2 d-inline-block">+11.6% en 6 mois</span></> },
    { value: null, label: 'Stabilité', icon: 'fi-rr-arrow-trend-down', color: 'success', extra: <><h5 className="fw-extrabold mb-0">Béton C25/30</h5><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 mt-2 d-inline-block">+2.1% en 3 mois</span></> },
    { value: null, label: "Dernière MaJ", icon: 'fi-rr-refresh', color: 'info', extra: <><h5 className="fw-extrabold mb-0">Aujourd'hui</h5><small className="text-muted d-block mt-2">Synchronisé avec le marché BTP</small></> },
  ];

  return (
    <div className="animate__animated animate__fadeIn">
      <div className="app-page-head d-flex justify-content-between align-items-center mb-4 text-start">
        <div>
          <h1 className="app-page-title">Analytique & Historique des Prix</h1>
          <p className="text-muted small mb-0">Vision globale de l'évolution de vos tarifs sur le marché.</p>
        </div>
        <div className="btn-group btn-group-sm bg-white p-1 rounded-pill shadow-sm border">
          {['3m', '6m', '1y'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)} className={`btn rounded-pill px-3 py-1 border-0 ${timeRange === r ? 'btn-primary shadow-sm' : 'btn-light'}`}>
              {r === '3m' ? '3 Mois' : r === '6m' ? '6 Mois' : '1 An'}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4 mb-4">
        {STATS.map((s, i) => (
          <div key={i} className="col-lg-3">
            <div className="card border-0 shadow-sm p-4 text-start rounded-4 h-100 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className={`avatar avatar-md bg-${s.color} bg-opacity-10 text-${s.color} rounded-3 d-flex align-items-center justify-content-center`}>
                  <i className={`fi ${s.icon} fs-4`}></i>
                </div>
                <div>
                  {s.value && <h4 className="fw-extrabold mb-0">{s.value}</h4>}
                  {s.label && !s.value && <h6 className={`fw-bold mb-1 text-${s.color}`}>{s.label}</h6>}
                  {s.value && <small className="text-muted">{s.label}</small>}
                </div>
              </div>
              {s.extra}
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8 text-start">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-extrabold text-dark mb-0"><i className="fi fi-rr-stats text-primary me-2"></i>Indice d'Évolution des Prix (BTP Index)</h5>
              <button className="btn btn-sm btn-light rounded-pill border px-3"><i className="fi fi-rr-download me-1"></i> PDF</button>
            </div>
            <div ref={chartRef} className="mt-2"></div>
            <div className="mt-4 p-3 bg-light rounded-3 d-flex align-items-center gap-3">
              <i className="fi fi-rr-info text-primary fs-5"></i>
              <p className="text-muted small mb-0">Cet index représente la variation moyenne pondérée de l'ensemble de vos articles. Une hausse de <strong>+6.4%</strong> est observée sur les 6 derniers mois.</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 text-start">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
            <h5 className="fw-extrabold text-dark mb-4">Articles les plus Volatils</h5>
            <div className="vstack gap-3">
              {topMovers.map(art => (
                <div key={art.id} className="p-3 border rounded-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div><div className="fw-bold text-dark">{art.label}</div><small className="text-muted">{art.category}</small></div>
                    <div className="text-end">
                      <div className={`fw-extrabold ${art.variation > 0 ? 'text-danger' : 'text-success'}`}>{art.variation > 0 ? '+' : ''}{art.variation.toFixed(1)}%</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>sur 6m</div>
                    </div>
                  </div>
                  <div className="progress mt-2" style={{ height: '4px' }}>
                    <div className={`progress-bar ${art.variation > 10 ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${Math.min(art.variation * 5, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/catalogue/articles" className="btn btn-light w-100 rounded-pill mt-4 fw-bold text-primary">
              Voir le catalogue complet <i className="fi fi-rr-angle-small-right"></i>
            </Link>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden text-start">
        <div className="card-header bg-white border-bottom p-4">
          <h5 className="fw-extrabold text-dark mb-0">Derniers Ajustements de Tarifs</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light bg-opacity-50">
              <tr className="small text-muted text-uppercase">
                <th className="px-4 py-3">Article</th>
                <th className="py-3">Ancien Prix</th>
                <th className="py-3">Nouveau Prix</th>
                <th className="py-3">Variation</th>
                <th className="py-3">Date</th>
                <th className="px-4 py-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {ARTICLES.map(art => {
                const last = art.history[art.history.length - 1];
                const prev = art.history[art.history.length - 2];
                const diff = ((last.price - prev.price) / prev.price) * 100;
                return (
                  <tr key={art.id}>
                    <td className="px-4"><div className="fw-bold text-dark">{art.label}</div><small className="text-muted">{art.code}</small></td>
                    <td className="text-muted">{prev.price.toFixed(2)} €</td>
                    <td className="fw-extrabold text-dark">{last.price.toFixed(2)} €</td>
                    <td><span className={`badge rounded-pill ${diff > 0 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>{diff > 0 ? '+' : ''}{diff.toFixed(1)}%</span></td>
                    <td><span className="text-muted">12 Mar 2026</span></td>
                    <td className="px-4 text-end">
                      <button className="btn btn-sm btn-light rounded-circle" style={{ width: 32, height: 32, padding: 0 }}><i className="fi fi-rr-eye"></i></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`.fw-extrabold { font-weight: 800; }`}</style>
    </div>
  );
}
