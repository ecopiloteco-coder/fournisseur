import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Leave() {
    useEffect(() => {
        if (window.ApexCharts) {
            const commonOptions = {
                chart: { height: 100, width: 100, type: 'radialBar' },
                plotOptions: {
                    radialBar: {
                        hollow: { size: '30%' },
                        dataLabels: { show: false }
                    }
                },
                stroke: { lineCap: 'round' }
            }

            const charts = [
                { id: '#leavesPresentsScore', color: '#007bff', val: 98 },
                { id: '#leavesPlannedScore', color: '#dc3545', val: 10 },
                { id: '#leavesUnplannedScore', color: '#17a2b8', val: 1 },
                { id: '#leavesPendingScore', color: '#6c757d', val: 71 }
            ]

            const instances = charts.map(c => {
                const chart = new window.ApexCharts(document.querySelector(c.id), {
                    ...commonOptions,
                    series: [c.val],
                    colors: [c.color]
                })
                chart.render()
                return chart
            })

            return () => instances.forEach(i => i.destroy())
        }
    }, [])

    const leaves = [
        { name: 'James Anderson', avatar: '1', type: 'Casual Leave', dept: 'Back-End Developer', days: '2 Days', start: '12 July 2024', end: '15 July 2024', status: 'Approved', statusClass: 'subtle-primary' },
        { name: 'William Johnson', avatar: '2', type: 'Maternity Leave', dept: 'Full-Stack Developer', days: '1st Half Day', start: '03 July 2024', end: '04 July 2024', status: 'Approved', statusClass: 'subtle-primary' },
        { name: 'Benjamin Martinez', avatar: '3', type: 'Casual Leave', dept: 'Mobile App Developer', days: '4 Days', start: '27 July 2024', end: '31 July 2024', status: 'New', statusClass: 'subtle-success' },
        { name: 'Michael Davis', avatar: '4', type: 'Maternity Leave', dept: 'UI/UX Designer', days: '2nd Half Day', start: '05 June 2024', end: '04 June 2025', status: 'Pending', statusClass: 'outline-light' },
        { name: 'Matthew Taylor', avatar: '5', type: 'Paternity Leave', dept: 'DevOps Engineer', days: '1 Days', start: '04 Aug 2024', end: '05 Aug 2024', status: 'Rejected', statusClass: 'subtle-secondary' },
        { name: 'David Wilson', avatar: '1', type: 'Paternity Leave', dept: 'DevOps Engineer', days: '22 Days', start: '04 Aug 2024', end: '04 Aug 2024', status: 'Rejected', statusClass: 'subtle-secondary' }
    ]

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <div className="clearfix">
                    <h1 className="app-page-title">Leaves</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Leaves</li>
                        </ol>
                    </nav>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#addLeaveModal">
                    <i className="fi fi-rr-plus me-1"></i> Add Leave
                </button>
            </div>

            <div className="row g-3">
                {[
                    { id: 'leavesPresentsScore', value: '1192', total: '1206', label: 'Today Presents', color: 'primary' },
                    { id: 'leavesPlannedScore', value: '128', total: '1206', label: 'Planned Leaves', color: 'danger' },
                    { id: 'leavesUnplannedScore', value: '12', total: '1206', label: 'Unplanned Leaves', color: 'info' },
                    { id: 'leavesPendingScore', value: '50', total: '70', label: 'Pending Requests', color: 'secondary' }
                ].map((card, i) => (
                    <div key={i} className="col-xxl-3 col-md-6">
                        <div className={`card card-action action-border-${card.color}`}>
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <div className="ps-2">
                                    <div className="d-flex text-dark align-items-end gap-1 lh-1 mb-1">
                                        <span className="fs-2 fw-bold">{card.value}</span>
                                        <span className="mb-1 text-muted">/{card.total}</span>
                                    </div>
                                    <span className={`text-${card.color}`}>{card.label}</span>
                                </div>
                                <div id={card.id}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-4">
                <div className="col-lg-12">
                    <div className="card overflow-hidden">
                        <div className="card-header d-flex gap-3 flex-wrap align-items-center justify-content-between border-0 pb-0 mb-3">
                            <h6 className="card-title mb-0">Employee’s Leave</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                <input type="text" className="form-control form-control-sm w-auto" placeholder="Search..." />
                                <button type="button" className="btn btn-sm btn-outline-light waves-effect">Download Report</button>
                                <select className="form-select form-select-sm w-auto">
                                    <option>2024</option>
                                    <option>2023</option>
                                </select>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3 minw-200px">Name</th>
                                            <th className="minw-150px">Leave Type</th>
                                            <th className="minw-200px">Department</th>
                                            <th className="minw-100px text-center">Days</th>
                                            <th className="minw-150px">Start</th>
                                            <th className="minw-150px">End</th>
                                            <th className="minw-120px text-center">Status</th>
                                            <th className="pe-3 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.map((leave, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-xxs rounded-circle">
                                                            <img src={`/assets/images/avatar/avatar${leave.avatar}.webp`} alt="" />
                                                        </div>
                                                        <span className="ms-2 fw-medium">{leave.name}</span>
                                                    </div>
                                                </td>
                                                <td><span className="text-body">{leave.type}</span></td>
                                                <td>{leave.dept}</td>
                                                <td className="text-center">{leave.days}</td>
                                                <td>{leave.start}</td>
                                                <td>{leave.end}</td>
                                                <td className="text-center">
                                                    <span className={`badge bg-${leave.statusClass} px-2 py-1`}>{leave.status}</span>
                                                </td>
                                                <td className="pe-3 text-end">
                                                    <div className="dropdown">
                                                        <button className="btn btn-white btn-sm btn-icon waves-effect dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                            <i className="fi fi-rr-menu-dots text-muted"></i>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                            <li><a className="dropdown-item" href="#">Edit</a></li>
                                                            <li><a className="dropdown-item" href="#">Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Add Leave */}
            <div className="modal fade" id="addLeaveModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header py-3">
                            <h5 className="modal-title">Add Leave Request</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="employeeName" className="form-label">Employee Name</label>
                                    <input type="text" className="form-control" id="employeeName" placeholder="Enter employee name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="leaveType" className="form-label">Leave Type</label>
                                    <select className="form-select" id="leaveType">
                                        <option defaultValue disabled>Select leave type</option>
                                        <option>Casual Leave</option>
                                        <option>Sick Leave</option>
                                        <option>Earned Leave</option>
                                        <option>Maternity Leave</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="leaveDate" className="form-label">Select Date</label>
                                    <input type="date" id="leaveDate" className="form-control" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="leaveReason" className="form-label">Reason</label>
                                    <textarea className="form-control" id="leaveReason" rows="3" placeholder="Enter leave reason"></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-select">
                                        <option>Pending</option>
                                        <option>Approved</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn btn-success">Submit Leave</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
