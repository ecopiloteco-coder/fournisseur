import React, { useState, useMemo, useEffect, useRef } from 'react';

const LIBRARY_QUEUE_KEY = 'ecopilot_library_queue';

type Article = {
  id: number; code: string; label: string; category: string; unite: string;
  lastPrice: number; catalogPrice: number; status: string;
  history: { date: string; price: number; project: string; status: string }[];
};

const ARTICLES: Article[] = [
  { id: 1, code: 'MAT-001', label: "Béton prêt à l'emploi C25/30", category: 'Gros Œuvre', unite: 'M3', lastPrice: 85.00, catalogPrice: 88.00, status: 'priced', history: [{ date: 'Oct', price: 82.50, project: 'Résidence Les Lilas', status: 'Gagné' }, { date: 'Mar', price: 88.00, project: 'Villa Cap-Ferret', status: 'Gagné' }] },
  { id: 2, code: 'MAT-002', label: 'Acier HA12 (Barre 6m)', category: 'Gros Œuvre', unite: 'KG', lastPrice: 12.50, catalogPrice: 0, status: 'missing', history: [{ date: 'Oct', price: 11.20, project: 'Pont A10', status: 'Gagné' }, { date: 'Mar', price: 12.50, project: 'Stade Municipal', status: 'Gagné' }] },
  { id: 3, code: 'EL-105', label: 'Interrupteur Legrand Dooxie', category: 'Électricité', unite: 'U', lastPrice: 4.20, catalogPrice: 4.50, status: 'priced', history: [{ date: 'Jan', price: 4.15, project: 'Rénovation Loft', status: 'Gagné' }, { date: 'Mar', price: 4.50, project: 'Lotissement Vert', status: 'Gagné' }] },
  { id: 4, code: 'PL-302', label: 'Mitigeur Lavabo Grohe', category: 'Plomberie', unite: 'U', lastPrice: 115.00, catalogPrice: 0, status: 'missing', history: [{ date: 'Oct', price: 108.00, project: 'Hôtel Ritz', status: 'Gagné' }, { date: 'Mar', price: 115.00, project: 'Éco-Quartier', status: 'Gagné' }] },
  { id: 5, code: 'PE-010', label: 'Peinture Blanche Satin 10L', category: 'Peinture', unite: 'ENS', lastPrice: 45.00, catalogPrice: 48.00, status: 'priced', history: [{ date: 'Oct', price: 42.00, project: 'Mairie Nantes', status: 'Gagné' }, { date: 'Mar', price: 45.00, project: 'Musée Arts', status: 'Gagné' }] },
];

