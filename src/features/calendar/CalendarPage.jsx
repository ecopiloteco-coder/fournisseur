import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../shared/providers/AuthContext'
import { fetchDemandesParEntreprise } from '../chiffrage/api/chiffrage.api'

export default function CalendarPage() {
    const calendarRef = useRef(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    const statusLabels = {
        en_cours: 'En cours',
        en_attente: 'En attente',
        termine: 'Termine',
        expire: 'Expire',
    }

    const normalizeStatus = (rawStatus) => {
        const value = String(rawStatus || '').toLowerCase().replace(/\s+/g, '_')

        if (value.includes('cours')) return 'en_cours'
        if (value.includes('attente') || value.includes('nouveau')) return 'en_attente'
        if (value.includes('termin')) return 'termine'
        if (value.includes('expir')) return 'expire'

        return 'inconnu'
    }

    const statusColors = {
        en_cours: { backgroundColor: '#eaf0ff', borderColor: '#3d5afe', textColor: '#2b4de0' },
        en_attente: { backgroundColor: '#fff4db', borderColor: '#f59e0b', textColor: '#ad6a00' },
        termine: { backgroundColor: '#e7f8f1', borderColor: '#10b981', textColor: '#0f8d62' },
        expire: { backgroundColor: '#feecec', borderColor: '#ef4444', textColor: '#d92d20' },
        inconnu: { backgroundColor: '#f3f4f6', borderColor: '#6b7280', textColor: '#4b5563' },
    }

    const toDateOnly = (rawDate) => {
        if (!rawDate) return null
        const date = new Date(rawDate)
        if (Number.isNaN(date.getTime())) return null
        return date.toISOString().slice(0, 10)
    }

    const addOneDay = (dateOnly) => {
        if (!dateOnly) return null
        const date = new Date(`${dateOnly}T00:00:00`)
        if (Number.isNaN(date.getTime())) return null
        date.setDate(date.getDate() + 1)
        return date.toISOString().slice(0, 10)
    }

    useEffect(() => {
        if (!window.FullCalendar) return

        let calendar
        let isActive = true

        const initCalendar = async () => {
            const calendarEl = calendarRef.current
            if (!calendarEl) return

            let events = []
            const userEntreprise = user?.keycloakId || (user?.entrepriseId ? String(user.entrepriseId) : '')

            if (userEntreprise) {
                try {
                    const projets = await fetchDemandesParEntreprise(userEntreprise)

                    events = projets
                        .map((projet) => {
                            const startCandidate = toDateOnly(projet.dateEnvoi || projet.createdAt || projet.deadline || projet.dateRetour)
                            const endCandidate = toDateOnly(projet.deadline || projet.dateRetour || projet.dateEnvoi || projet.createdAt)

                            if (!startCandidate) return null

                            const normalizedStatus = normalizeStatus(projet.status)
                            const colors = statusColors[normalizedStatus] || statusColors.inconnu

                            return {
                                id: `project-${projet.id}`,
                                title: projet.nomProjet || `Projet ${projet.id}`,
                                start: startCandidate,
                                end: addOneDay(endCandidate || startCandidate),
                                allDay: true,
                                backgroundColor: colors.backgroundColor,
                                borderColor: colors.borderColor,
                                textColor: colors.textColor,
                                extendedProps: {
                                    projectId: projet.id,
                                    status: normalizedStatus,
                                },
                            }
                        })
                        .filter(Boolean)
                } catch (error) {
                    console.error('[Calendar] Unable to load supplier projects', error)
                }
            }

            if (!isActive) return

            calendar = new window.FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'fr',
                height: 'auto',
                dayMaxEvents: 3,
                moreLinkClick: 'popover',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                editable: false,
                droppable: false,
                events,
                eventClassNames: (arg) => {
                    const status = arg?.event?.extendedProps?.status || 'inconnu'
                    return ['project-calendar-event', `project-status-${status}`]
                },
                eventContent: (arg) => {
                    const title = arg?.event?.title || 'Projet'
                    const status = arg?.event?.extendedProps?.status || 'inconnu'
                    const statusLabel = statusLabels[status] || 'Statut inconnu'
                    const isCompact = arg.view.type !== 'dayGridMonth'

                    if (isCompact) {
                        return { html: `<div class="fc-project-title">${title}</div>` }
                    }

                    return {
                        html: `
                            <div class="fc-project-event-wrap" title="${title} - ${statusLabel}">
                                <span class="fc-project-dot"></span>
                                <span class="fc-project-title">${title}</span>
                            </div>
                        `,
                    }
                },
                eventClick: (info) => {
                    const projectId = info?.event?.extendedProps?.projectId
                    if (projectId) {
                        navigate(`/chiffrage/${projectId}`)
                    }
                },
            })

            calendar.render()
        }

        void initCalendar()

        return () => {
            isActive = false
            if (calendar) calendar.destroy()
        }
    }, [navigate, user])

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Calendar</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Calendar</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <div className="row g-0">
                        <div className="col-lg-3 p-4 border-end bg-light-subtle">
                            <button className="btn btn-primary w-100 mb-4 fw-semibold" type="button" disabled>
                                <i className="fi fi-rr-calendar me-1"></i> Planning projets
                            </button>
                            <hr className="border-dashed my-4" />
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h6 className="mb-0">Statuts projet</h6>
                                <span className="badge text-bg-light">Couleurs</span>
                            </div>
                            <div id="external-events" className="d-grid gap-2">
                                <div className="rounded-3 px-3 py-2 bg-primary-subtle text-primary d-flex align-items-center justify-content-between">
                                    <span><i className="fi fi-rr-time-fast me-1"></i> En cours</span>
                                    <span className="badge bg-primary">Actif</span>
                                </div>
                                <div className="rounded-3 px-3 py-2 bg-warning-subtle text-warning d-flex align-items-center justify-content-between">
                                    <span><i className="fi fi-rr-hourglass-end me-1"></i> En attente</span>
                                    <span className="badge bg-warning text-dark">Pending</span>
                                </div>
                                <div className="rounded-3 px-3 py-2 bg-success-subtle text-success d-flex align-items-center justify-content-between">
                                    <span><i className="fi fi-rr-check me-1"></i> Termine</span>
                                    <span className="badge bg-success">Done</span>
                                </div>
                                <div className="rounded-3 px-3 py-2 bg-danger-subtle text-danger d-flex align-items-center justify-content-between">
                                    <span><i className="fi fi-rr-cross-circle me-1"></i> Expire</span>
                                    <span className="badge bg-danger">Urgent</span>
                                </div>
                            </div>
                            <div className="mt-3 p-3 rounded-3 border bg-white">
                                <div className="small text-muted mb-1">Astuce</div>
                                <div className="small text-dark">Cliquez sur un evenement pour ouvrir le projet.</div>
                            </div>
                        </div>
                        <div className="col-lg-9 p-4">
                            <div className="calendar-shell rounded-3 border p-2 bg-white">
                                <div ref={calendarRef}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .project-calendar-event {
                    border-radius: 8px !important;
                    border: 1px solid transparent !important;
                    border-left-width: 4px !important;
                    box-shadow: 0 1px 2px rgba(31, 42, 68, 0.08);
                    padding: 0 !important;
                }

                .project-status-en_cours {
                    border-color: #3d5afe !important;
                }

                .project-status-en_attente {
                    border-color: #f59e0b !important;
                }

                .project-status-termine {
                    border-color: #10b981 !important;
                }

                .project-status-expire {
                    border-color: #ef4444 !important;
                }

                .project-status-inconnu {
                    border-color: #6b7280 !important;
                }

                .fc-project-event-wrap {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    width: 100%;
                    padding: 4px 8px;
                }

                .fc-project-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: currentColor;
                    flex: 0 0 auto;
                }

                .fc-project-title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 12px;
                    font-weight: 600;
                }

                .fc .fc-toolbar-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1f2a44;
                }

                .fc .fc-button {
                    border-radius: 8px !important;
                    box-shadow: none !important;
                }

                .fc .fc-daygrid-more-link {
                    color: #3d5afe;
                    font-weight: 600;
                }

                .calendar-shell {
                    border-color: #d9e1ef !important;
                }

                .fc .fc-scrollgrid,
                .fc .fc-scrollgrid-section > td,
                .fc .fc-scrollgrid-section > th,
                .fc-theme-standard td,
                .fc-theme-standard th {
                    border-color: #d9e1ef !important;
                }

                .fc .fc-daygrid-day.fc-day-today {
                    background: #eef3ff !important;
                }
            `}</style>
        </>
    )
}
