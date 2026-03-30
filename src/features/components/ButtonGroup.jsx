export default function ButtonGroup() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Button Group</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Button Group</li>
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
                            <div className="d-flex gap-3 flex-wrap">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-primary waves-effect waves-light">Left</button>
                                    <button type="button" className="btn btn-primary waves-effect waves-light">Middle</button>
                                    <button type="button" className="btn btn-primary waves-effect waves-light">Right</button>
                                </div>

                                <div className="btn-group">
                                    <a href="#" className="btn btn-primary waves-effect waves-light active" aria-current="page">Active Link</a>
                                    <a href="#" className="btn btn-primary waves-effect waves-light">Link</a>
                                    <a href="#" className="btn btn-primary waves-effect waves-light">Link</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Mixed Styles</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                <button type="button" className="btn btn-danger waves-effect waves-light">Left</button>
                                <button type="button" className="btn btn-warning waves-effect waves-light">Middle</button>
                                <button type="button" className="btn btn-success waves-effect waves-light">Right</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Outlined Styles</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-primary waves-effect waves-light">Left</button>
                                <button type="button" className="btn btn-outline-primary waves-effect waves-light">Middle</button>
                                <button type="button" className="btn btn-outline-primary waves-effect waves-light">Right</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Sizing</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column gap-3">
                                <div className="btn-group btn-group-lg" role="group">
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light">Left</button>
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light">Middle</button>
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light">Right</button>
                                </div>
                                <div className="btn-group btn-group-sm" role="group">
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light">Left</button>
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light">Middle</button>
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light">Right</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Vertical Variation</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="btn-group-vertical" role="group" aria-label="Vertical button group">
                                <button type="button" className="btn btn-primary">Button</button>
                                <button type="button" className="btn btn-primary">Button</button>
                                <button type="button" className="btn btn-primary">Button</button>
                                <button type="button" className="btn btn-primary">Button</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Nesting</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="btn-group" role="group">
                                <button type="button" className="btn btn-primary waves-effect waves-light">1</button>
                                <button type="button" className="btn btn-primary waves-effect waves-light">2</button>
                                <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        Dropdown
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                        <li><a className="dropdown-item" href="#">Dropdown link</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
