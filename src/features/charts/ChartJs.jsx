import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ChartJs() {
    const companyPayChartRef = useRef(null);
    const employeeTypeChartRef = useRef(null);
    const performanceAnalysisChartRef = useRef(null);
    const barChartRef = useRef(null);
    const lineChartRef = useRef(null);

    useEffect(() => {
        if (!window.Chart) return;

        const charts = [];

        // 1. Company Pay Chart (Doughnut with Center Text)
        const companyPayCtx = companyPayChartRef.current.getContext('2d');
        const companyPayChart = new window.Chart(companyPayCtx, {
            type: 'doughnut',
            data: {
                labels: ['Salary', 'Bonus', 'Commission', 'Overtime', 'Reimbursement', 'Benefits'],
                datasets: [{
                    data: [600, 643, 1608, 884, 2251, 1447],
                    backgroundColor: ['#FF401C', '#22B07E', '#02B4FA', '#FF8110', '#316AFF', '#FDBB1F'],
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                cutout: '85%',
                plugins: { legend: { display: false } }
            },
            plugins: [{
                id: 'centerTextPlugin',
                afterDraw(chart) {
                    const { ctx, chartArea: { left, right, top, bottom } } = chart;
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;
                    const dataset = chart.data.datasets[0];
                    const total = dataset.data.reduce((acc, val) => acc + val, 0);
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = 'bold 26px sans-serif';
                    ctx.fillStyle = '#000';
                    ctx.fillText(total, centerX, centerY - 8);
                    ctx.font = '14px sans-serif';
                    ctx.fillStyle = '#666';
                    ctx.fillText('Total Data', centerX, centerY + 14);
                    ctx.restore();
                }
            }]
        });
        charts.push(companyPayChart);

        // 2. Employee Type Chart
        const employeeTypeCtx = employeeTypeChartRef.current.getContext('2d');
        const employeeTypeChart = new window.Chart(employeeTypeCtx, {
            type: 'doughnut',
            data: {
                labels: ['Onsite', 'Remote', 'Hybrid'],
                datasets: [{
                    data: [600, 200, 200],
                    backgroundColor: ['#316AFF', '#FF8110', '#FDBB1F'],
                    borderRadius: 10,
                    borderWidth: 5,
                    borderColor: '#fff'
                }]
            },
            options: {
                cutout: '65%',
                plugins: { legend: { display: false } }
            }
        });
        charts.push(employeeTypeChart);

        // 3. Performance Analysis (Radar)
        const performanceCtx = performanceAnalysisChartRef.current.getContext('2d');
        const performanceChart = new window.Chart(performanceCtx, {
            type: 'radar',
            data: {
                labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Design'],
                datasets: [{
                    label: 'Product A',
                    data: [65, 59, 90, 81, 56, 55],
                    fill: true,
                    backgroundColor: 'rgba(13, 110, 253, 0.15)',
                    borderColor: 'rgba(13, 110, 253, 1)'
                }, {
                    label: 'Product B',
                    data: [28, 48, 40, 19, 96, 27],
                    fill: true,
                    backgroundColor: 'rgba(25, 135, 84, 0.15)',
                    borderColor: 'rgba(25, 135, 84, 1)'
                }]
            },
            options: { maintainAspectRatio: false }
        });
        charts.push(performanceChart);

        // 4. Bar Chart
        const barCtx = barChartRef.current.getContext('2d');
        const barChart = new window.Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: 'data-1',
                    data: [12, 19, 3, 17, 28, 24, 7],
                    backgroundColor: 'rgba(13, 110, 253, 1)'
                }, {
                    label: 'data-2',
                    data: [30, 29, 5, 5, 20, 3, 10],
                    backgroundColor: 'rgba(108, 117, 125, 1)'
                }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
        charts.push(barChart);

        // 5. Line Chart
        const lineCtx = lineChartRef.current.getContext('2d');
        const lineChart = new window.Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [{
                    label: 'Dataset 1',
                    data: [30, 50, 40, 60, 35, 70, 55],
                    borderColor: 'rgba(13, 110, 253, 1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Dataset 2',
                    data: [20, 35, 45, 30, 60, 40, 65],
                    borderColor: 'rgba(108, 117, 125, 1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { maintainAspectRatio: false }
        });
        charts.push(lineChart);

        return () => {
            charts.forEach(c => c.destroy());
        };
    }, []);

    return (
        <>
            <div className="app-page-head">
                <h1 className="app-page-title">ChartJs</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">ChartJs</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Company Pay</h6>
                        </div>
                        <div className="card-body">
                            <canvas ref={companyPayChartRef} height="300"></canvas>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Employee Type</h6>
                        </div>
                        <div className="card-body">
                            <canvas ref={employeeTypeChartRef} height="300"></canvas>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12 mb-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Performance Analysis</h6>
                        </div>
                        <div className="card-body" style={{ height: '400px' }}>
                            <canvas ref={performanceAnalysisChartRef}></canvas>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Bar Chart</h6>
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Line Chart</h6>
                        </div>
                        <div className="card-body" style={{ height: '300px' }}>
                            <canvas ref={lineChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
