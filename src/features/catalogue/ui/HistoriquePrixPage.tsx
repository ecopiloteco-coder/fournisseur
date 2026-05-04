import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchHistoriquePrixAnalytics } from '../../btp/articleFournisseurService';

type HistoriqueAnalytics = {
  years?: number[];
  top3AnnualEvolution?: Array<{ articleName?: string; values?: number[] }>;
  top5AnnualUsage?: Array<{ articleName?: string; lot?: string; usagePercent?: number }>;
  latestTariffAdjustments?: Array<{
    articleName?: string;
    refArticle?: string;
    oldPrice?: number;
    newPrice?: number;
    variationPercent?: number;
    adjustmentDate?: string;
  }>;
};

function isAnalyticsEmpty(data: HistoriqueAnalytics | null | undefined) {
  if (!data) return true;
  const top3 = Array.isArray(data.top3AnnualEvolution) ? data.top3AnnualEvolution.length : 0;
  const top5 = Array.isArray(data.top5AnnualUsage) ? data.top5AnnualUsage.length : 0;
  const latest = Array.isArray(data.latestTariffAdjustments) ? data.latestTariffAdjustments.length : 0;
  return top3 === 0 && top5 === 0 && latest === 0;
}

function getKeycloakIdFromToken(token: string | null): string {
  if (!token) return '';
  try {
    const parts = token.split('.');
    if (parts.length < 2) return '';
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(base64));
    return typeof json?.sub === 'string' ? json.sub : '';
  } catch {
    return '';
  }
}

const euro = (value: number | string | null | undefined) => {
  const num = Number(value ?? 0);
  return `${num.toFixed(2)} €`;
};

