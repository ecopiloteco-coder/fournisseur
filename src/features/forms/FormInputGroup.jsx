export default function FormInputGroup() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Form Input Group</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Form Input Group</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Examples</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="input-group mb-3">
                                <span className="input-group-text">@</span>
                                <input type="text" className="form-control" placeholder="Username" />
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Recipient's username" />
                                <span className="input-group-text">@example.com</span>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">$</span>
                                <input type="text" className="form-control" />
                                <span className="input-group-text">.00</span>
                            </div>
                            <div className="input-group">
                                <span className="input-group-text">With textarea</span>
                                <textarea className="form-control"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Button Addons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="input-group mb-3">
                                <button className="btn btn-outline-light" type="button">Button</button>
                                <input type="text" className="form-control" placeholder="" />
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Recipient's username" />
                                <button className="btn btn-outline-light" type="button">Button</button>
                            </div>
                            <div className="input-group">
                                <button className="btn btn-outline-light" type="button">Button</button>
                                <button className="btn btn-outline-light" type="button">Button</button>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Sizing & Advanced</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="input-group input-group-sm mb-3">
                                <span className="input-group-text">Small</span>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Default</span>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="input-group input-group-lg mb-3">
                                <span className="input-group-text">Large</span>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="input-group mb-3">
                                <div className="input-group-text">
                                    <input className="form-check-input mt-0" type="checkbox" />
                                </div>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="input-group">
                                <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">Dropdown</button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/">Action</a></li>
                                    <li><a className="dropdown-item" href="/">Another action</a></li>
                                </ul>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
