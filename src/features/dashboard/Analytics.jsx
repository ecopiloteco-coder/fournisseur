import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Analytics() {
    const taskStatusRef = useRef(null)
    const teamKpiRef = useRef(null)
    const empTypeRef = useRef(null)
    const scoreRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

    useEffect(() => {
        if (window.ApexCharts) {
            // Task Status Chart
            const taskOptions = {
                series: [65.7],
                chart: { type: 'radialBar', height: 380, sparkline: { enabled: true } },
                plotOptions: {
                    radialBar: {
                        startAngle: -90, endAngle: 90,
                        track: { background: "#fff", strokeWidth: '100%', margin: 25 },
                        dataLabels: { name: { show: false }, value: { show: true, offsetY: -30, fontSize: '30px', fontWeight: 800 } }
                    }
                },
                fill: { colors: ['var(--bs-info)'] }
            }
            const taskChart = new window.ApexCharts(taskStatusRef.current, taskOptions)
            taskChart.render()

            // Average Team KPI
            const kpiOptions = {
                series: [{ data: [300, 200, 190, 100, 250, 300, 350, 500] }],
                chart: { height: 280, type: 'area', toolbar: { show: false } },
                colors: ["var(--bs-secondary)"],
                stroke: { curve: 'smooth', width: 2 },
                xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] }
            }
            const kpiChart = new window.ApexCharts(teamKpiRef.current, kpiOptions)
            kpiChart.render()

            // Employee Scores
            const scoreColors = ['var(--bs-primary)', 'var(--bs-danger)', 'var(--bs-warning)', 'var(--bs-secondary)']
            const scoreValues = [83, 37, 46, 64]
            const scoreCharts = []

            scoreRefs.forEach((ref, i) => {
                if (ref.current) {
                    const options = {
                        series: [scoreValues[i]],
                        chart: { type: 'radialBar', height: 60, width: 60, sparkline: { enabled: true } },
                        plotOptions: {
                            radialBar: {
                                hollow: { margin: 0, size: '80%' },
                                track: { background: `rgba(${scoreColors[i].includes('primary') ? 'var(--bs-primary-rgb)' : '108, 117, 125'}, 0.1)`, strokeWidth: '100%', margin: -2 },
                                dataLabels: { show: true, name: { show: false }, value: { fontSize: '14px', fontWeight: '500', show: true, offsetY: 5 } }
                            },
                        },
                        colors: [scoreColors[i]]
                    }
                    const chart = new window.ApexCharts(ref.current, options)
                    chart.render()
                    scoreCharts.push(chart)
                }
            })

            return () => {
                taskChart.destroy()
                kpiChart.destroy()
                scoreCharts.forEach(c => c.destroy())
            }
        }
    }, [])

    useEffect(() => {
        if (window.Chart && empTypeRef.current) {
            const ctx = empTypeRef.current.getContext('2d')
            const chart = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Onsite', 'Remote', 'Hybrid'],
                    datasets: [{
                        data: [800, 105, 301],
                        backgroundColor: ['#316AFF', '#6c757d', '#0dcaf0'],
                        borderWidth: 0
                    }]
                },
                options: { cutout: '80%', plugins: { legend: { display: false } } }
            })
            return () => chart.destroy()
        }
    }, [])

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Analytics</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Analytics</li>
                        </ol>
                    </nav>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">
                    <i className="fi fi-rr-plus me-1"></i> Add Employee
                </button>
            </div>

            <div className="row g-3">
                <div className="col-xl-6">
                    <div className="card bg-warning bg-opacity-25 shadow-none border-0">
                        <div className="card-body px-4 pb-0 pt-2">
                            <div className="row g-0">
                                <div className="col-sm-7 py-3 px-2">
                                    <h6 className="card-title fw-bold mb-2">Employee Satisfied</h6>
                                    <h2 className="text-secondary fs-1 fw-bolder mb-3">95.27%</h2>
                                    <p className="text-dark fw-semibold mb-0">There are currently <strong className="text-primary">1,204 employees</strong> who are satisfied.</p>
                                </div>
                                <div className="col-sm-5 text-center text-sm-end align-self-end">
                                    <img src="/assets/images/media/svg/media2.svg" className="img-fluid" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-6">
                    <div className="card bg-info bg-opacity-25 shadow-none border-0">
                        <div className="card-body px-4 py-2">
                            <div className="row g-0 align-items-center">
                                <div className="col-md-5 py-3 px-2">
                                    <h6 className="card-title fw-bold mb-2">Task Status</h6>
                                    <p className="text-dark mb-4"><strong className="text-info">90%</strong> of work completed last week.</p>
                                    <a href="/task-management" className="btn btn-info waves-effect waves-light">Add Task</a>
                                </div>
                                <div className="col-md-7 text-center">
                                    <div ref={taskStatusRef}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-1">
                <div className="col-xxl-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">Average Team KPI</div>
                        <div className="card-body">
                            <div ref={teamKpiRef}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">Employee Type</div>
                        <div className="card-body d-flex flex-column align-items-center">
                            <div style={{ width: '200px' }}>
                                <canvas ref={empTypeRef}></canvas>
                            </div>
                            <div className="d-flex flex-wrap gap-2 justify-content-center mt-3">
                                <small><i className="fa fa-circle text-primary me-1"></i>800 Onsite</small>
                                <small><i className="fa fa-circle text-secondary me-1"></i>105 Remote</small>
                                <small><i className="fa fa-circle text-info me-1"></i>301 Hybrid</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">Team</div>
                        <div className="card-body">
                            {['Marketing', 'Development', 'Designing', 'Management'].map((team, i) => (
                                <div key={i} className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h6 className="mb-0">{team}</h6>
                                        <small className="text-muted">Member {i + 5}</small>
                                    </div>
                                    <div className="avatar-group">
                                        {[1, 2, 3].map(av => (
                                            <div key={av} className="avatar avatar-xs rounded-circle border border-2 border-white">
                                                <img src={`/assets/images/avatar/avatar${av}.webp`} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-1">
                <div className="col-xxl-5">
                    <div className="card">
                        <div className="card-header border-0 pb-0">Employee Performance</div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0">
                                    <tbody>
                                        {['Olivia Clark', 'Michael Davis', 'James Wilson', 'Sopia'].map((name, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar rounded-circle me-2">
                                                            <img src={`/assets/images/avatar/avatar${i + 1}.webp`} alt="" />
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-0">{name}</h6>
                                                            <small className="text-muted">Developer</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><div ref={scoreRefs[i]}></div></td>
                                                <td className="text-end pe-3">
                                                    <i className="fi fi-rr-menu-dots text-muted"></i>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">Recent Job Application</div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {['Sophia Hall', 'Emma Smith', 'Olivia Clark', 'Ava Lewis'].map((name, i) => (
                                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                        <div className="d-flex align-items-center">
                                            <div className="avatar rounded-circle me-2">
                                                <img src={`/assets/images/avatar/avatar${i + 1}.webp`} alt="" />
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{name}</h6>
                                                <small className="text-muted">Front-End Developer</small>
                                            </div>
                                        </div>
                                        <span className="badge bg-light text-dark">Pending</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                    <div className="card">
                        <div className="card-header border-0 pb-0">Upcoming Meetings</div>
                        <div className="card-body" style={{ height: '350px', overflowY: 'auto' }}>
                            {['Team Stand Up', 'Sprint Planning', 'All Hands Meet'].map((title, i) => (
                                <div key={i} className="p-3 bg-light bg-opacity-50 mb-2 rounded">
                                    <h6 className="mb-1">{title}</h6>
                                    <small className="d-block text-muted mb-2"><i className="fi fi-rr-clock me-1"></i> 10:00 - 11:00 AM</small>
                                    <span className="badge bg-white text-primary">Marketing</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
