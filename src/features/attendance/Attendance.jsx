import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Attendance() {
    useEffect(() => {
        // Re-initialize charts if global scripts are loaded
        if (window.ApexCharts) {
            // Attendance Rate Chart
            const optionsRate = {
                series: [{
                    name: 'Attendance Rate',
                    data: [80, 85, 90, 88, 92, 95, 93, 89, 91, 94, 96, 98]
                }],
                chart: {
                    height: 350,
                    type: 'area',
                    toolbar: { show: false }
                },
                dataLabels: { enabled: false },
                stroke: { curve: 'smooth', width: 2 },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                colors: ['#007bff']
            }
            const chartRate = new window.ApexCharts(document.querySelector("#chartAttendanceRate"), optionsRate)
            chartRate.render()

            return () => {
                chartRate.destroy()
            }
        }
    }, [])

    useEffect(() => {
        if (window.Chart) {
            const ctx = document.getElementById('employeeTypeChart')
            const myChart = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Onsite', 'Remote', 'Hybrid'],
                    datasets: [{
                        data: [800, 105, 301],
                        backgroundColor: ['#007bff', '#6c757d', '#17a2b8'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '80%',
                    plugins: {
                        legend: { display: false }
                    }
                }
            })
            return () => myChart.destroy()
        }
    }, [])

    const attendanceData = [
        { name: 'James Anderson', avatar: '1', attendance: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], leave: '5 Day' },
        { name: 'William Johnson', avatar: '2', attendance: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], leave: '3 Day' },
        { name: 'Benjamin Martinez', avatar: '3', attendance: [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], leave: '12 Day' },
        { name: 'Michael Davis', avatar: '4', attendance: [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], leave: '7 Day' },
        { name: 'Matthew Taylor', avatar: '5', attendance: [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], leave: '2 Day' },
        { name: 'David Wilson', avatar: '1', attendance: [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], leave: '4 Day' }
    ]

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Today, 01 July 2024</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Attendance</li>
                        </ol>
                    </nav>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light">
                    <i className="fi fi-rr-plus me-1"></i> Add Employee
                </button>
            </div>

            <div className="row g-3">
                <div className="col-xxl-9 col-lg-8">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between border-0 pb-0">
                            <h6 className="card-title mb-0">Attendance Rate</h6>
                            <button className="btn btn-sm btn-outline-light waves-effect">Download Report</button>
                        </div>
                        <div className="card-body px-1 py-2">
                            <div id="chartAttendanceRate"></div>
                        </div>
                    </div>
                </div>

                <div className="col-xxl-3 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header d-flex align-items-center justify-content-between border-0 pb-0">
                            <h6 className="card-title mb-0">Employee Type</h6>
                            <div className="dropdown">
                                <button className="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i className="fi fi-rr-menu-dots"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><a className="dropdown-item" href="#">Onsite</a></li>
                                    <li><a className="dropdown-item" href="#">Remote</a></li>
                                    <li><a className="dropdown-item" href="#">Hybrid</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-body py-0 px-3 d-flex align-items-center justify-content-center">
                            <div className="maxw-200px ratio ratio-1x1 position-relative">
                                <canvas id="employeeTypeChart"></canvas>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                    <h4 className="mb-0">1,206</h4>
                                    <small className="text-muted">Total</small>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer pt-0 border-0 mt-3">
                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                <div className="d-flex gap-1 align-items-center mx-1 small">
                                    <i className="fa fa-circle text-primary"></i>
                                    <strong>800</strong> Onsite
                                </div>
                                <div className="d-flex gap-1 align-items-center mx-1 small">
                                    <i className="fa fa-circle text-secondary"></i>
                                    <strong>105</strong> Remote
                                </div>
                                <div className="d-flex gap-1 align-items-center mx-1 small">
                                    <i className="fa fa-circle text-info"></i>
                                    <strong>301</strong> Hybrid
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-12">
                    <div className="card overflow-hidden">
                        <div className="card-header d-flex gap-3 flex-wrap align-items-center justify-content-between border-0 pb-0 mb-3">
                            <h6 className="card-title mb-0">Employee Attendance</h6>
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
                                <table className="table table-sm display table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3 minw-200px">Employee Name</th>
                                            {[...Array(31)].map((_, i) => <th key={i}>{i + 1}</th>)}
                                            <th className="pe-3">Leave</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceData.map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-xs rounded-circle">
                                                            <img src={`/assets/images/avatar/avatar${row.avatar}.webp`} alt="" />
                                                        </div>
                                                        <div className="ms-2">
                                                            <h6 className="mb-0 small">{row.name}</h6>
                                                        </div>
                                                    </div>
                                                </td>
                                                {row.attendance.map((att, i) => (
                                                    <td key={i}>
                                                        {att ? (
                                                            <i className="fi fi-rr-check-circle text-primary text-xs"></i>
                                                        ) : (
                                                            <i className="fi fi-rr-circle-xmark text-danger text-xs"></i>
                                                        )}
                                                    </td>
                                                ))}
                                                <td className="pe-3">
                                                    <span className="text-danger small">{row.leave}</span>
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
        </>
    )
}
