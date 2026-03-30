import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function CalendarPage() {
    const calendarRef = useRef(null)

    useEffect(() => {
        if (window.FullCalendar) {
            const calendarEl = calendarRef.current

            // Link external events
            const containerEl = document.getElementById('external-events');
            new window.FullCalendar.Draggable(containerEl, {
                itemSelector: '.fc-event',
                eventData: function (eventEl) {
                    return {
                        title: eventEl.innerText.trim(),
                        className: eventEl.classList.value // preserve colors
                    };
                }
            });

            const calendar = new window.FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                editable: true,
                droppable: true,
                events: [
                    { title: 'Project Presentation', start: '2024-08-15', className: 'bg-info' },
                    { title: 'Team Standup', start: '2024-08-16T10:00:00', className: 'bg-primary' },
                    { title: 'Recruitment Interview', start: '2024-08-18', className: 'bg-danger' },
                ],
                drop: function (info) {
                    // if you want to remove after drop
                    // info.draggedEl.parentNode.removeChild(info.draggedEl);
                }
            })
            calendar.render()
            return () => calendar.destroy()
        }
    }, [])

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

            <div className="card">
                <div className="card-body p-0">
                    <div className="row g-0">
                        <div className="col-lg-3 p-4 border-end">
                            <button className="btn btn-primary waves-effect waves-light w-100 mb-4">
                                <i className="fi fi-rr-plus me-1"></i> Add Event
                            </button>
                            <hr className="border-dashed my-4" />
                            <h6 className="mb-3">Draggable Events</h6>
                            <div id="external-events" className="d-grid gap-2">
                                <div className="fc-event cursor-move rounded-2 px-3 py-2 bg-primary-subtle text-primary">
                                    <i className="fi fi-rr-plane-departure me-1"></i> Tour & Picnic
                                </div>
                                <div className="fc-event cursor-move rounded-2 px-3 py-2 bg-success-subtle text-success">
                                    <i className="fi fi-rr-workflow-alt me-1"></i> Group Projects
                                </div>
                                <div className="fc-event cursor-move rounded-2 px-3 py-2 bg-info-subtle text-info">
                                    <i className="fi fi-rr-podium me-1"></i> Presentation
                                </div>
                                <div className="fc-event cursor-move rounded-2 px-3 py-2 bg-warning-subtle text-warning">
                                    <i className="fi fi-rs-massage me-1"></i> Wellness
                                </div>
                                <div className="fc-event cursor-move rounded-2 px-3 py-2 bg-danger-subtle text-danger">
                                    <i className="fi fi-rr-hr me-1"></i> Recruitment
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 p-4">
                            <div ref={calendarRef}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
