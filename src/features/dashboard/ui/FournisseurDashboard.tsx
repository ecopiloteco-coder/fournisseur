import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';

export function FournisseurDashboard() {
  const { user } = useAuth();
  const chartQuotesRef = useRef<HTMLDivElement>(null);
  const chartStatusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window as any).ApexCharts) return;

    const chartQuotes = new (window as any).ApexCharts(chartQuotesRef.current, {
      series: [{ name: 'Montant Devis (€)', data: [45000, 52000, 38000, 65000, 48000, 72000] }],
      chart: { height: 320, type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
      colors: ['var(--bs-primary)'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'], labels: { style: { colors: 'var(--bs-body-color)' } } },
      yaxis: { labels: { style: { colors: 'var(--bs-body-color)' } } },
      grid: { borderColor: 'var(--bs-border-color)', strokeDashArray: 4 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] } }
    });
    chartQuotes.render();

    const chartStatus = new (window as any).ApexCharts(chartStatusRef.current, {
      series: [45, 25, 30],
      labels: ['Acceptés', 'Refusés', 'En cours'],
      chart: { type: 'donut', height: 320 },
      colors: ['var(--bs-success)', 'var(--bs-danger)', 'var(--bs-warning)'],
      legend: { position: 'bottom', labels: { colors: 'var(--bs-body-color)' } },
      dataLabels: { enabled: false },
      plotOptions: { pie: { donut: { size: '75%', labels: { show: true, total: { show: true, label: 'Affaires' } } } } }
    });
    chartStatus.render();

    return () => { chartQuotes.destroy(); chartStatus.destroy(); };
  }, []);

  const stats = [
    { label: 'Demandes en attente', value: '12', icon: 'fi-rr-envelope-open-dollar', color: 'primary' },
    { label: 'Devis envoyés', value: '45', icon: 'fi-rr-document-signed', color: 'success' },
    { label: 'Conversion', value: '68%', icon: 'fi-rr-stats', color: 'info' },
    { label: 'Gain total', value: '124k €', icon: 'fi-rr-coins', color: 'warning' },
  ];

  return (
    <>
      <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div className="clearfix text-start">
          <h1 className="app-page-title">Dashboard Fournisseur</h1>
          <p className="text-muted small mb-0">
            Bonjour <strong>{user?.nomContact}</strong>, bienvenue sur votre espace de chiffrage EcoPilot.
          </p>
        </div>
      </div>

      <div className="row g-4 mb-4 text-start">
        {stats.map((s, i) => (
          <div key={i} className="col-xl-3 col-sm-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center gap-3">
                  <div className={`avatar avatar-lg bg-${s.color} bg-opacity-10 text-${s.color} rounded-circle d-flex align-items-center justify-content-center`}>
                    <i className={`fi ${s.icon} fs-4`}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{s.value}</h3>
                    <p className="text-muted small mb-0">{s.label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom p-4">
              <h5 className="fw-bold mb-0">Évolution du Chiffrage Mensuel</h5>
            </div>
            <div className="card-body">
              <div ref={chartQuotesRef}></div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom p-4">
              <h5 className="fw-bold mb-0">Statut des Devis</h5>
            </div>
            <div className="card-body">
              <div ref={chartStatusRef}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-bottom p-4 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">Demandes de Chiffrage Prioritaires</h5>
              <Link to="/chiffrage/demandes" className="btn btn-sm btn-link text-primary fw-bold text-decoration-none small">Voir tout</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light bg-opacity-50">
                    <tr className="small text-muted text-uppercase">
                      <th className="px-4 py-3">Projet / Référence</th>
                      <th className="py-3">Échéance</th>
                      <th className="py-3">Montant Estimé HT</th>
                      <th className="py-3 text-center">Statut</th>
                      <th className="px-4 py-3 text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-start">
                    {[1, 2, 3].map(item => (
                      <tr key={item}>
                        <td className="px-4">
                          <div className="fw-bold text-dark">Rénovation Hôtel de Ville - Lot 0{item + 2}</div>
                          <small className="text-muted">ID: PRJ-2024-00{item}</small>
                        </td>
                        <td><span className="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill">Dans {item * 2} jours</span></td>
                        <td className="fw-bold text-dark">12,450.00 €</td>
                        <td className="text-center">
                          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1">Nouveau</span>
                        </td>
                        <td className="px-4 text-end">
                          <Link to="/chiffrage/demandes" className="btn btn-sm btn-primary rounded-pill px-3 fw-bold shadow-sm">Répondre</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
