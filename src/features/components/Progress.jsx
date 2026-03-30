export default function Progress() {
    const backgrounds = ['success', 'info', 'warning', 'danger'];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Progress</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Progress</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Progress</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="progress mb-3" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar" style={{ width: '25%' }}></div>
                            </div>
                            <div className="progress mb-3" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar" style={{ width: '50%' }}></div>
                            </div>
                            <div className="progress mb-3" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar" style={{ width: '75%' }}></div>
                            </div>
                            <div className="progress" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                                <div className="progress-bar" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Backgrounds</h6>
                        </div>
                        <div className="card-body p-4">
                            {backgrounds.map((bg, idx) => (
                                <div key={bg} className={`progress ${idx < backgrounds.length - 1 ? 'mb-3' : ''}`} role="progressbar">
                                    <div className={`progress-bar bg-${bg}`} style={{ width: `${(idx + 1) * 25}%` }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Striped & Animated</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="progress mb-3" role="progressbar">
                                <div className="progress-bar progress-bar-striped" style={{ width: '25%' }}></div>
                            </div>
                            <div className="progress mb-3" role="progressbar">
                                <div className="progress-bar progress-bar-striped bg-success progress-bar-animated" style={{ width: '50%' }}></div>
                            </div>
                            <div className="progress" role="progressbar">
                                <div className="progress-bar progress-bar-striped bg-warning" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Labels & Stacked</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="progress mb-3" role="progressbar">
                                <div className="progress-bar" style={{ width: '25%' }}>25%</div>
                            </div>
                            <div className="progress-stacked">
                                <div className="progress" role="progressbar" style={{ width: '15%' }}>
                                    <div className="progress-bar"></div>
                                </div>
                                <div className="progress" role="progressbar" style={{ width: '30%' }}>
                                    <div className="progress-bar bg-success"></div>
                                </div>
                                <div className="progress" role="progressbar" style={{ width: '20%' }}>
                                    <div className="progress-bar bg-info"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
