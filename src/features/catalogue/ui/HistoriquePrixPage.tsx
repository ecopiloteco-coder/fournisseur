import React, { useEffect, useRef } from 'react';

const topArticles = [
  { name: 'Bandes podotactiles', cat: 'Peinture', pct: '7%' },
  { name: 'Trappe de visite basculante', cat: 'Menuiseries Intérieures', pct: '43%' },
  { name: 'Pissette à prolonger', cat: 'Etanchéité', pct: '6%' },
  { name: 'Bloc porte bois ISOBLINDE', cat: 'Menuiseries Intérieures', pct: '13%' },
  { name: 'Bouchement stépoc', cat: 'Gros œuvres', pct: '53%' },
];

const recentAdjustments = [
  { article: 'Bloc porte bois Renobloc', ref: 'MT - 001', old: '259.00 €', new: '262.00 €', var: '+ 0.06 %', date: '15 / 04 / 2026' },
  { article: 'Autoportant droit et incliné', ref: 'MT - 001', old: '53.44 €', new: '76.90 €', var: '+ 0.06 %', date: '15 / 04 / 2026' },
  { article: 'Chauffe bain Gaz 150L', ref: 'MT - 001', old: '255.45 €', new: '286.40 €', var: '+ 0.06 %', date: '15 / 04 / 2026' }
];

export function HistoriquePrixPage() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ((window as any).ApexCharts && chartRef.current) {
      const options = {
        series: [
          { name: 'Bloc porte bois Renobloc', data: [200, 60, 150, 125, 50, 15, 90, 115, 140, 125] },
          { name: 'Isolation en polyuréthanne 80 R3.45', data: [55, 100, 55, 175, 55, 105, 140, 155, 55, 175] },
          { name: 'Autoportant droit et incliné', data: [80, 35, 80, 125, 50, 205, 35, 60, 95, 125] }
        ],
        chart: { type: 'bar', height: 320, toolbar: { show: false }, parentHeightOffset: 0 },
        plotOptions: { bar: { columnWidth: '35%', borderRadius: 2 } },
        colors: ['#0084FF', '#22C55E', '#38BDF8'],
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
          categories: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027'],
          axisBorder: { show: false }, axisTicks: { show: false },
          labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } }
        },
        yaxis: { labels: { formatter: (v: number) => v === 300 ? '+300 €' : v + ' €', style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } } },
        legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '11px', fontWeight: 600, markers: { radius: 12 } },
        grid: { strokeDashArray: 4, borderColor: '#e2e8f0' }
      };

      const chart = new (window as any).ApexCharts(chartRef.current, options);
      chart.render();
      return () => chart.destroy();
    }
  }, []);

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
            <div ref={chartRef}></div>
          </div>
        </div>
        <div className="col-lg-5 col-xl-4">
          <div className="card shadow-sm border-0 rounded-4 bg-white p-4 h-100 text-start">
            <h5 className="fw-black text-dark mb-4" style={{ fontSize: '14px' }}>Évolution annuelle des 5 articles les plus utilisés</h5>
            <div className="d-flex flex-column gap-3">
              {topArticles.map((art, i) => (
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
              ))}
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
              {recentAdjustments.map((adj, i) => (
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
              ))}
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
