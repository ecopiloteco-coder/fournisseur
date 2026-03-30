export default function FAQ() {
    const faqData = [
        {
            category: 'Questions Générales',
            items: [
                { q: 'Quelle est la politique de retour pour les équipements ?', a: 'Nous proposons une politique de retour de 30 jours pour tout matériel défectueux ou non conforme. Veuillez contacter notre support technique pour initier la procédure de retour.' },
                { q: 'Quels sont les délais de livraison standard ?', a: 'L\'expédition prend généralement 5 à 7 jours ouvrables, selon votre zone géographique et le mode de transport sélectionné par le projet.' },
                { q: 'Disposez-vous d\'un service d\'assistance technique ?', a: 'Oui, nous offrons un support 24h/24 et 7j/7 par e-mail et chat en direct pour vous accompagner dans tous vos besoins opérationnels.' }
            ]
        },
        {
            category: 'Gestion de Compte Fournisseur',
            items: [
                { q: 'Comment puis-je modifier les informations de mon compte ?', a: 'Accédez aux paramètres de votre compte, cliquez sur « Modifier le profil » pour mettre à jour votre raison sociale, e-mail ou vos coordonnées bancaires.' },
                { q: 'Quelle est la procédure pour sécuriser mon mot de passe ?', a: 'Naviguez dans Paramètres du compte > Sécurité > Changer le mot de passe. Saisissez votre mot de passe actuel, puis le nouveau pour valider le changement et renforcer la sécurité de votre accès.' }
            ]
        },
        {
            category: 'Réponses aux Appels d\'Offres',
            items: [
                { q: 'Comment répondre à une nouvelle demande de chiffrage ?', a: 'Dès qu\'un projet correspond à votre expertise, une notification vous est envoyée. Accédez à « Demandes de Chiffrage », examinez les lots et soumettez vos tarifs directement en ligne.' },
                { q: 'Puis-je modifier un devis après l\'avoir envoyé ?', a: 'Tant que la date limite de remise n\'est pas dépassée, vous pouvez mettre à jour vos tarifs dans la section « Mes Devis Envoyés ». Après l\'échéance, tout changement devra être validé par le gestionnaire du projet.' }
            ]
        },
        {
            category: 'Gestion du Catalogue & Bibliothèque',
            items: [
                { q: 'Comment importer mes propres tarifs d\'articles ?', a: 'Dans la section « Mon Catalogue », vous pouvez utiliser l\'outil d\'import Excel pour mettre à jour massivement vos prix ou ajouter manuellement de nouvelles références.' },
                { q: 'Qui peut voir les prix de mon catalogue ?', a: 'Vos tarifs sont confidentiels et ne sont visibles que par les chefs de projet EcoPilot pour faciliter la sélection des partenaires lors des phases de chiffrage.' }
            ]
        },
        {
            category: 'Paiements et Facturation',
            items: [
                { q: 'Comment sont traités les paiements des factures ?', a: 'Les paiements sont effectués par virement bancaire sous 30 jours après validation de la facture par le chef de projet, conformément aux conditions contractuelles établies.' },
                { q: 'Où puis-je consulter l\'état de mes factures ?', a: 'Vous pouvez suivre l\'état de vos factures en temps réel dans la section « Finances » de votre portail fournisseur.' }
            ]
        }
    ]

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">FAQ</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="#/dashboard">Tableau de Bord</a></li>
                            <li className="breadcrumb-item active" aria-current="page">FAQ</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-12 mb-5">
                    <div className="card p-sm-4 border-0 bg-light text-center" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/assets/images/background/faq.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="card-body">
                            <h4 className="text-white mb-2">Une question ? Nous sommes là pour vous aider.</h4>
                            <p className="text-white mb-4">Ou sélectionnez une catégorie pour trouver rapidement la réponse que vous cherchez.</p>
                            <div className="d-flex align-items-center w-lg-500px mx-auto position-relative">
                                <input type="text" className="form-control ps-5" placeholder="Rechercher une aide..." />
                                <i className="fi fi-rr-search position-absolute start-0 ms-3"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    {faqData.map((section, idx) => (
                        <div key={section.category} className="mb-4 text-start">
                            <h6 className="mb-3 fw-bold">{section.category}</h6>
                            <div className="accordion" id={`accordion-${idx}`}>
                                {section.items.map((item, i) => (
                                    <div key={i} className="accordion-item shadow-none mb-2 border rounded-3 overflow-hidden">
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed py-3 px-4 fw-medium text-dark" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${idx}-${i}`}>
                                                {item.q}
                                            </button>
                                        </h2>
                                        <div id={`collapse-${idx}-${i}`} className="accordion-collapse collapse" data-bs-parent={`#accordion-${idx}`}>
                                            <div className="accordion-body text-muted small p-4">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="card bg-warning bg-opacity-10 shadow-none border-0 mt-5">
                        <div className="card-body p-4 text-start">
                            <div className="row align-items-center">
                                <div className="col-md-9">
                                    <h6 className="fw-bold mb-4">Vous avez encore des questions ?</h6>
                                    <div className="row g-3">
                                        <div className="col-sm-6 border-end border-dark border-opacity-10">
                                            <div className="avatar avatar-xs bg-success rounded-circle text-white mb-2">
                                                <i className="fi fi-rr-phone-call"></i>
                                            </div>
                                            <h6 className="mb-1 small">+(33) 01 23 45 67 89</h6>
                                            <p className="text-2xs text-muted mb-0">Toujours là pour vous accompagner</p>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="avatar avatar-xs bg-info rounded-circle text-white mb-2">
                                                <i className="fi fi-rr-envelope"></i>
                                            </div>
                                            <h6 className="mb-1 small font-heading">support@ecopilot.com</h6>
                                            <p className="text-2xs text-muted mb-0">Une réponse rapide garantie</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 text-end d-none d-md-block">
                                    <img src="/assets/images/media/svg/media2.svg" className="img-fluid" alt="Support" style={{ maxHeight: '100px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card mb-4 shadow-sm border-0 text-start">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h6 className="card-title mb-1 fw-bold">Besoin d'aide supplémentaire ?</h6>
                            <p className="small text-muted mb-0">Envoyez-nous votre demande et notre équipe reviendra vers vous sous peu.</p>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Nom Complet</label>
                                    <input type="text" className="form-control form-control-sm border-0 bg-light" placeholder="Votre nom" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Adresse E-mail</label>
                                    <input type="email" className="form-control form-control-sm border-0 bg-light" placeholder="votre@email.com" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Votre Question</label>
                                    <textarea className="form-control form-control-sm border-0 bg-light" rows="4" placeholder="Tapez votre message..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm w-100 py-2 fw-bold shadow-sm mt-2">Envoyer la Demande</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
