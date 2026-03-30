import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './VitrinePage.css'

/* ── Scroll reveal hook ── */
function useReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
            { threshold: 0.12 }
        )
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
            .forEach(el => observer.observe(el))
        return () => observer.disconnect()
    }, [])
}

/* ── Data ── */
const services = [
    {
        icon: '📊', title: 'Étude de Prix',
        desc: 'Analyse des dossiers d\'appels d\'offres, chiffrage détaillé et optimisation des coûts pour vos projets BTP.',
        tags: ['Chiffrage', 'AOO', 'Optimisation']
    },
    {
        icon: '📐', title: 'Métrés',
        desc: 'Quantification précise des ouvrages avec autocontrôle et bouclage, utilisant des logiciels spécialisés.',
        tags: ['Quantification', 'Précision', 'Autocontrôle']
    },
    {
        icon: '📝', title: 'Mémoire Technique',
        desc: 'Rédaction professionnelle des documents techniques mettant en valeur la méthodologie de votre entreprise.',
        tags: ['Rédaction', 'Méthodologie', 'Documents']
    },
    {
        icon: '🏗️', title: 'Méthodes & Planification',
        desc: 'Élaboration du PIC, phasage des travaux et planning d\'exécution pour une gestion optimale de chantier.',
        tags: ['PIC', 'Phasage', 'Planning']
    },
]

const projects = [
    {
        emoji: '🏚️', type: 'Réhabilitation', title: 'Réhabilitation de Bâtiments',
        desc: 'Études de prix complètes pour la rénovation et la mise aux normes de bâtiments existants.'
    },
    {
        emoji: '🏢', type: 'Construction Neuve', title: 'Construction Neuve',
        desc: 'Chiffrage et métrés pour les projets de construction neuve, de la conception à la livraison.'
    },
    {
        emoji: '🔀', type: 'Projets Mixtes', title: 'Projets Mixtes',
        desc: 'Expertise combinée pour les projets alliant réhabilitation et construction neuve sur un même site.'
    },
]

const clients = [
    { abbr: 'ERI', name: 'ERI Groupe', expertise: 'Rénovation, maintenance et travaux électriques/infrastructures', effectif: '~1 200 salariés', ca: '> 220M€' },
    { abbr: 'RD', name: 'Rabot Dutilleul', expertise: 'Construction de bâtiments, promotion et contractant général', effectif: '+650 collaborateurs', ca: '350M€' },
    { abbr: 'GO', name: 'Groupe Optim', expertise: 'Agencement de lieux de vente et rénovation', effectif: '50–99 salariés', ca: '+35M€' },
    { abbr: 'PO', name: 'Paris Ouest', expertise: 'Construction, promotion et gestion de biens immobiliers', effectif: '250–499 salariés', ca: '~130M€' },
    { abbr: 'EIF', name: 'Eiffage', expertise: 'Conception, construction, rénovation et réhabilitation', effectif: '~84 400 collab.', ca: '~24,3Md€' },
]

const ficheData = [
    ['Nom', 'ECOPILOT'],
    ['Date de création', 'Décembre 2020'],
    ['Secteur d\'activité', 'Économie de la construction — Étude de prix'],
    ['Activité principale', 'Métrés et chiffrage BTP'],
    ['Type d\'entreprise', 'Bureau d\'études'],
    ['Type de projets', 'Réhabilitation, neuf, mixte'],
    ['Organisation', 'Pôles d\'expertise + Service IT'],
    ['Outils utilisés', 'Logiciels de métrés, outils de planification, environnement numérique interne'],
]

