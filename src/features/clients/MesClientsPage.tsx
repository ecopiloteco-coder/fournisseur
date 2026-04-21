import React, { useState, useMemo } from 'react';

// --- Types ---
type ClientProject = {
  id: string;
  nom: string;
  agent: string;
};

type Client = {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  contactPrincipale: string;
  projets: ClientProject[];
};

// --- Données factices basées sur les maquettes ---
const dummyClients: Client[] = [
  {
    id: '1',
    nom: 'EcoPilot',
    email: 'contact@eco-pilot.com',
    telephone: '06 12 34 56 78',
    contactPrincipale: 'Robert Brown',
    projets: [
      { id: 'p1', nom: 'Cambrone_Paris 15 _RE_EDP', agent: 'Alice Bernard' },
      { id: 'p2', nom: 'Cambrone_Paris 15 _RE_EDP', agent: 'Alice Bernard' },
    ],
  },
  {
    id: '2',
    nom: 'Sophie Martin',
    email: 's.martin@partner.com',
    telephone: '06 12 34 56 78',
    contactPrincipale: 'Robert Brown',
    projets: [
      { id: 'p3', nom: 'Demande de chiffrage - projet 2', agent: 'Robert Brown' },
      { id: 'p4', nom: 'Projet Résidence Lagon', agent: 'Robert Brown' },
      { id: 'p5', nom: 'Rénovation Mairie', agent: 'Alice Bernard' },
      { id: 'p6', nom: 'Construction Gymnase', agent: 'Sophie L.' },
    ],
  },
  {
    id: '3',
    nom: 'TechBTP',
    email: 'contact@techbtp.fr',
    telephone: '06 12 34 56 78',
    contactPrincipale: 'Jean Dupont',
    projets: [
      { id: 'p7', nom: 'Immeuble Lafayette', agent: 'Paul M.' },
    ],
  },
  {
    id: '4',
    nom: 'InnovBuild',
    email: 'hello@innovbuild.com',
    telephone: '06 12 34 56 78',
    contactPrincipale: 'Marie Curie',
    projets: Array(12).fill({ id: 'px', nom: 'Projet Standard', agent: 'Employé X' }),
  },
  {
    id: '5',
    nom: 'EcoPilot IDF',
    email: 'idf@eco-pilot.com',
    telephone: '06 12 34 56 78',
    contactPrincipale: 'Marc L.',
    projets: Array(7).fill({ id: 'px', nom: 'Projet Ile de france', agent: 'Alice Bernard' }),
  },
  {
    id: '6',
    nom: 'Bâtiments de l\'Est',
    email: 'est@batiments.fr',
    telephone: '06 12 34 56 78',
    contactPrincipale: 'Luc R.',
    projets: Array(6).fill({ id: 'px', nom: 'Projet Est', agent: 'Alice Bernard' }),
  },
];

