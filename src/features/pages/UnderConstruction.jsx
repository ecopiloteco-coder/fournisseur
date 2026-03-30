export default function UnderConstruction() {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
            <div className="text-center w-lg-600px">
                <div className="mb-5">
                    <img src="/assets/images/media/svg/media5.svg" alt="Under Construction" className="img-fluid" style={{ maxHeight: '350px' }} />
                </div>
                <h1 className="display-5 fw-bold mb-3">Site Under Construction</h1>
                <p className="text-muted mb-5 lead">Our website is currently undergoing scheduled maintenance. We should be back shortly. Thank you for your patience.</p>

                <div className="card shadow-sm border-0 p-4 mb-5">
                    <div className="d-flex align-items-center justify-content-center gap-4">
                        <div className="text-center">
                            <h4 className="fw-bold mb-0">85%</h4>
                            <small className="text-uppercase text-muted x-small">Progress</small>
                        </div>
                        <div className="flex-grow-1">
                            <div className="progress" style={{ height: '10px' }}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                    <a href="/" className="btn btn-primary px-5 py-2 fw-bold">Return to Home</a>
                    <a href="mailto:support@ecopilot.com" className="btn btn-outline-secondary px-5 py-2 fw-bold">Contact Support</a>
                </div>
            </div>
        </div>
    )
}
