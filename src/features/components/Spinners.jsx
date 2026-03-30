export default function Spinners() {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Spinners</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Spinners</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Border Spinner</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-4">
                                {colors.map(color => (
                                    <div key={color} className={`spinner-border text-${color}`} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Growing Spinner</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-4">
                                {colors.map(color => (
                                    <div key={color} className={`spinner-grow text-${color}`} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Sizes</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-4">
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                <div className="spinner-grow spinner-grow-sm" role="status"></div>
                                <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                                <div className="spinner-grow" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Buttons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-3">
                                <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Loading...
                                </button>
                                <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-grow spinner-grow-sm me-2" role="status"></span>
                                    Loading...
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
