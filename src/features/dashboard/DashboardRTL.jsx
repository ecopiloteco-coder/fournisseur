import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function DashboardRTL() {
    const chartEmployeeRef = useRef(null)
    const companyPayRef = useRef(null)

    useEffect(() => {
        if (window.ApexCharts) {
            const options = {
                series: [{
                    name: 'موظفون جدد',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
                }, {
                    name: 'مستقيل',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
                }],
                chart: { type: 'bar', height: 350, toolbar: { show: false } },
                plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 5 } },
                dataLabels: { enabled: false },
                stroke: { show: true, width: 2, colors: ['transparent'] },
                xaxis: { categories: ['فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت'] },
                fill: { opacity: 1 },
                colors: ['var(--bs-primary)', 'var(--bs-secondary)']
            }
            const chart = new window.ApexCharts(chartEmployeeRef.current, options)
            chart.render()
            return () => chart.destroy()
        }
    }, [])

    useEffect(() => {
        if (window.Chart && companyPayRef.current) {
            const ctx = companyPayRef.current.getContext('2d')
            const chart = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['راتب', 'علاوة', 'عمولة', 'إضافي'],
                    datasets: [{
                        data: [15, 8, 20, 11],
                        backgroundColor: ['#dc3545', '#198754', '#0dcaf0', '#6c757d'],
                        borderWidth: 0
                    }]
                },
                options: { cutout: '80%', plugins: { legend: { display: false } } }
            })
            return () => chart.destroy()
        }
    }, [])

    return (
        <div dir="rtl">
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">لوحة القيادة</h1>
                    <span>الإثنين، 01 أغسطس 2024 - 01 سبتمبر 2024</span>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light">
                    <i className="fi fi-rr-plus me-1"></i> إضافة موظف
                </button>
            </div>

            <div className="row g-3 text-end">
                <div className="col-xxl-9">
                    <div className="row g-3">
                        {[
                            { color: 'secondary', icon: 'fi-sr-users', value: '1206', label: 'إجمالي الموظفين', up: true, pct: '5%' },
                            { color: 'info', icon: 'fi-sr-user-add', value: '218', label: 'موظف جديد', up: true, pct: '3.2%' },
                            { color: 'warning', icon: 'fi-sr-delete-user', value: '126', label: 'في إجازة', up: false, pct: '2%' },
                            { color: 'success', icon: 'fi-sr-shopping-bag', value: '776', label: 'المتقدمين', up: true, pct: '8%' },
                            { color: 'danger', icon: 'fi-sr-clock-three', value: '1017', label: 'وقت إضافي', up: false, pct: '8%' },
                        ].map((s, i) => (
                            <div key={i} className="col-6 col-md-4 col-lg">
                                <div className={`card bg-${s.color} bg-opacity-05 shadow-none border-0 h-100`}>
                                    <div className="card-body">
                                        <div className={`avatar bg-${s.color} shadow-${s.color} rounded-circle text-white mb-3 mx-auto`}>
                                            <i className={`fi ${s.icon}`}></i>
                                        </div>
                                        <h3>{s.value}</h3>
                                        <h6 className="mb-0">{s.label}</h6>
                                        <small className={`text-${s.up ? 'success' : 'danger'}`}>
                                            <i className={`fi fi-rr-arrow-small-${s.up ? 'up' : 'down'}`}></i> {s.pct}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-xxl-3">
                    <div className="card overflow-hidden h-100 position-relative">
                        <div className="card-body z-1">
                            <h6 className="card-title">إنشاء إعلان</h6>
                            <p className="small">قم بإنشاء إعلان لموظفيك</p>
                            <Link to="/calendar" className="btn btn-outline-light btn-sm waves-effect btn-shadow mt-2">إنشاء الآن</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mt-1 text-end">
                <div className="col-xxl-7 col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">هيكل الموظفين</div>
                        <div className="card-body">
                            <div ref={chartEmployeeRef}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-5 col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">دفع الشركة</div>
                        <div className="card-body d-flex align-items-center">
                            <div style={{ width: '180px' }}>
                                <canvas ref={companyPayRef}></canvas>
                            </div>
                            <div className="me-4 d-grid gap-2">
                                {['راتب', 'علاوة', 'عمولة', 'إضافي'].map((item, i) => (
                                    <small key={i}><i className={`fa fa-circle text-${['danger', 'success', 'info', 'secondary'][i]} me-1`}></i> {item}</small>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
