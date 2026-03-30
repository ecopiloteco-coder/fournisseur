export default function Offcanvas() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Offcanvas</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Offcanvas</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Placement</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex gap-3 flex-wrap">
                                <button className="btn btn-primary waves-effect waves-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasStart">Offcanvas Start</button>
                                <button className="btn btn-primary waves-effect waves-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEnd">Offcanvas Right</button>
                                <button className="btn btn-primary waves-effect waves-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop">Offcanvas Top</button>
                                <button className="btn btn-primary waves-effect waves-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom">Offcanvas Bottom</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Dark Offcanvas</h6>
                        </div>
                        <div className="card-body p-4">
                            <button className="btn btn-dark waves-effect waves-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDark">Offcanvas Dark</button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Body Scrolling</h6>
                        </div>
                        <div className="card-body p-4">
                            <button className="btn btn-primary waves-effect waves-light" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling">Enable body scrolling</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Offcanvas Definitions */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasStart">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Offcanvas Start</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">...</div>
            </div>

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasEnd">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Offcanvas Right</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">...</div>
            </div>

            <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasDark">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title text-white">Dark Offcanvas</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">...</div>
            </div>

            <div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Scrolling Offcanvas</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">...</div>
            </div>
        </>
    )
}
