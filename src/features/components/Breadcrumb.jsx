export default function Breadcrumb() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Breadcrumb</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Breadcrumb</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic</h6>
                        </div>
                        <div className="card-body p-4">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item active" aria-current="page">Home</li>
                                </ol>
                            </nav>

                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Library</li>
                                </ol>
                            </nav>

                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item"><a href="#">Library</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Data</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Dividers</h6>
                        </div>
                        <div className="card-body p-4">
                            <nav style={{ "--bs-breadcrumb-divider": "'>'" }} aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Library</li>
                                </ol>
                            </nav>
                            <nav style={{ "--bs-breadcrumb-divider": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E\")" }} aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Library</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Colored Breadcrumb</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column gap-3">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb p-3 bg-primary-subtle rounded-3">
                                        <li className="breadcrumb-item"><a className="link-primary" href="#"><i className="fi fi-rr-home"></i></a></li>
                                        <li className="breadcrumb-item"><a className="link-primary fw-medium text-decoration-none" href="#">Library</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Data</li>
                                    </ol>
                                </nav>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb p-3 bg-success-subtle rounded-3">
                                        <li className="breadcrumb-item"><a className="link-success" href="#"><i className="fi fi-rr-home"></i></a></li>
                                        <li className="breadcrumb-item"><a className="link-success fw-medium text-decoration-none" href="#">Library</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Data</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Colored Border Breadcrumb</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column gap-3">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb p-3 border border-primary rounded-3">
                                        <li className="breadcrumb-item"><a className="link-primary" href="#"><i className="fi fi-rr-home"></i></a></li>
                                        <li className="breadcrumb-item"><a className="link-primary fw-medium text-decoration-none" href="#">Library</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Data</li>
                                    </ol>
                                </nav>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb p-3 border border-danger rounded-3">
                                        <li className="breadcrumb-item"><a className="link-danger" href="#"><i className="fi fi-rr-home"></i></a></li>
                                        <li className="breadcrumb-item"><a className="link-danger fw-medium text-decoration-none" href="#">Library</a></li>
                                        <li className="breadcrumb-item active" aria-current="page">Data</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
