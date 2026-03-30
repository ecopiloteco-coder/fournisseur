import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Ecommerce() {
    useEffect(() => {
        if (!window.ApexCharts) return;

        // 1. Status Chart (RadialBar)
        const statusChartInit = new window.ApexCharts(document.querySelector("#statusChart"), {
            series: [70],
            chart: { type: 'radialBar', height: 350, sparkline: { enabled: true } },
            plotOptions: {
                radialBar: {
                    startAngle: -90, endAngle: 90,
                    track: { background: "var(--bs-light)", strokeWidth: '100%', margin: 25 },
                    dataLabels: {
                        name: { show: false },
                        value: { show: true, offsetY: -50, fontSize: '30px', fontWeight: 800, color: 'var(--bs-dark)' }
                    }
                }
            },
            fill: { colors: ['var(--bs-primary)'] }
        });
        statusChartInit.render();

        // 2. Total Revenue Chart (Bar)
        const totalRevenueChartInit = new window.ApexCharts(document.querySelector("#totalRevenueChart"), {
            series: [{ data: [4, 6, 3, 7, 5, 10, 4, 8, 3, 6, 5] }],
            chart: { type: 'bar', height: 65, sparkline: { enabled: true } },
            plotOptions: { bar: { columnWidth: '40%', borderRadius: 2, distributed: true } },
            colors: ['#e6e6e6']
        });
        totalRevenueChartInit.render();

        // 3. Summary Chart (Line)
        const summeryChartInit = new window.ApexCharts(document.querySelector("#summeryChart"), {
            series: [
                { name: "Order", data: [300000, 80000, 300000, 300000, 290000, 210000, 350000, 500000, 380000] },
                { name: 'Income Growth', data: [0, 200000, 350000, 180000, 190000, 400000, 400000, 280000, 220000] }
            ],
            chart: { height: 325, type: 'line', toolbar: { show: false } },
            colors: ["var(--bs-secondary)", "var(--bs-primary)"],
            stroke: { width: [2, 2], curve: 'smooth', dashArray: [8, 0] },
            yaxis: {
                labels: { formatter: (val) => (val / 1000) + "K" }
            },
            xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep'] }
        });
        summeryChartInit.render();

        // 4. Traffic Sources Chart (Chart.js)
        let trafficChart = null;
        if (window.Chart) {
            const ctx = document.getElementById('trafficSourcesChart').getContext('2d');
            trafficChart = new window.Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Direct', 'Google', 'Social Media', 'Referral', 'Campaigns'],
                    datasets: [{
                        data: [800, 700, 500, 600, 600],
                        backgroundColor: ['#FD6A03', '#FE974F', '#FEB07A', '#FFCBA7', '#FFE9D9'],
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
        }

        // 5. DataTables
        let dtOrders = null;
        if (window.$ && window.$.fn.DataTable) {
            dtOrders = window.$('#dt_RecentOrders').DataTable({
                searching: true,
                pageLength: 6,
                lengthChange: false,
                info: true,
                paging: true
            });
        }

        return () => {
            statusChartInit.destroy();
            totalRevenueChartInit.destroy();
            summeryChartInit.destroy();
            if (trafficChart) trafficChart.destroy();
            if (dtOrders) dtOrders.destroy();
        };
    }, []);

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between">
                <div>
                    <h1 className="app-page-title">Dashboard</h1>
                    <span>Mon, Aug 01, 2024 - Sep 01, 2024</span>
                </div>
                <button className="btn btn-primary">
                    <i className="fi fi-rr-plus me-1"></i> Add Product
                </button>
            </div>

            <div className="row">
                <div className="col-xxl-8">
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className="card">
                                <div className="card-header border-0 pb-0 d-flex justify-content-between">
                                    <div>
                                        <h2 className="fw-bold mb-0">$45,250</h2>
                                        <span>Total Revenue</span>
                                    </div>
                                    <span className="badge bg-danger-subtle text-danger">-2%</span>
                                </div>
                                <div className="card-body">
                                    <div id="totalRevenueChart"></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="card">
                                <div className="card-header border-0 pb-0 d-flex justify-content-between">
                                    <div>
                                        <h2 className="fw-bold mb-0">1206</h2>
                                        <span>Order This Month</span>
                                    </div>
                                    <span className="badge bg-success-subtle text-success">+5%</span>
                                </div>
                                <div className="card-body pt-4">
                                    <div className="progress progress-sm" style={{ height: '6px' }}>
                                        <div className="progress-bar" style={{ width: '70%' }}></div>
                                    </div>
                                    <small className="mt-2 d-block">70% to Goal</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12">
                            <div className="card h-100">
                                <div className="card-header border-0 pb-0">
                                    <h2 className="fw-bold mb-0">2.5k</h2>
                                    <span>New Customers</span>
                                </div>
                                <div className="card-body">
                                    <div className="avatar-group d-flex">
                                        <div className="avatar avatar-sm rounded-circle bg-primary text-white">A</div>
                                        <div className="avatar avatar-sm rounded-circle bg-secondary text-white">B</div>
                                        <div className="avatar avatar-sm rounded-circle bg-info text-white">C</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xxl-4">
                    <div className="card bg-success bg-opacity-10 border-0 h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h2 className="fw-bold mb-0">2,756</h2>
                                <span className="text-success text-opacity-75">Products in Stock</span>
                            </div>
                            <button className="btn btn-sm btn-white mt-3 w-fit">View All Stock</button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8 mb-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Summary</h6>
                        </div>
                        <div className="card-body">
                            <div id="summeryChart"></div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Traffic Sources</h6>
                        </div>
                        <div className="card-body">
                            <canvas id="trafficSourcesChart" height="250"></canvas>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card-header border-0 pb-0">
                            <h6 className="card-title">Recent Orders</h6>
                        </div>
                        <div className="card-body">
                            <table id="dt_RecentOrders" className="table nowrap">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Order ID</th>
                                        <th>QTY</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Smart Home Kit</td>
                                        <td>#257896</td>
                                        <td>x2</td>
                                        <td>$58.00</td>
                                        <td>$145.50</td>
                                        <td><span className="badge bg-success">Confirmed</span></td>
                                    </tr>
                                    <tr>
                                        <td>Wooden Office Chair</td>
                                        <td>#257897</td>
                                        <td>x1</td>
                                        <td>$120.00</td>
                                        <td>$120.00</td>
                                        <td><span className="badge bg-info">Shipped</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Panel for Status Chart */}
            <div className="offcanvas offcanvas-end" id="sidebarPanel" tabIndex="-1">
                <div className="offcanvas-body">
                    <h6 className="card-title">Monthly Target</h6>
                    <div id="statusChart"></div>
                </div>
            </div>
        </>
    );
}
