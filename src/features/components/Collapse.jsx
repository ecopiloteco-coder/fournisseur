export default function Collapse() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Collapse</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Collapse</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Collapse</h6>
                        </div>
                        <div className="card-body p-4">
                            <p className="d-inline-flex gap-2 mb-3">
                                <a className="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button">Link with href</a>
                                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample">Button with target</button>
                            </p>
                            <div className="collapse" id="collapseExample">
                                <div className="card card-body">Some placeholder content for the collapse component.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Horizontal Collapse</h6>
                        </div>
                        <div className="card-body p-4">
                            <button className="btn btn-primary mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample">Toggle width collapse</button>
                            <div style={{ minHeight: '120px' }}>
                                <div className="collapse collapse-horizontal" id="collapseWidthExample">
                                    <div className="card card-body" style={{ width: '300px' }}>This is placeholder content for a horizontal collapse.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Multi-Target Collapse</h6>
                        </div>
                        <div className="card-body p-4">
                            <p className="d-inline-flex gap-2 mb-3">
                                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapse1">Toggle first</button>
                                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapse2">Toggle second</button>
                                <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse">Toggle both</button>
                            </p>
                            <div className="row">
                                <div className="col pe-2">
                                    <div className="collapse multi-collapse" id="multiCollapse1">
                                        <div className="card card-body">First element content.</div>
                                    </div>
                                </div>
                                <div className="col ps-2">
                                    <div className="collapse multi-collapse" id="multiCollapse2">
                                        <div className="card card-body">Second element content.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
