import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';

export function FournisseurDashboard() {
  const { user } = useAuth();
  const chartQuotesRef = useRef<HTMLDivElement>(null);
  const chartStatusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!(window as any).ApexCharts) return;

    // Évolution mensuel des articles chiffrés (Stacked Bar)
    const chartQuotes = new (window as any).ApexCharts(chartQuotesRef.current, {
      series: [
        { name: 'Refusé', data: [20, 30, 10, 20, 25, 45, 20, 60, 40, 65, 30, 20] },
        { name: 'Accepté', data: [30, 10, 30, 15, 20, 10, 15, 20, 35, 25, 25, 30] }
      ],
      chart: { type: 'bar', height: 280, stacked: true, toolbar: { show: false } },
      colors: ['#EF4444', '#10B981'], // Red, Green
      plotOptions: { 
        bar: { 
          horizontal: false, 
          borderRadius: 8, 
          columnWidth: '25%',
          borderRadiusApplication: 'around',
          borderRadiusWhenStacked: 'all'
        } 
      },
      dataLabels: { enabled: false },
      xaxis: { 
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#A0AEC0', fontSize: '11px' } }
      },
      yaxis: { 
        labels: { style: { colors: '#A0AEC0', fontSize: '11px' }, formatter: (value: number) => value + '%' } 
      },
      grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
      legend: { position: 'bottom', markers: { radius: 12 } },
      fill: { opacity: 1 }
    });
    chartQuotes.render();

    // État des projets reçus (Donut)
    const chartStatus = new (window as any).ApexCharts(chartStatusRef.current, {
      series: [400, 300, 358, 200],
      labels: ['Nouveau', 'En cours', 'Envoyé', 'Terminé'],
      chart: { type: 'donut', height: 280 },
      colors: ['#3B82F6', '#FBBF24', '#60A5FA', '#34D399'], // Blue, Yellow, Light Blue, Green
      legend: { position: 'right', fontSize: '13px', markers: { radius: 12 }, itemMargin: { vertical: 8 } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 4, colors: ['#fff'] },
      plotOptions: { 
        pie: { 
          donut: { 
            size: '75%', 
            labels: { 
              show: true, 
              name: { show: true, fontSize: '12px', color: '#A0AEC0', offsetY: 20 }, 
              value: { show: true, fontSize: '24px', fontWeight: 'bold', color: '#1B2A4E', offsetY: -10 }, 
              total: { show: true, showAlways: true, label: 'Projets', color: '#A0AEC0', formatter: function () { return '1258' } } 
            } 
          } 
        } 
      }
    });
    chartStatus.render();

    return () => { chartQuotes.destroy(); chartStatus.destroy(); };
  }, []);

  const stats = [
    { label: 'Projets réalisés', value: '12', icon: 'fi-rr-folder', iconColor: '#6Cb2FF', bgColor: '#F0F7FF' },
    { label: 'Articles acceptés', value: '142', icon: 'fi-rr-box-alt', iconColor: '#68D391', bgColor: '#F0FDF4' },
    { label: 'Taux de réussite', value: '56 %', icon: 'fi-rr-chart-line-up', iconColor: '#6Cb2FF', bgColor: '#F0F7FF' },
    { label: 'Clients actifs', value: '26', icon: 'fi-rr-users', iconColor: '#FC8181', bgColor: '#FFF5F5' },
  ];

  return (
    <div className="container-fluid pb-5">
      {/* Banner */}
      <div className="rounded-4 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #8FCBFF 0%, #6Cb2FF 100%)', minHeight: '140px', boxShadow: '0 4px 15px rgba(108, 178, 255, 0.2)' }}>
        <div className="p-4 d-flex flex-column justify-content-center h-100 position-relative z-1 text-start ms-2">
          <h2 className="text-white fw-bold mb-2">Bonjour , {user?.nomContact || 'Julien'}</h2>
          <p className="text-white mb-0 fs-6">Bienvenue sur votre espace de fournisseur ECPTARIF !</p>
        </div>
      </div>

      <div className="text-start mb-3">
         <h4 className="fw-black text-dark" style={{ color: '#1B2A4E' }}>Tableau de bord</h4>
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-4 text-start">
        {stats.map((s, i) => (
          <div key={i} className="col-xl-3 col-sm-6">
            <div className="card border-0 shadow-sm rounded-3 h-100 p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: s.bgColor, color: s.iconColor }}>
                  <i className={`fi ${s.icon} fs-5`}></i>
                </div>
                <div>
                  <h4 className="fw-black mb-0 text-dark">{s.value}</h4>
                  <p className="text-muted small mb-0 fw-semibold">{s.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4 text-start">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold mb-0 text-dark">Evolution mensuel des articles chiffrés</h6>
            </div>
            <div className="card-body px-2">
              <div ref={chartQuotesRef}></div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4">
              <h6 className="fw-bold mb-0 text-dark">État des projets reçus</h6>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div ref={chartStatusRef} className="w-100"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-3 text-start">
        <div className="card-header bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold mb-0 text-dark">Projets récents</h6>
          <Link to="/chiffrage/demandes" className="text-decoration-none small fw-bold" style={{ color: '#6Cb2FF' }}>Voir Plus</Link>
        </div>
        <div className="card-body p-4 pt-0">
          <div className="table-responsive">
            <table className="table table-borderless align-middle w-100 mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
              <thead style={{ backgroundColor: '#6Cb2FF' }}>
                <tr className="small text-white">
                  <th className="py-3 px-4 fw-medium text-center bg-transparent border-0" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}>REF</th>
                  <th className="py-3 px-3 fw-medium text-start bg-transparent border-0">Projet</th>
                  <th className="py-3 px-3 fw-medium text-start bg-transparent border-0">Client</th>
                  <th className="py-3 px-3 fw-medium text-center bg-transparent border-0">Articles</th>
                  <th className="py-3 px-3 fw-medium text-center bg-transparent border-0">Date d'écheance</th>
                  <th className="py-3 px-3 fw-medium text-center bg-transparent border-0">Statut</th>
                  <th className="py-3 px-4 fw-medium text-center bg-transparent border-0" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 */}
                <tr className="bg-white shadow-sm" style={{ borderRadius: '6px' }}>
                  <td className="py-3 px-4 text-center fw-bold text-dark" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', fontSize: '12px' }}>1</td>
                  <td className="py-3 px-3 fw-bold text-dark" style={{ fontSize: '12px' }}>Demande de chiffrage -<br/>Projet 2</td>
                  <td className="py-3 px-3 fw-semibold text-dark" style={{ fontSize: '12px' }}>Noah Yannick</td>
                  <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>12</td>
                  <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>15 / 04 / 2026</td>
                  <td className="py-3 px-3 text-center">
                    <span className="small fw-bold" style={{ color: '#3B82F6' }}>Nouveau</span>
                  </td>
                  <td className="py-3 px-4 text-center" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                    <button className="btn btn-sm btn-link text-danger p-0 me-2"><i className="fi fi-rr-cross-circle"></i></button>
                    <button className="btn btn-sm btn-link text-success p-0"><i className="fi fi-rr-check-circle"></i></button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="bg-white shadow-sm" style={{ borderRadius: '6px' }}>
                  <td className="py-3 px-4 text-center fw-bold text-dark" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', fontSize: '12px' }}>2</td>
                  <td className="py-3 px-3 fw-bold text-dark" style={{ fontSize: '12px' }}>Demande de chiffrage -<br/>Projet 2</td>
                  <td className="py-3 px-3 fw-semibold text-dark" style={{ fontSize: '12px' }}>Noah Yannick</td>
                  <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>12</td>
                  <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>15 / 04 / 2026</td>
                  <td className="py-3 px-3 text-center">
                    <span className="small fw-bold" style={{ color: '#60A5FA' }}>Envoyé</span>
                  </td>
                  <td className="py-3 px-4 text-center" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                    <button className="btn btn-sm btn-link p-0 me-2" style={{ color: '#6Cb2FF' }}><i className="fi fi-rr-edit"></i></button>
                    <button className="btn btn-sm btn-link text-primary p-0"><i className="fi fi-rr-link-alt"></i></button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="bg-white shadow-sm" style={{ borderRadius: '6px' }}>
                  <td className="py-3 px-4 text-center fw-bold text-dark" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', fontSize: '12px' }}>3</td>
                  <td className="py-3 px-3 fw-bold text-dark" style={{ fontSize: '12px' }}>Demande de chiffrage -<br/>Projet 2</td>
                  <td className="py-3 px-3 fw-semibold text-dark" style={{ fontSize: '12px' }}>Noah Yannick</td>
                  <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>12</td>
                  <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>15 / 04 / 2026</td>
                  <td className="py-3 px-3 text-center">
                    <span className="small fw-bold text-warning">En cours</span>
                  </td>
                  <td className="py-3 px-4 text-center" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                    <button className="btn btn-sm btn-link p-0 me-2" style={{ color: '#6Cb2FF' }}><i className="fi fi-rr-edit"></i></button>
                    <button className="btn btn-sm btn-link text-primary p-0"><i className="fi fi-rr-link-alt"></i></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