const percent = (value: number | null | undefined) => {
  const num = Number(value ?? 0);
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)} %`;
};

const asDate = (isoDate?: string) => {
  if (!isoDate) return '—';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR').replace(/\//g, ' / ');
};

export function HistoriquePrixPage() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [analytics, setAnalytics] = useState<HistoriqueAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const user = JSON.parse(sessionStorage.getItem('fournisseur_user') || '{}');
        const token = sessionStorage.getItem('fournisseur_token');
        const entreprisePublicId = user?.entreprisePublicId || '';
        const keycloakId = user?.keycloakId || getKeycloakIdFromToken(token);

        const primaryScope = entreprisePublicId || keycloakId || (user?.entrepriseId ? String(user.entrepriseId) : '');
        let data = await fetchHistoriquePrixAnalytics(primaryScope);

        // Compatibility fallback: older backend scopes analytics by ajoutePar (keycloak user id).
        if (isAnalyticsEmpty(data) && keycloakId && keycloakId !== primaryScope) {
          data = await fetchHistoriquePrixAnalytics(keycloakId);
        }

        setAnalytics(data || null);
      } catch {
        setAnalytics(null);
        setLoadError('Impossible de charger les statistiques depuis la base de données.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const years = useMemo(() => {
    const values = analytics?.years;
    return Array.isArray(values) && values.length > 0
      ? values.map((y) => String(y))
      : [];
  }, [analytics]);

  const chartSeries = useMemo(() => {
    const values = analytics?.top3AnnualEvolution;
    if (!Array.isArray(values) || values.length === 0) {
      return [];
    }
    return values.slice(0, 3).map((s, idx) => ({
      name: s.articleName || `Article ${idx + 1}`,
      data: Array.isArray(s.values) && s.values.length > 0 ? s.values : new Array(years.length).fill(0),
    }));
  }, [analytics, years.length]);

  const topArticles = useMemo(() => {
    const values = analytics?.top5AnnualUsage;
    if (!Array.isArray(values) || values.length === 0) {
      return [];
    }
    return values.slice(0, 5).map((item) => ({
      name: item.articleName || 'Article',
      cat: item.lot || 'Non classé',
      pct: `${Math.round(Number(item.usagePercent ?? 0))}%`,
    }));
  }, [analytics]);

  const recentAdjustments = useMemo(() => {
    const values = analytics?.latestTariffAdjustments;
    if (!Array.isArray(values) || values.length === 0) {
      return [];
    }
    return values.slice(0, 8).map((adj) => ({
      article: adj.articleName || 'Article',
      ref: adj.refArticle || '—',
      old: euro(adj.oldPrice),
      new: euro(adj.newPrice),
      var: percent(adj.variationPercent),
      date: asDate(adj.adjustmentDate),
    }));
  }, [analytics]);

  useEffect(() => {
    if (chartSeries.length === 0 || years.length === 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    if ((window as any).ApexCharts && chartRef.current) {
      const options = {
        series: chartSeries,
        chart: { type: 'bar', height: 320, toolbar: { show: false }, parentHeightOffset: 0 },
        plotOptions: { bar: { columnWidth: '35%', borderRadius: 2 } },
        colors: ['#0084FF', '#22C55E', '#38BDF8'],
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
          categories: years,
          axisBorder: { show: false }, axisTicks: { show: false },
          labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } }
        },
        yaxis: { labels: { formatter: (v: number) => v === 300 ? '+300 €' : v + ' €', style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } } },
        legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '11px', fontWeight: 600, markers: { radius: 12 } },
        grid: { strokeDashArray: 4, borderColor: '#e2e8f0' }
      };

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const chart = new (window as any).ApexCharts(chartRef.current, options);
      chart.render();
      chartInstanceRef.current = chart;
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
          chartInstanceRef.current = null;
        }
      };
    }
  }, [chartSeries, years]);

  return (
    <div className="animate__animated animate__fadeIn pb-5" style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <div className="mb-4 text-start">
        <h3 className="fw-black" style={{ color: '#1E3A8A', fontSize: '22px' }}>Historique de prix</h3>
        <p className="text-muted fw-medium" style={{ fontSize: '13px' }}>Visualisez les variations de prix et accédez aux données clés des articles.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7 col-xl-8">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100 text-start">
            <h5 className="fw-black text-dark mb-4" style={{ fontSize: '14px' }}>Évolution annuelle des 3 articles les plus utilisés</h5>
            {isLoading ? (
              <div className="text-muted small">Chargement des données...</div>
            ) : loadError ? (
              <div className="text-danger small">{loadError}</div>
            ) : chartSeries.length === 0 ? (
              <div className="text-muted small">Aucune donnée d'évolution disponible en base.</div>
            ) : (
              <div ref={chartRef}></div>
            )}
          </div>
        </div>
        <div className="col-lg-5 col-xl-4">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100 text-start">
            <h5 className="fw-black text-dark mb-4" style={{ fontSize: '14px' }}>Évolution annuelle des 5 articles les plus utilisés</h5>
            <div className="d-flex flex-column gap-3">
              {isLoading ? (
                <div className="text-muted small">Chargement des données...</div>
              ) : topArticles.length === 0 ? (
                <div className="text-muted small">Aucune statistique d'usage disponible en base.</div>
              ) : (
                topArticles.map((art, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ backgroundColor: '#F8FAFC' }}>
                    <div>
                      <h6 className="fw-black text-dark mb-1" style={{ fontSize: '12px' }}>{art.name}</h6>
                      <span className="text-muted fw-bold" style={{ fontSize: '10px' }}>{art.cat}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="fw-black text-dark" style={{ fontSize: '14px' }}>{art.pct}</span>
                      <i className="fi fi-rr-chart-line-up text-danger" style={{ fontSize: '16px' }}></i>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 bg-white p-4 text-start">
        <h5 className="fw-black text-dark mb-4" style={{ fontSize: '14px' }}>Derniers ajustements des tarifs</h5>
        <div className="table-responsive">
          <table className="table table-borderless align-middle w-100 m-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead style={{ backgroundColor: '#0978E8' }}>
              <tr className="small text-uppercase border-0" style={{ letterSpacing: '0.5px' }}>
                <th className="text-white fw-bold py-3 px-4 text-start bg-transparent" style={{ fontSize: '12px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Article</th>
                <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px' }}>Ancien Prix</th>
                <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px' }}>Nouveau Prix</th>
                <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px' }}>Différence</th>
                <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px' }}>Date d'Ajustement</th>
                <th className="text-white fw-bold py-3 text-center bg-transparent" style={{ fontSize: '12px', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted small">Chargement des données...</td>
                </tr>
              ) : recentAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-muted small">Aucun ajustement tarifaire trouvé en base.</td>
                </tr>
              ) : (
                recentAdjustments.map((adj, i) => (
                  <tr key={i} className="bg-light" style={{ borderRadius: '8px' }}>
                    <td className="py-3 px-4 text-start" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <div className="fw-black text-dark" style={{ fontSize: '12px' }}>{adj.article}</div>
                      <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>{adj.ref}</div>
                    </td>
                    <td className="py-3 text-center fw-black text-dark" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>{adj.old}</td>
                    <td className="py-3 text-center fw-black text-primary" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>{adj.new}</td>
                    <td className="py-3 text-center text-dark fw-bold" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>{adj.var}</td>
                    <td className="py-3 text-center fw-black text-dark" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>{adj.date}</td>
                    <td className="py-3 text-center" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <button className="btn p-0 border-0 bg-transparent text-warning hover-scale">
                        <i className="fi fi-rr-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .fw-black { font-weight: 900; }
        .hover-scale { transition: transform 0.2s ease; cursor: pointer; }
        .hover-scale:hover { transform: scale(1.1); }
      `}</style>
    </div>
  );
}
