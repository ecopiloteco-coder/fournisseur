import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const TaskCard = ({ title, description, startDate, endDate, progress, status, statusClass, avatars }) => (
    <div className={`card card-action cursor-move action-border-${statusClass} h-auto mb-3 shadow-sm`}>
        <div className="card-header p-3 d-flex align-items-center justify-content-between border-0 pb-0">
            <h6 className="card-title mb-0 small fw-bold">{title}</h6>
            <div className="btn-group">
                <button className="btn btn-sm btn-icon btn-action-gray" type="button"><i className="fi fi-br-menu-dots-vertical"></i></button>
            </div>
        </div>
        <div className="card-body pt-2 p-3">
            <p className="text-muted text-2xs mb-3">{description}</p>
            <div className="d-flex gap-2 mb-3">
                <div className="w-50">
                    <span className="text-muted text-3xs d-block">Start Date</span>
                    <span className="text-dark fw-bold text-2xs">{startDate}</span>
                </div>
                <div className="w-50">
                    <span className="text-muted text-3xs d-block">End Date</span>
                    <span className="text-dark fw-bold text-2xs">{endDate}</span>
                </div>
            </div>
            <div className="progress progress-sm mb-3" style={{ height: '4px' }}>
                <div className={`progress-bar bg-${statusClass}`} style={{ width: `${progress}%` }}></div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
                <div className="avatar-group">
                    {avatars.map((av, i) => (
                        <div key={i} className="avatar avatar-xs rounded-circle border border-2 border-white">
                            <img src={`/assets/images/avatar/avatar${av}.webp`} alt="" />
                        </div>
                    ))}
                </div>
                <span className={`badge badge-sm rounded-pill bg-${statusClass}-subtle text-${statusClass} text-2xs px-2`}>{status}</span>
            </div>
        </div>
    </div>
)

const TaskColumn = ({ title, statusClass, tasks, onAddTask }) => (
    <div className="col-xxl-3 col-md-6 mb-4">
        <div className={`card bg-${statusClass}-subtle border-0 shadow-none border-top border-3 border-${statusClass} h-100`}>
            <div className="card-header p-3 d-flex align-items-center justify-content-between border-0 pb-0 bg-transparent">
                <h6 className="card-title mb-0 fw-bold">{title}</h6>
                <button className={`btn btn-sm btn-icon btn-action-${statusClass}`} onClick={onAddTask}>
                    <i className="fi fi-rr-plus"></i>
                </button>
            </div>
            <div className="card-body p-3 task-list">
                {tasks.map((task, i) => (
                    <TaskCard key={i} {...task} statusClass={statusClass} />
                ))}
            </div>
        </div>
    </div>
)

export default function TaskManagement() {
    const columns = [
        {
            title: 'New Task',
            statusClass: 'primary',
            tasks: [
                { title: 'Hero Section Design', description: 'Design a modern hero section for the landing page.', startDate: '14 Aug 2024', endDate: '20 Aug 2024', progress: 15, status: 'New', avatars: [5] },
                { title: 'Logo Design', description: 'Create a versatile logo that works in all sizes.', startDate: '14 Aug 2024', endDate: '20 Aug 2024', progress: 15, status: 'New', avatars: [1, 2, 3] }
            ]
        },
        {
            title: 'In Progress',
            statusClass: 'info',
            tasks: [
                { title: 'Website Design', description: 'Full UI/UX design for the main corporate website.', startDate: '14 Aug 2024', endDate: '20 Aug 2024', progress: 45, status: 'In Progress', avatars: [5, 4] }
            ]
        },
        {
            title: 'Pending',
            statusClass: 'warning',
            tasks: [
                { title: 'Mobile App Wireframe', description: 'Low-fidelity wireframes for the user dashboard.', startDate: '15 Aug 2024', endDate: '22 Aug 2024', progress: 10, status: 'Pending', avatars: [1, 4] }
            ]
        },
        {
            title: 'Done',
            statusClass: 'success',
            tasks: [
                { title: 'Deployment Setup', description: 'Configure CI/CD pipelines for staging environment.', startDate: '10 Aug 2024', endDate: '14 Aug 2024', progress: 100, status: 'Completed', avatars: [2, 3] }
            ]
        }
    ]

    useEffect(() => {
        if (window.Sortable) {
            const taskLists = document.querySelectorAll('.task-list');
            taskLists.forEach(el => {
                new window.Sortable(el, {
                    group: 'tasks',
                    animation: 150,
                    ghostClass: 'bg-light',
                    dragClass: 'sortable-drag',
                    handle: '.card-header' // Allow dragging from the header
                });
            });
        }
    }, []);

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Task Management</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Task Management</li>
                        </ol>
                    </nav>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                    <i className="fi fi-rr-plus"></i> Add New Task
                </button>
            </div>

            <div className="card d-flex flex-row flex-wrap align-items-center h-auto mb-4 border-0 shadow-sm overflow-hidden">
                <ul className="nav nav-underline me-auto px-3 gap-2 border-0">
                    <li className="nav-item"><a className="nav-link py-3 px-2 active" href="#">Overview</a></li>
                    <li className="nav-item"><a className="nav-link py-3 px-2" href="#">Timeline</a></li>
                    <li className="nav-item"><a className="nav-link py-3 px-2" href="#">Board</a></li>
                </ul>
                <div className="d-flex align-items-center bg-light border-start px-3 h-100 py-3">
                    <div className="input-group input-group-sm bg-white rounded border-0 shadow-none px-2 py-1" style={{ width: '250px' }}>
                        <span className="input-group-text bg-transparent border-0"><i className="fi fi-rr-search"></i></span>
                        <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Search tasks..." />
                    </div>
                </div>
            </div>

            <div className="row">
                {columns.map((col, i) => (
                    <TaskColumn key={i} {...col} />
                ))}
            </div>
        </>
    )
}
