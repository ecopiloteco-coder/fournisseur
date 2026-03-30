export default function Alerts() {
    const types = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Alerts</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Alerts</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Alerts</h6>
                        </div>
                        <div className="card-body p-4">
                            {types.map(type => (
                                <div key={type} className={`alert alert-${type}`} role="alert">
                                    A simple {type} alert—check it out!
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Dismissible Alerts</h6>
                        </div>
                        <div className="card-body p-4">
                            {types.map(type => (
                                <div key={type} className={`alert alert-${type} alert-dismissible fade show`} role="alert">
                                    A dismissible {type} alert—check it out!
                                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Alerts via Icons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="alert alert-primary d-flex align-items-center" role="alert">
                                <i className="fi fi-sr-star me-2"></i>
                                <div>A simple primary alert with icon</div>
                            </div>
                            <div className="alert alert-success d-flex align-items-center" role="alert">
                                <i className="fi fi-sr-trophy-star me-2"></i>
                                <div>A simple success alert with icon</div>
                            </div>
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="fi fi-ss-octagon-exclamation me-2"></i>
                                <div>A simple danger alert with icon</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            < h6 className="card-title mb-0">Additional Content</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="alert alert-success" role="alert">
                                <h4 className="alert-heading">Well done!</h4>
                                <p>Aww yeah, you successfully read this alert message. This text is going to run longer so you can see how spacing within an alert works.</p>
                                <hr />
                                <p className="mb-0">Whenever you need, be sure to use margin utilities to keep things tidy.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
