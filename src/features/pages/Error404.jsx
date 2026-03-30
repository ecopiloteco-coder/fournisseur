export default function Error404() {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4">
            <div className="text-center">
                <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
                <h3 className="fw-bold mb-3">Oops! Page Not Found</h3>
                <p className="text-muted mb-5">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <div className="mb-5">
                    <img src="/assets/images/media/svg/media4.svg" alt="404" className="img-fluid" style={{ maxHeight: '300px' }} />
                </div>
                <a href="/" className="btn btn-primary px-5 py-2 fw-bold">Back to Dashboard</a>
            </div>
        </div>
    )
}
