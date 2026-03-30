import { useEffect } from 'react'

export default function Payroll() {
    useEffect(() => {
        if (window.ApexCharts) {
            // Payroll Summary Chart
            const optionsSummary = {
                series: [{
                    name: 'Net Salary',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 63, 67, 65]
                }, {
                    name: 'Gross Salary',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 102, 107, 110]
                }],
                chart: {
                    type: 'bar',
                    height: 350,
                    toolbar: { show: false }
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: { enabled: false },
                stroke: { show: true, width: 2, colors: ['transparent'] },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                },
                fill: { opacity: 1 },
                colors: ['#007bff', '#6c757d']
            }
            const chartSummary = new window.ApexCharts(document.querySelector("#chartPayrollSummary"), optionsSummary)
            chartSummary.render()

            return () => chartSummary.destroy()
        }
    }, [])

    useEffect(() => {
        if (window.Chart) {
            const ctx = document.getElementById('companyPayChart')
            const myChart = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Basic Pay', 'Bonus', 'Allowance', 'Deduction'],
                    datasets: [{
                        data: [65, 15, 12, 8],
                        backgroundColor: ['#007bff', '#28a745', '#17a2b8', '#dc3545'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '80%',
                    plugins: { legend: { display: false } }
                }
            })
            return () => myChart.destroy()
        }
    }, [])

    const payrolls = [
        { name: 'James Anderson', id: '#EMP01', salary: '$5,000', bonus: '$500', allowance: '$200', deduction: '$100', net: '$5,600', status: 'Paid' },
        { name: 'William Johnson', id: '#EMP02', salary: '$4,500', bonus: '$300', allowance: '$150', deduction: '$50', net: '$4,900', status: 'Pending' },
        { name: 'Benjamin Martinez', id: '#EMP03', salary: '$6,000', bonus: '$1,000', allowance: '$300', deduction: '$200', net: '$7,100', status: 'Paid' }
    ]

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Payroll</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Payroll</li>
                        </ol>
                    </nav>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light">
                    <i className="fi fi-rr-plus me-1"></i> Create Payroll
                </button>
            </div>

            <div className="row g-3">
                <div className="col-xxl-9 col-lg-8">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title mb-0">Payroll Summary</h6>
                        </div>
                        <div className="card-body">
                            <div id="chartPayrollSummary"></div>
                        </div>
                    </div>
                </div>

                <div className="col-xxl-3 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title mb-0">Company Pay Breakdowns</h6>
                        </div>
                        <div className="card-body py-0 px-3 d-flex align-items-center justify-content-center">
                            <div className="maxw-200px ratio ratio-1x1 position-relative">
                                <canvas id="companyPayChart"></canvas>
                                <div className="position-absolute top-50 start-50 translate-middle text-center">
                                    <h4 className="mb-0">$45,200</h4>
                                    <small className="text-muted">Total Pay</small>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer pt-0 border-0 mt-3">
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between align-items-center small">
                                    <span><i className="fa fa-circle text-primary me-2"></i>Basic Pay</span>
                                    <strong>$29,380</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center small">
                                    <span><i className="fa fa-circle text-success me-2"></i>Bonus</span>
                                    <strong>$6,780</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center small">
                                    <span><i className="fa fa-circle text-info me-2"></i>Allowance</span>
                                    <strong>$5,424</strong>
                                </div>
                                <div className="d-flex justify-content-between align-items-center small text-danger">
                                    <span><i className="fa fa-circle text-danger me-2"></i>Deductions</span>
                                    <strong>$3,616</strong>
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
                            <h6 className="card-title mb-0">Payroll List</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                <input type="text" className="form-control form-control-sm w-auto" placeholder="Search..." />
                                <button type="button" class="btn btn-sm btn-outline-light waves-effect">Download Report</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3">Employee</th>
                                            <th>ID</th>
                                            <th>Salary</th>
                                            <th>Bonus</th>
                                            <th>Allowance</th>
                                            <th>Deduction</th>
                                            <th>Net Pay</th>
                                            <th>Status</th>
                                            <th className="pe-3 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrolls.map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-3 fw-medium">{row.name}</td>
                                                <td>{row.id}</td>
                                                <td>{row.salary}</td>
                                                <td>{row.bonus}</td>
                                                <td>{row.allowance}</td>
                                                <td className="text-danger">{row.deduction}</td>
                                                <td className="fw-bold">{row.net}</td>
                                                <td>
                                                    <span className={`badge subtle-${row.status === 'Paid' ? 'primary' : 'secondary'} px-2 py-1`}>{row.status}</span>
                                                </td>
                                                <td className="pe-3 text-end">
                                                    <button className="btn btn-white btn-sm btn-icon waves-effect"><i className="fi fi-rr-download"></i></button>
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
