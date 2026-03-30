export default function Badge() {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Badge</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Badge</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Background Colors</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {colors.map(color => (
                                    <span key={color} className={`badge text-bg-${color}`}>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Pill Badges</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {colors.map(color => (
                                    <span key={color} className={`badge rounded-pill text-bg-${color}`}>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Subtle Badges</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {colors.map(color => (
                                    <span key={color} className={`badge bg-${color}-subtle text-${color}`}>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
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
                            <span className="badge badge-sm text-bg-primary me-1">Small</span>
                            <span className="badge text-bg-secondary me-1">Default</span>
                            <span className="badge badge-lg text-bg-success me-1">Large</span>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Positioned</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-4">
                                <button type="button" className="btn btn-primary position-relative">
                                    Inbox
                                    <span className="position-absolute top-0 start-100 translate-middle badge badge-sm rounded-pill bg-danger">
                                        99+
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </button>
                                <button type="button" className="btn btn-primary position-relative">
                                    Profile
                                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Badge with Avatar</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                <span className="badge d-inline-flex align-items-center p-1 pe-2 text-primary bg-primary-subtle border border-primary-subtle rounded-pill">
                                    <img className="rounded-circle me-1" width="24" height="24" src="/assets/images/avatar/avatar1.webp" alt="" />Primary
                                </span>
                                <span className="badge d-inline-flex align-items-center p-1 pe-2 text-success bg-success-subtle border border-success-subtle rounded-pill">
                                    <img className="rounded-circle me-1" width="24" height="24" src="/assets/images/avatar/avatar2.webp" alt="" />Success
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