function calculateStats(article: Article) {
  const prices = article.history.map(h => h.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const first = prices[0]; const last = prices[prices.length - 1];
  const variation = first === 0 ? 0 : ((last - first) / first) * 100;
  return { avg, variation };
}

export function CatalogueArticlesPage() {
  const [articles, setArticles] = useState(ARTICLES);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('all');
  const [sentIds, setSentIds] = useState<number[]>(() => JSON.parse(localStorage.getItem('ecopilot_sent_articles') || '[]'));
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showTrend, setShowTrend] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ label: '', category: '', unite: 'U', catalogPrice: '' });
  const chartRef = useRef<HTMLDivElement>(null);

  const filteredArticles = useMemo(() => articles.filter(a => {
    const matchesSearch = a.label.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesView = view === 'all' ? true : view === 'missing' ? a.status === 'missing' : a.status === 'priced';
    return matchesSearch && matchesView;
  }), [articles, searchTerm, view]);

  const missingCount = articles.filter(a => a.status === 'missing').length;

  useEffect(() => {
    if (showTrend && selectedArticle && (window as any).ApexCharts && chartRef.current) {
      const options = {
        series: [{ name: 'Prix Unitaire (€)', data: selectedArticle.history.map(h => h.price) }],
        chart: { type: 'area', height: 250, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: selectedArticle.history.map(h => h.date), labels: { style: { colors: '#a1a1aa', fontSize: '12px' } } },
        yaxis: { labels: { formatter: (v: number) => v.toFixed(2) + ' €', style: { colors: '#a1a1aa', fontSize: '12px' } } },
        grid: { borderColor: '#f1f1f1', strokeDashArray: 4 },
        colors: ['var(--bs-primary)'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] } },
        markers: { size: 5, strokeColors: '#fff', strokeWidth: 2 },
        tooltip: { theme: 'light', y: { formatter: (v: number) => v.toFixed(2) + ' €' } }
      };
      const chart = new (window as any).ApexCharts(chartRef.current, options);
      chart.render();
      return () => chart.destroy();
    }
  }, [showTrend, selectedArticle]);

  const handleSendToLibrary = (article: Article) => {
    const existing = JSON.parse(localStorage.getItem(LIBRARY_QUEUE_KEY) || '[]');
    existing.push({ id: `FOUR-${article.code}`, nom_article: article.label, cat: article.category, unite: article.unite, pu: article.catalogPrice > 0 ? article.catalogPrice : article.lastPrice, fournisseur: 'Mon Catalogue Fournisseur', sentAt: new Date().toISOString() });
    localStorage.setItem(LIBRARY_QUEUE_KEY, JSON.stringify(existing));
    const newSent = [...sentIds, article.id];
    setSentIds(newSent);
    localStorage.setItem('ecopilot_sent_articles', JSON.stringify(newSent));
    setToast({ msg: `"${article.label}" envoyé à la bibliothèque Ecopilot ✓`, type: 'success' });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddArticle = () => {
    if (!newArticle.label || !newArticle.category) return;
    const art: Article = {
      id: articles.length + 1, code: `ART-${String(articles.length + 1).padStart(3, '0')}`,
      label: newArticle.label, category: newArticle.category, unite: newArticle.unite,
      lastPrice: parseFloat(newArticle.catalogPrice) || 0, catalogPrice: parseFloat(newArticle.catalogPrice) || 0,
      status: newArticle.catalogPrice ? 'priced' : 'missing',
      history: [{ date: 'Mar', price: parseFloat(newArticle.catalogPrice) || 0, project: 'Initial', status: 'Gagné' }]
    };
    setArticles(prev => [art, ...prev]);
    setNewArticle({ label: '', category: '', unite: 'U', catalogPrice: '' });
    setShowAddModal(false);
  };

  return (
    <>
      {toast && (
        <div className={`position-fixed top-0 end-0 m-4 alert alert-${toast.type} shadow-lg rounded-3 d-flex align-items-center gap-2 animate__animated animate__fadeInDown`} style={{ zIndex: 9999, minWidth: 340 }}>
          <i className="fi fi-rr-check-circle fs-5"></i>
          <span className="small fw-medium">{toast.msg}</span>
          <button className="btn-close ms-auto" onClick={() => setToast(null)}></button>
        </div>
      )}

      <div className="app-page-head d-flex justify-content-between align-items-center mb-4 text-start">
        <div>
          <h1 className="app-page-title">Mon Catalogue Articles</h1>
          <p className="text-muted small mb-0">Analysez l'évolution de vos prix et gérez votre catalogue.</p>
        </div>
        <button className="btn btn-outline-primary shadow-sm btn-sm px-3 rounded-pill" onClick={() => setShowAddModal(true)}>
          <i className="fi fi-rr-plus me-1"></i> Ajouter un Article
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-start rounded-4 h-100 bg-white">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="avatar avatar-md bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"><i className="fi fi-rr-list-check fs-5"></i></div>
              <div><h5 className="fw-bold mb-0">{articles.length}</h5><small className="text-muted">Total Articles</small></div>
            </div>
            <div className="progress mb-2" style={{ height: '8px', borderRadius: '4px' }}>
              <div className="progress-bar bg-primary" style={{ width: `${((articles.length - missingCount) / articles.length * 100)}%` }}></div>
            </div>
            <small className="text-muted">Catalogue complété à {((articles.length - missingCount) / articles.length * 100).toFixed(0)}%</small>
          </div>
        </div>
        <div className="col-lg-4">
          <button onClick={() => setView('missing')} className={`card border-0 shadow-sm p-4 w-100 text-start rounded-4 h-100 bg-white ${view === 'missing' ? 'border-warning border-2' : ''}`} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: '1.5rem', background: 'white', borderRadius: '1rem', boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)' }}>
            <div className="d-flex align-items-center gap-3"><div className="avatar avatar-md bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center"><i className="fi fi-rr-exclamation fs-5"></i></div><div><h5 className="fw-bold mb-0">{missingCount}</h5><small className="text-muted">Prix manquants</small></div></div>
            <div className="mt-3 small text-muted"><i className="fi fi-rr-info me-1"></i> Cliquez pour filtrer</div>
          </button>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 text-start rounded-4 h-100 bg-white">
            <div className="d-flex align-items-center gap-3 mb-3"><div className="avatar avatar-md bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"><i className="fi fi-rr-paper-plane fs-5"></i></div><div><h5 className="fw-bold mb-0">{sentIds.length}</h5><small className="text-muted">Articles en Bibliothèque</small></div></div>
            <small className="text-muted">Articles synchronisés avec Ecopilot</small>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm overflow-hidden text-start rounded-4 bg-white">
        <div className="card-header bg-white border-bottom p-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div className="btn-group btn-group-sm rounded-pill p-1 bg-light border">
            {['all', 'priced', 'missing'].map((v, i) => (
              <button key={v} onClick={() => setView(v)} className={`btn rounded-pill px-3 ${view === v ? 'btn-primary shadow-sm' : 'btn-light border-0'}`}>
                {i === 0 ? 'Tous' : i === 1 ? 'Chiffrés' : 'À Chiffrer'}
              </button>
            ))}
          </div>
          <div className="position-relative" style={{ minWidth: '300px' }}>
            <i className="fi fi-rr-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
            <input type="text" className="form-control form-control-sm ps-5 bg-light border-light rounded-pill"
              placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light bg-opacity-50">
              <tr className="small text-muted text-uppercase">
                <th className="px-4 py-3">Réf / Articles</th>
                <th className="py-3">Catégorie</th>
                <th className="py-3 text-center">Unité</th>
                <th className="py-3">Dernier Prix</th>
                <th className="py-3">Prix Catalogue</th>
                <th className="py-3">Tendance</th>
                <th className="py-3">Statut</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(a => {
                const stats = calculateStats(a);
                const isSent = sentIds.includes(a.id);
                return (
                  <tr key={a.id} className="transition-all">
                    <td className="px-4"><div className="fw-bold text-dark">{a.label}</div><small className="text-muted">{a.code}</small></td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 fw-medium">{a.category}</span></td>
                    <td className="text-center"><span className="badge bg-secondary-subtle text-secondary rounded-pill px-2">{a.unite}</span></td>
                    <td className="fw-bold text-dark">{a.lastPrice.toFixed(2)} €</td>
                    <td>{a.catalogPrice > 0 ? <span className="fw-bold text-primary">{a.catalogPrice.toFixed(2)} €</span> : <span className="text-danger small fw-bold"><i className="fi fi-rr-cross-circle me-1"></i>Non renseigné</span>}</td>
                    <td>
                      <span className={`small fw-bold ${stats.variation > 0 ? 'text-danger' : stats.variation < 0 ? 'text-success' : 'text-muted'}`}>
                        <i className={`fi fi-rr-arrow-trend-${stats.variation > 0 ? 'up' : 'down'} me-1`}></i>
                        {Math.abs(stats.variation).toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${a.status === 'priced' ? 'success' : 'warning'} bg-opacity-10 text-${a.status === 'priced' ? 'success' : 'warning'} border border-${a.status === 'priced' ? 'success' : 'warning'} border-opacity-25 rounded-pill`}>
                        {a.status === 'priced' ? 'À jour' : 'Manquant'}
                      </span>
                      {isSent && <i className="fi fi-sr-paper-plane text-info ms-2" title="Envoyé à Ecopilot" style={{ fontSize: '0.8rem' }}></i>}
                    </td>
                    <td className="px-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className={`btn btn-sm rounded-pill btn-icon-only ${isSent ? 'btn-light text-muted' : 'btn-outline-primary border-0'}`}
                          onClick={() => !isSent && handleSendToLibrary(a)} disabled={isSent} title="Envoyer à Ecopilot">
                          <i className={`fi fi-rr-${isSent ? 'check' : 'paper-plane'}`}></i>
                        </button>
                        <button className="btn btn-sm btn-outline-info border-0 rounded-pill btn-icon-only" onClick={() => { setSelectedArticle(a); setShowTrend(true); }}>
                          <i className="fi fi-rr-chart-line-up"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-dark border-0 rounded-pill btn-icon-only"><i className="fi fi-rr-edit"></i></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showTrend && selectedArticle && (
        <>
          <div className="offcanvas offcanvas-end show border-0 shadow-lg" style={{ visibility: 'visible', width: '450px', background: '#fdfdfd' }}>
            <div className="offcanvas-header border-bottom p-4 bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar avatar-md bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"><i className="fi fi-rr-stats fs-5"></i></div>
                <div><h5 className="offcanvas-title fw-bold text-dark">Intelligence Prix</h5><p className="text-muted small mb-0">Analyse de l'article</p></div>
              </div>
              <button type="button" className="btn-close shadow-none" onClick={() => setShowTrend(false)}></button>
            </div>
            <div className="offcanvas-body p-4 text-start">
              <h5 className="fw-extrabold text-primary mb-1">{selectedArticle.label}</h5>
              <div className="d-flex gap-2 mb-4">
                <span className="badge bg-light text-muted border small">{selectedArticle.code}</span>
                <span className="badge bg-light text-muted border small">{selectedArticle.category}</span>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="card border-0 bg-white shadow-sm p-3 rounded-4 text-center">
                    <small className="text-muted d-block mb-1 fw-medium" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Prix Moyen</small>
                    <h4 className="fw-extrabold mb-0 text-dark">{calculateStats(selectedArticle).avg.toFixed(2)} €</h4>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 bg-white shadow-sm p-3 rounded-4 text-center">
                    <small className="text-muted d-block mb-1 fw-medium" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Variation</small>
                    <h4 className={`fw-extrabold mb-0 ${calculateStats(selectedArticle).variation > 0 ? 'text-danger' : 'text-success'}`}>
                      {calculateStats(selectedArticle).variation > 0 ? '+' : ''}{calculateStats(selectedArticle).variation.toFixed(1)}%
                    </h4>
                  </div>
                </div>
              </div>
              <div className="card border-0 bg-white shadow-sm p-3 mb-4 rounded-4">
                <h6 className="small fw-extrabold mb-3 text-dark d-flex align-items-center gap-2"><i className="fi fi-rr-chart-histogram text-primary"></i> Évolution Temporelle</h6>
                <div ref={chartRef} style={{ minHeight: '250px' }}></div>
              </div>
              <button className={`btn w-100 rounded-pill py-3 fw-bold shadow-sm ${sentIds.includes(selectedArticle.id) ? 'btn-light text-muted border' : 'btn-primary'}`}
                onClick={() => !sentIds.includes(selectedArticle.id) && handleSendToLibrary(selectedArticle)} disabled={sentIds.includes(selectedArticle.id)}>
                <i className={`fi fi-rr-${sentIds.includes(selectedArticle.id) ? 'check' : 'paper-plane'} me-2`}></i>
                {sentIds.includes(selectedArticle.id) ? 'Article synchronisé avec Ecopilot' : 'Envoyer à Ecopilot'}
              </button>
            </div>
          </div>
          <div className="offcanvas-backdrop fade show" onClick={() => setShowTrend(false)} style={{ zIndex: 1040 }}></div>
        </>
      )}

      {showAddModal && (
        <div className="modal d-block animate__animated animate__fadeIn" style={{ zIndex: 9000 }} onClick={e => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header border-0 p-4 pb-2">
                <h5 className="modal-title fw-bold">Ajouter un article</h5>
                <button className="btn-close shadow-none" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body px-4 pb-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Désignation *</label>
                  <input className="form-control rounded-pill bg-light border-light" placeholder="Ex: Câble RO2V..." value={newArticle.label} onChange={e => setNewArticle(p => ({ ...p, label: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Catégorie *</label>
                  <select className="form-select rounded-pill bg-light border-light" value={newArticle.category} onChange={e => setNewArticle(p => ({ ...p, category: e.target.value }))}>
                    <option value="">Sélectionner...</option>
                    {['Gros Œuvre', 'Électricité', 'Plomberie', 'CVC', 'Peinture', 'Menuiserie', 'Autres'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Unité</label>
                    <select className="form-select rounded-pill bg-light border-light" value={newArticle.unite} onChange={e => setNewArticle(p => ({ ...p, unite: e.target.value }))}>
                      {['U', 'ML', 'M2', 'M3', 'KG', 'T', 'ENS', 'FF', 'H'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Prix Public HT (€)</label>
                    <input className="form-control rounded-pill bg-light border-light" type="number" placeholder="0.00" value={newArticle.catalogPrice} onChange={e => setNewArticle(p => ({ ...p, catalogPrice: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 px-4 pt-0 pb-4">
                <button className="btn btn-light rounded-pill px-4 fw-medium" onClick={() => setShowAddModal(false)}>Annuler</button>
                <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={handleAddArticle} disabled={!newArticle.label || !newArticle.category}>
                  <i className="fi fi-rr-check me-2"></i>Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .btn-icon-only { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; padding: 0; }
        .fw-extrabold { font-weight: 800; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </>
  );
}