export default function VitrinePage() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useReveal()

    useEffect(() => {
        document.body.classList.add('vitrine-body')
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => {
            document.body.classList.remove('vitrine-body')
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    const scrollTo = (id) => {
        setMenuOpen(false)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            {/* ── Navbar ── */}
            <nav className={`vt-navbar${scrolled ? ' scrolled' : ''}`}>
                <a className="vt-nav-logo" href="#accueil">
                    <img src="/ecopilot.png" alt="Ecopilot" onError={e => e.target.style.display = 'none'} />
                    <span>ECOPILOT</span>
                </a>
                <ul className="vt-nav-links">
                    {[['accueil', 'Accueil'], ['apropos', 'À Propos'], ['services', 'Services'], ['projets', 'Projets'], ['clients', 'Clients'], ['contact', 'Contact']].map(([id, label]) => (
                        <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
                    ))}
                </ul>
                <a className="vt-btn-connect" href="#/auth" onClick={e => { e.preventDefault(); navigate('/auth') }}>
                    🔐 Connexion
                </a>
                <div className="vt-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                    <span /><span /><span />
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`vt-mobile-menu${menuOpen ? ' open' : ''}`}>
                {[['accueil', 'Accueil'], ['apropos', 'À Propos'], ['services', 'Services'], ['projets', 'Projets'], ['clients', 'Clients'], ['contact', 'Contact']].map(([id, label]) => (
                    <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a>
                ))}
                <a href="#/auth" onClick={e => { e.preventDefault(); navigate('/auth') }} style={{ color: 'var(--primary)', fontWeight: 700 }}>🔐 Connexion</a>
            </div>

            {/* ── Hero ── */}
            <section id="accueil" className="vt-hero">
                <div className="vt-hero-grid">
                    <div className="vt-hero-text">
                        <div className="vt-hero-badge"><span />Bureau d'études BTP • Depuis 2020</div>
                        <h1 className="vt-hero-title">
                            L'expertise au service
                            <span className="highlight">de vos projets BTP</span>
                        </h1>
                        <p className="vt-hero-subtitle">
                            ECOPILOT est votre partenaire de confiance pour l'économie de la construction et l'étude de prix.
                            Précision, rigueur et innovation au cœur de chaque projet.
                        </p>
                        <div className="vt-hero-cta">
                            <a className="vt-btn-primary" href="#/auth" onClick={e => { e.preventDefault(); navigate('/auth') }}>
                                🔐 Accès Fournisseur
                            </a>
                            <a className="vt-btn-outline" href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact') }}>
                                Nous Contacter
                            </a>
                        </div>
                        <div className="vt-hero-stats">
                            <div className="vt-stat"><div className="vt-stat-num">5+</div><div className="vt-stat-label">Clients majeurs</div></div>
                            <div className="vt-stat"><div className="vt-stat-num">3</div><div className="vt-stat-label">Types de projets</div></div>
                            <div className="vt-stat"><div className="vt-stat-num">4</div><div className="vt-stat-label">Pôles d'expertise</div></div>
                            <div className="vt-stat"><div className="vt-stat-num">2020</div><div className="vt-stat-label">Année de création</div></div>
                        </div>
                    </div>
                    <div className="vt-hero-visual">
                        <div className="vt-hero-img-card">
                            <img src="/backraund.jpg" alt="Ecopilot BTP" onError={e => { e.target.style.display = 'none'; e.target.parentNode.style.background = 'linear-gradient(135deg, #0a1a14, #0d2a1e)'; e.target.parentNode.style.height = '380px' }} />
                        </div>
                        <div className="vt-hero-badge-float b1"><span className="dot" />Étude de prix active</div>
                        <div className="vt-hero-badge-float b2">📊 Chiffrage précis</div>
                    </div>
                </div>
            </section>

            <div className="vt-divider" />

            {/* ── À Propos ── */}
            <section id="apropos" style={{ padding: '100px 5%', background: 'var(--bg-dark)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="vt-section-header reveal">
                        <div className="vt-section-label">À PROPOS</div>
                        <h2 className="vt-section-title">Qui sommes-nous ?</h2>
                        <p className="vt-section-sub">Un bureau d'études spécialisé en économie de la construction, créé en décembre 2020, accompagnant les acteurs du BTP dans leurs projets.</p>
                    </div>
                    <div className="vt-about-wrap">
                        <div className="vt-about-grid">
                            <div className="vt-about-text reveal-left">
                                <p>ECOPILOT est un <strong style={{ color: 'var(--primary)' }}>bureau d'études spécialisé en économie de la construction et étude de prix</strong>, créé en décembre 2020.</p>
                                <p>L'entreprise accompagne les acteurs du bâtiment dans l'analyse financière et technique de leurs projets, depuis l'étude initiale jusqu'à la remise des offres.</p>
                                <p>ECOPILOT intervient sur différents types de projets : <strong>réhabilitation, construction neuve</strong> et <strong>projets mixtes</strong>, avec une expertise reconnue en métrés, étude de prix, mémoires techniques et planification.</p>
                                <div className="vt-about-values">
                                    {['Rigueur & Précision', 'Transparence', 'Innovation', 'Collaboration', 'Qualité', 'Digitalisation'].map(v => (
                                        <div key={v} className="vt-value-chip">
                                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            {v}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="vt-mission-vision reveal-right">
                                <div className="vt-mv-card">
                                    <h4>🎯 Mission</h4>
                                    <p>Accompagner les entreprises du BTP dans l'optimisation économique et technique de leurs projets en leur fournissant des études précises, fiables et compétitives.</p>
                                </div>
                                <div className="vt-mv-card">
                                    <h4>🚀 Vision</h4>
                                    <p>Devenir une référence dans la <strong>digitalisation des études de prix</strong> dans le secteur du bâtiment, en proposant des solutions innovantes et performantes adaptées aux besoins métiers.</p>
                                </div>
                                <div className="vt-mv-card">
                                    <h4>🌱 Notre Expertise</h4>
                                    <p>Métrés · Étude de prix · Mémoires techniques · Planification · PIC · Phasage des travaux</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="vt-divider" />

            {/* ── Services ── */}
            <section id="services" className="vt-services-bg" style={{ padding: '100px 5%' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="vt-section-header centered reveal">
                        <div className="vt-section-label">SERVICES</div>
                        <h2 className="vt-section-title">Nos Pôles d'Expertise</h2>
                        <p className="vt-section-sub">Des services complets et intégrés pour vous accompagner à chaque étape de vos projets de construction.</p>
                    </div>
                    <div className="vt-services-grid">
                        {services.map((s, i) => (
                            <div key={i} className="vt-service-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="vt-service-icon">{s.icon}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                                <div className="vt-service-tags">
                                    {s.tags.map(t => <span key={t} className="vt-tag">{t}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="vt-divider" />

            {/* ── Projets ── */}
            <section id="projets" style={{ padding: '100px 5%', background: 'var(--bg-dark)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="vt-section-header reveal">
                        <div className="vt-section-label">PROJETS</div>
                        <h2 className="vt-section-title">Types de Projets</h2>
                        <p className="vt-section-sub">ECOPILOT intervient sur tous les types de projets du secteur BTP avec la même exigence de qualité.</p>
                    </div>
                    <div className="vt-projects-grid">
                        {projects.map((p, i) => (
                            <div key={i} className="vt-project-card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                                <div className="vt-project-bg">{p.emoji}</div>
                                <div className="vt-project-content">
                                    <span className="vt-project-type">{p.type}</span>
                                    <h3 className="vt-project-title">{p.title}</h3>
                                    <p className="vt-project-desc">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="vt-divider" />

            {/* ── Clients ── */}
            <section id="clients" className="vt-clients-bg" style={{ padding: '100px 5%' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="vt-section-header centered reveal">
                        <div className="vt-section-label">CLIENTS</div>
                        <h2 className="vt-section-title">Ils Nous Font Confiance</h2>
                        <p className="vt-section-sub">ECOPILOT accompagne les plus grands acteurs du BTP français dans leurs projets les plus ambitieux.</p>
                    </div>
                    <div className="vt-clients-grid">
                        {clients.map((c, i) => (
                            <div key={i} className="vt-client-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="vt-client-logo">{c.abbr}</div>
                                <div className="vt-client-name">{c.name}</div>
                                <div className="vt-client-expertise">{c.expertise}</div>
                                <div className="vt-client-stats">
                                    <div className="vt-client-stat">👥 {c.effectif}</div>
                                    <div className="vt-client-stat">💰 CA {c.ca}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="vt-divider" />

            {/* ── Fiche signalétique ── */}
            <section style={{ padding: '100px 5%', background: 'var(--bg-dark)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="vt-section-header centered reveal">
                        <div className="vt-section-label">FICHE ENTREPRISE</div>
                        <h2 className="vt-section-title">Fiche Signalétique</h2>
                    </div>
                    <div className="vt-fiche-wrap reveal">
                        <table className="vt-fiche-table">
                            <tbody>
                                {ficheData.map(([k, v]) => (
                                    <tr key={k}>
                                        <th>{k}</th>
                                        <td>{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <div className="vt-divider" />

            {/* ── Contact ── */}
            <section id="contact" style={{ padding: '100px 5%', background: 'var(--bg-dark)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="vt-section-header reveal">
                        <div className="vt-section-label">CONTACT</div>
                        <h2 className="vt-section-title">Travaillons Ensemble</h2>
                        <p className="vt-section-sub">Vous avez un projet ? Nos experts sont disponibles pour analyser vos besoins et vous proposer la solution adaptée.</p>
                    </div>
                    <div className="vt-contact-grid">
                        <div className="vt-contact-info reveal-left">
                            <h3>Contactez-nous</h3>
                            <p>Notre équipe d'experts vous répond dans les plus brefs délais pour étudier votre projet et vous proposer une offre sur mesure.</p>
                            <div className="vt-contact-item">
                                <div className="vt-contact-item-icon">📍</div>
                                <div className="vt-contact-item-text"><strong>Adresse</strong><span>France — Bureau d'études BTP</span></div>
                            </div>
                            <div className="vt-contact-item">
                                <div className="vt-contact-item-icon">📧</div>
                                <div className="vt-contact-item-text"><strong>Email</strong><span>contact@ecopilot.fr</span></div>
                            </div>
                            <div className="vt-contact-item">
                                <div className="vt-contact-item-icon">📞</div>
                                <div className="vt-contact-item-text"><strong>Téléphone</strong><span>+33 (0)1 XX XX XX XX</span></div>
                            </div>
                            <div className="vt-contact-item">
                                <div className="vt-contact-item-icon">🕐</div>
                                <div className="vt-contact-item-text"><strong>Disponibilité</strong><span>Lun–Ven : 8h30 – 18h00</span></div>
                            </div>
                        </div>
                        <div className="vt-contact-form reveal-right">
                            <form onSubmit={e => e.preventDefault()}>
                                <div className="vt-form-row">
                                    <div className="vt-form-group">
                                        <label htmlFor="fname">Prénom</label>
                                        <input id="fname" type="text" placeholder="Votre prénom" />
                                    </div>
                                    <div className="vt-form-group">
                                        <label htmlFor="lname">Nom</label>
                                        <input id="lname" type="text" placeholder="Votre nom" />
                                    </div>
                                </div>
                                <div className="vt-form-group">
                                    <label htmlFor="cemail">Email professionnel</label>
                                    <input id="cemail" type="email" placeholder="vous@entreprise.fr" />
                                </div>
                                <div className="vt-form-group">
                                    <label htmlFor="cservice">Service souhaité</label>
                                    <select id="cservice">
                                        <option value="">Sélectionner un service</option>
                                        <option>Étude de prix</option>
                                        <option>Métrés</option>
                                        <option>Mémoire technique</option>
                                        <option>Méthodes &amp; Planification</option>
                                        <option>Autre</option>
                                    </select>
                                </div>
                                <div className="vt-form-group">
                                    <label htmlFor="cmessage">Votre projet</label>
                                    <textarea id="cmessage" placeholder="Décrivez votre projet, le type de travaux, les délais souhaités..."></textarea>
                                </div>
                                <button type="submit" className="vt-form-submit">
                                    Envoyer la Demande →
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="vt-footer">
                <div className="vt-footer-inner">
                    <a className="vt-footer-logo" href="#accueil" onClick={e => { e.preventDefault(); scrollTo('accueil') }}>
                        <img src="/ecopilot.png" alt="Ecopilot" onError={e => e.target.style.display = 'none'} />
                        <span>ECOPILOT</span>
                    </a>
                    <div className="vt-footer-links">
                        {[['apropos', 'À Propos'], ['services', 'Services'], ['projets', 'Projets'], ['clients', 'Clients'], ['contact', 'Contact']].map(([id, label]) => (
                            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a>
                        ))}
                    </div>
                    <div className="vt-footer-copy">© 2024 ECOPILOT — Bureau d'études BTP. Tous droits réservés.</div>
                </div>
            </footer>
        </>
    )
}
