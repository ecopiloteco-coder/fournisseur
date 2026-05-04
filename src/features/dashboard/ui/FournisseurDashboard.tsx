import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/providers/AuthContext';
import { fetchDashboardAnalytics } from '../dashboardService';

interface DashboardData {
  overview: {
    totalProjects: number;
    acceptedArticles: number;
    successRate: number;
    activeClients: number;
  };
  monthlyEvolution: {
    months: string[];
    refusedData: number[];
    acceptedData: number[];
  };
  projectStatus: {
    series: number[];
    labels: string[];
    total: number;
  };
  recentProjects: Array<{
    projetId: number;
    reference: string;
    projetName: string;
    clientName: string;
    articleCount: number;
    deadlineDate: string;
    status: string;
  }>;
}

export function FournisseurDashboard() {
  const { user } = useAuth();
  const chartQuotesRef = useRef<HTMLDivElement>(null);
  const chartStatusRef = useRef<HTMLDivElement>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard analytics
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        // userEntreprise filters use entreprisePublicId in projet-fournisseur service
        const userIdentifier = user?.entreprisePublicId || user?.keycloakId;
        if (!userIdentifier) {
          setError('User identifier not found');
          return;
        }
        const data = await fetchDashboardAnalytics(String(userIdentifier));
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.entreprisePublicId, user?.keycloakId]);

  // Initialize charts after data is loaded
  useEffect(() => {
    if (!dashboardData || !(window as any).ApexCharts) return;

    // Évolution mensuel des articles chiffrés (Stacked Bar)
    const chartQuotes = new (window as any).ApexCharts(chartQuotesRef.current, {
      series: [
        { name: 'Refusé', data: dashboardData.monthlyEvolution.refusedData },
        { name: 'Accepté', data: dashboardData.monthlyEvolution.acceptedData }
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
        categories: dashboardData.monthlyEvolution.months,
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
      series: dashboardData.projectStatus.series,
      labels: dashboardData.projectStatus.labels,
      chart: { type: 'donut', height: 280 },
      colors: ['#3B82F6', '#FBBF24', '#34D399', '#EF4444'], // Blue, Yellow, Green, Red
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
              total: { show: true, showAlways: true, label: 'Projets', color: '#A0AEC0', formatter: function () { return dashboardData.projectStatus.total.toString() } }
            }
          }
        }
      }
    });
    chartStatus.render();

    return () => { chartQuotes.destroy(); chartStatus.destroy(); };
  }, [dashboardData]);

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nouveau':
        return '#3B82F6';
      case 'en_cours':
        return '#FBBF24';
      case 'termine':
        return '#34D399';
      case 'refuse':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'nouveau':
        return 'Nouveau';
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      case 'refuse':
        return 'Refusé';
      default:
        return status || 'Inconnu';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR').replace(/\//g, ' / ');
  };

  if (error && !dashboardData) {
    return (
      <div className="container-fluid pb-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (loading || !dashboardData) {
    return (
      <div className="container-fluid pb-5">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Projets réalisés', value: dashboardData.overview.totalProjects.toString(), icon: 'fi-rr-folder', iconColor: '#6Cb2FF', bgColor: '#F0F7FF' },
    { label: 'Articles acceptés', value: dashboardData.overview.acceptedArticles.toString(), icon: 'fi-rr-box-alt', iconColor: '#68D391', bgColor: '#F0FDF4' },
    { label: 'Taux de réussite', value: dashboardData.overview.successRate.toFixed(0) + ' %', icon: 'fi-rr-chart-line-up', iconColor: '#6Cb2FF', bgColor: '#F0F7FF' },
    { label: 'Clients actifs', value: dashboardData.overview.activeClients.toString(), icon: 'fi-rr-users', iconColor: '#FC8181', bgColor: '#FFF5F5' },
  ];

  return (
    <div className="container-fluid pb-5">
      {/* Banner */}
      <div className="rounded-4 mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #8FCBFF 0%, #6Cb2FF 100%)', minHeight: '140px', boxShadow: '0 4px 15px rgba(108, 178, 255, 0.2)' }}>
        <div className="p-4 d-flex flex-column justify-content-center h-100 position-relative z-1 text-start ms-2">
          <h2 className="text-white fw-bold mb-2">Bonjour , {user?.nomContact || 'Utilisateur'}</h2>
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
                {dashboardData.recentProjects.map((project, idx) => (
                  <tr key={idx} className="bg-white shadow-sm" style={{ borderRadius: '6px' }}>
                    <td className="py-3 px-4 text-center fw-bold text-dark" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', fontSize: '12px' }}>{idx + 1}</td>
                    <td className="py-3 px-3 fw-bold text-dark" style={{ fontSize: '12px' }}>{project.projetName}</td>
                    <td className="py-3 px-3 fw-semibold text-dark" style={{ fontSize: '12px' }}>{project.clientName}</td>
                    <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>{project.articleCount}</td>
                    <td className="py-3 px-3 text-center fw-bold text-dark" style={{ fontSize: '12px' }}>{formatDate(project.deadlineDate)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="small fw-bold" style={{ color: getStatusBadgeColor(project.status) }}>{getStatusLabel(project.status)}</span>
                    </td>
                    <td className="py-3 px-4 text-center" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>
                      <button className="btn btn-sm btn-link text-danger p-0 me-2"><i className="fi fi-rr-cross-circle"></i></button>
                      <button className="btn btn-sm btn-link text-success p-0"><i className="fi fi-rr-check-circle"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
