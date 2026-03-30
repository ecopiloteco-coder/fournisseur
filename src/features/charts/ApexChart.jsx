import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ApexChart() {
    const chartEmployeeRef = useRef(null);
    const chartAttendanceRateRef = useRef(null);
    const chartPayrollSummaryRef = useRef(null);
    const averageTeamKPIRef = useRef(null);
    const chartDailySalesStatesRef = useRef(null);
    const chartStocksPricesRef = useRef(null);

    useEffect(() => {
        if (!window.ApexCharts) return;

        // Common theme helper
        const getVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        // 1. Employee Structure
        const chartEmployee = new window.ApexCharts(chartEmployeeRef.current, {
            series: [
                { name: 'Net Profit', data: [390, 115, 305, 250, 102, 40, 195, 235, 280] },
                { name: 'Revenue', data: [105, 205, 120, 380, 105, 205, 290, 310, 105] },
                { name: 'Free Cash Flow', data: [180, 200, 180, 250, 100, 400, 90, 115, 195] }
            ],
            colors: ['var(--bs-primary)', 'var(--bs-secondary)', 'var(--bs-info)'],
            chart: { type: 'bar', height: 320, toolbar: { show: false } },
            plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 3 } },
            dataLabels: { enabled: false },
            stroke: { show: true, width: 2, colors: ['transparent'] },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                axisBorder: { color: 'var(--bs-border-color)' },
                labels: { style: { colors: 'var(--bs-body-color)', fontSize: '13px' } }
            },
            yaxis: { tickAmount: 5, labels: { style: { colors: 'var(--bs-body-color)', fontSize: '13px' } } },
            grid: { borderColor: 'var(--bs-border-color)', strokeDashArray: 5 },
            legend: { show: true, position: 'bottom' }
        });
        chartEmployee.render();

        // 2. Attendance Rate
        const chartAttendanceRate = new window.ApexCharts(chartAttendanceRateRef.current, {
            series: [
                { name: 'One Time', data: [35, 55, 41, 67, 22, 43, 21, 49, 49, 49, 49, 49] },
                { name: 'Late', data: [13, 23, 20, 8, 13, 27, 33, 12, 12, 12, 12, 12] },
                { name: 'Absent', data: [11, 17, 15, 15, 21, 14, 15, 13, 13, 13, 13, 13] }
            ],
            colors: ['var(--bs-primary)', 'var(--bs-secondary)', 'var(--bs-gray)'],
            chart: { type: 'bar', height: 320, stacked: true, stackType: '100%', toolbar: { show: false } },
            plotOptions: { bar: { horizontal: false, columnWidth: '25%', borderRadius: 6 } },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
            dataLabels: { enabled: false },
            legend: { show: true, position: 'bottom' }
        });
        chartAttendanceRate.render();

        // 3. Payroll Summary
        const chartPayrollSummary = new window.ApexCharts(chartPayrollSummaryRef.current, {
            series: [
                { name: "Gross Salary", data: [55000, 60000, 68000, 52000, 69000, 73000, 71000, 74000, 70000, 75000, 72000, 77000] },
                { name: "Net Salary", data: [25000, 27000, 16000, 15500, 16500, 17200, 15800, 17000, 16200, 16800, 16000, 17500] },
                { name: "Tax Dedication", type: 'line', data: [25000, 50000, 40000, 20000, 52500, 45000, 55200, 47000, 25800, 58200, 36000, 59500] }
            ],
            colors: ["var(--bs-secondary)", "var(--bs-primary)", "var(--bs-info)"],
            chart: { type: 'bar', height: 320, stacked: true, toolbar: { show: false } },
            stroke: { curve: 'straight', width: [0, 0, 2.5] },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
            legend: { show: true, position: 'bottom' }
        });
        chartPayrollSummary.render();

        // 4. Average Team KPI
        const averageTeamKPI = new window.ApexCharts(averageTeamKPIRef.current, {
            series: [{ data: [300, 200, 190, 100, 250, 300, 350, 500] }],
            chart: { height: 320, type: 'area', toolbar: { show: false } },
            colors: ["var(--bs-secondary)"],
            stroke: { curve: 'smooth', width: 2 },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.2, opacityTo: 0 } }
        });
        averageTeamKPI.render();

        // 5. Daily Sales States (Heatmap)
        const generateDayData = (day) => {
            return {
                name: day,
                data: Array.from({ length: 24 }, (_, i) => ({ x: `${i}:00`, y: Math.floor(Math.random() * 60) }))
            };
        };
        const chartDailySalesStates = new window.ApexCharts(chartDailySalesStatesRef.current, {
            series: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(generateDayData),
            chart: { height: 320, type: 'heatmap', toolbar: { show: false } },
            plotOptions: { heatmap: { radius: 3, colorScale: { ranges: [{ from: 0, to: 15, color: "#EFF3FF" }, { from: 16, to: 30, color: "#84A6FF" }, { from: 31, to: 45, color: "#5987FF" }] } } }
        });
        chartDailySalesStates.render();

        // 6. Stocks Prices (Candlestick)
        const chartStocksPrices = new window.ApexCharts(chartStocksPricesRef.current, {
            series: [{
                data: [
                    { x: new Date(1538778600000), y: [6629.81, 6650.5, 6623.04, 6633.33] },
                    { x: new Date(1538780400000), y: [6632.01, 6643.59, 6620, 6630.11] },
                    { x: new Date(1538782200000), y: [6630.71, 6648.95, 6623.34, 6635.65] },
                    { x: new Date(1538784000000), y: [6635.65, 6651, 6629.67, 6638.24] }
                ]
            }],
            chart: { type: 'candlestick', height: 320, toolbar: { show: false } },
            xaxis: { type: 'datetime' }
        });
        chartStocksPrices.render();

        return () => {
            chartEmployee.destroy();
            chartAttendanceRate.destroy();
            chartPayrollSummary.destroy();
            averageTeamKPI.destroy();
            chartDailySalesStates.destroy();
            chartStocksPrices.destroy();
        };
    }, []);

    return (
        <>
            <div className="app-page-head">
                <h1 className="app-page-title">Apexchart</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Apexchart</li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Employee Structure</h6>
                        </div>
                        <div className="card-body p-2">
                            <div ref={chartEmployeeRef}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Attendance Rate</h6>
                        </div>
                        <div className="card-body p-2">
                            <div ref={chartAttendanceRateRef}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Payroll Summary</h6>
                        </div>
                        <div className="card-body p-2">
                            <div ref={chartPayrollSummaryRef}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Average Team KPI</h6>
                        </div>
                        <div className="card-body p-2">
                            <div ref={averageTeamKPIRef}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Daily Sales States</h6>
                        </div>
                        <div className="card-body p-2 pb-0">
                            <div ref={chartDailySalesStatesRef}></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Stocks Prices</h6>
                        </div>
                        <div className="card-body p-2 pb-0">
                            <div ref={chartStocksPricesRef}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