export function MesClientsPage() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return dummyClients.filter((c) =>
      c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="container-fluid pb-5">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="text-start mb-3 mb-md-0">
          <h4 className="fw-black text-dark mb-1" style={{ color: '#1B2A4E', fontSize: '20px' }}>Mes client</h4>
          <p className="text-muted small mb-0">Retrouvez tous vos clients en un seul endroit centralisé.</p>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Search Bar */}
          <div className="position-relative">
            <i className="fi fi-rr-search position-absolute top-50 translate-middle-y ms-3" style={{ color: '#6Cb2FF' }}></i>
            <input
              type="text"
              className="form-control rounded-pill border-0 shadow-sm ps-5 py-2"
              placeholder="Rechercher"
              style={{ minWidth: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Toggle View */}
          <div className="bg-white rounded-pill shadow-sm d-flex p-1">
            <button
              className={`btn btn-sm rounded-pill d-flex align-items-center justify-content-center ${viewType === 'grid' ? 'text-white' : 'text-muted'}`}
              style={{ width: '32px', height: '32px', backgroundColor: viewType === 'grid' ? '#6Cb2FF' : 'transparent', border: 'none' }}
              onClick={() => setViewType('grid')}
            >
              <i className="fi fi-rr-apps"></i>
            </button>
            <button
              className={`btn btn-sm rounded-pill d-flex align-items-center justify-content-center ${viewType === 'list' ? 'text-white' : 'text-muted'}`}
              style={{ width: '32px', height: '32px', backgroundColor: viewType === 'list' ? '#6Cb2FF' : 'transparent', border: 'none' }}
              onClick={() => setViewType('list')}
            >
              <i className="fi fi-rr-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {viewType === 'grid' ? (
        <div className="row g-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-3 h-100 text-start p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="fw-bold mb-0" style={{ color: '#0978E8' }}>{client.nom}</h6>
                  <button className="btn btn-sm btn-light rounded-2 px-2 py-1 text-primary bg-primary bg-opacity-10 border-0">
                    <i className="fi fi-br-menu-dots-vertical" style={{ fontSize: '10px' }}></i>
                  </button>
                </div>
                
                <p className="small fw-bold text-dark mb-3">
                  {client.projets.length > 0 ? client.projets[0].nom : 'Aucun projet'}
                </p>
                
                <ul className="list-unstyled mb-0 d-flex flex-column gap-2 small">
                  <li className="d-flex align-items-center text-muted">
                    <i className="fi fi-rr-envelope text-primary opacity-50 me-2"></i>
                    {client.email}
                  </li>
                  <li className="d-flex align-items-center text-muted">
                    <i className="fi fi-rr-phone-call text-primary opacity-50 me-2"></i>
                    {client.telephone}
                  </li>
                  <li className="d-flex align-items-center text-muted">
                    <i className="fi fi-rr-user text-primary opacity-50 me-2"></i>
                    {client.contactPrincipale}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive mt-2">
          <table className="table table-borderless align-middle w-100" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead style={{ backgroundColor: '#6Cb2FF' }}>
              <tr className="small text-white">
                <th className="py-3 px-4 fw-medium text-start bg-transparent border-0" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Nom d'entreprise</th>
                <th className="py-3 px-4 fw-medium text-start bg-transparent border-0">Email</th>
                <th className="py-3 px-4 fw-medium text-start bg-transparent border-0">Téléphone</th>
                <th className="py-3 px-4 fw-medium text-center bg-transparent border-0">Nombre de Projets</th>
                <th className="py-3 px-4 fw-medium text-center bg-transparent border-0" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="bg-white shadow-sm" style={{ borderRadius: '8px' }}>
                  <td className="py-3 px-4 fw-bold text-dark text-start" style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', fontSize: '13px' }}>
                    {client.nom}
                  </td>
                  <td className="py-3 px-4 text-dark fw-semibold text-start" style={{ fontSize: '13px' }}>{client.email}</td>
                  <td className="py-3 px-4 text-dark fw-semibold text-start" style={{ fontSize: '13px' }}>{client.telephone}</td>
                  <td className="py-3 px-4 text-dark fw-bold text-center" style={{ fontSize: '13px' }}>{client.projets.length}</td>
                  <td className="py-3 px-4 text-center" style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                    <button 
                      className="btn btn-sm btn-link text-warning p-0" 
                      title="Consulter"
                      onClick={() => setSelectedClient(client)}
                    >
                      <i className="fi fi-rr-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination (statique pour la démo) */}
          <div className="d-flex justify-content-center mt-4">
             <ul className="pagination mb-0 gap-2">
                <li className="page-item"><button className="page-link border-0 rounded-circle text-primary px-3 bg-transparent"><i className="fi fi-rr-angle-left"></i></button></li>
                <li className="page-item"><button className="page-link border-0 rounded-circle text-primary px-3 bg-transparent">1</button></li>
                <li className="page-item"><button className="page-link border-0 rounded-circle text-white px-3" style={{ backgroundColor: '#0978E8' }}>2</button></li>
                <li className="page-item"><button className="page-link border-0 rounded-circle text-primary px-2 bg-transparent">...</button></li>
                <li className="page-item"><button className="page-link border-0 rounded-circle text-primary px-3 bg-transparent">9</button></li>
                <li className="page-item"><button className="page-link border-0 rounded-circle text-primary px-3 bg-transparent"><i className="fi fi-rr-angle-right"></i></button></li>
             </ul>
          </div>
        </div>
      )}

      {/* POPUP (MODAL) DÉTAILS CLIENT */}
      {selectedClient && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(235, 240, 246, 0.8)' }}></div>
          <div className="modal d-block" tabIndex={-1} role="dialog" onClick={() => setSelectedClient(null)}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-content border-0 shadow-lg rounded-4 p-4 text-start">
                  
                {/* Modal Header */}
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                     <i className="fi fi-rr-users"></i>
                  </div>
                  <h5 className="fw-bold mb-0 text-dark">Détails client</h5>
                </div>

                {/* Client Info */}
                <div className="d-flex align-items-center mb-4 ps-2">
                   <div className="rounded-circle d-flex align-items-center justify-content-center me-4" style={{ width: '70px', height: '70px', backgroundColor: '#E4ECFA', color: '#1B2A4E', fontSize: '24px', fontWeight: '800' }}>
                      {getInitials(selectedClient.nom)}
                   </div>
                   <div>
                      <h5 className="fw-black text-dark mb-2">{selectedClient.nom}</h5>
                      <div className="d-flex flex-column gap-1 small fw-semibold text-muted">
                         <span className="d-flex align-items-center"><i className="fi fi-rr-envelope text-primary opacity-50 me-2" style={{ fontSize: '14px' }}></i> {selectedClient.email}</span>
                         <span className="d-flex align-items-center"><i className="fi fi-rr-phone-call text-primary opacity-50 me-2" style={{ fontSize: '14px' }}></i> {selectedClient.telephone}</span>
                      </div>
                   </div>
                </div>

                {/* Projects Table */}
                <div className="table-responsive w-100">
                    <table className="table table-borderless align-middle w-100" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                      <thead style={{ backgroundColor: '#6Cb2FF' }}>
                        <tr className="small text-white text-center">
                          <th className="py-2 px-3 fw-medium bg-transparent border-0 text-start" style={{ borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }}>Nom Projet</th>
                          <th className="py-2 px-3 fw-medium bg-transparent border-0">Agent chargé</th>
                          <th className="py-2 px-3 fw-medium bg-transparent border-0" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedClient.projets.slice(0, 4).map((proj, idx) => (
                           <tr key={idx} className="bg-white" style={{ borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                             <td className="py-3 px-3 fw-bold text-dark text-start" style={{ fontSize: '12px', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', backgroundColor: '#F8FAFC' }}>
                               {proj.nom}
                             </td>
                             <td className="py-3 px-3 text-dark fw-bold text-center" style={{ fontSize: '12px', backgroundColor: '#F8FAFC' }}>
                               {proj.agent}
                             </td>
                             <td className="py-3 px-3 text-center" style={{ borderTopRightRadius: '6px', borderBottomRightRadius: '6px', backgroundColor: '#F8FAFC' }}>
                               <button className="btn btn-sm btn-link text-warning p-0 me-2">
                                 <i className="fi fi-rr-eye"></i>
                               </button>
                               <button className="btn btn-sm btn-link p-0" style={{ color: '#0978E8' }}>
                                 <i className="fi fi-rr-comment-alt"></i>
                               </button>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                </div>

                {/* Modal Footer */}
                <div className="d-flex justify-content-center gap-3 mt-4 pt-2">
                   <button 
                     type="button" 
                     className="btn btn-outline-primary rounded-pill px-5 py-2 fw-bold" 
                     style={{ color: '#6Cb2FF', borderColor: '#A0C6FF' }}
                     onClick={() => setSelectedClient(null)}
                   >
                     Annuler
                   </button>
                   <button 
                     type="button" 
                     className="btn text-white rounded-pill px-5 py-2 fw-bold" 
                     style={{ backgroundColor: '#6Cb2FF' }}
                   >
                     Ajouter
                   </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
