export default function ListGroup() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">List Group</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">List Group</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic List</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group">
                                <li className="list-group-item">An item</li>
                                <li className="list-group-item">A second item</li>
                                <li className="list-group-item">A third item</li>
                                <li className="list-group-item">A fourth item</li>
                                <li className="list-group-item">And a fifth one</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Active Items</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group">
                                <li className="list-group-item active">An active item</li>
                                <li className="list-group-item">A second item</li>
                                <li className="list-group-item">A third item</li>
                                <li className="list-group-item">A fourth item</li>
                                <li className="list-group-item">And a fifth one</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Flush</h6>
                        </div>
                        <div className="card-body p-4 pt-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">An item</li>
                                <li className="list-group-item">A second item</li>
                                <li className="list-group-item">A third item</li>
                                <li className="list-group-item">A fourth item</li>
                                <li className="list-group-item">A fifth item</li>
                                <li className="list-group-item">And a sixth one</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">With Badges</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    A list item
                                    <span className="badge bg-primary rounded-pill">14</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    A second list item
                                    <span className="badge bg-primary rounded-pill">2</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    A third list item
                                    <span className="badge bg-primary rounded-pill">1</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Numbered</h6>
                        </div>
                        <div className="card-body p-4">
                            <ol className="list-group list-group-numbered">
                                <li className="list-group-item">A list item</li>
                                <li className="list-group-item">A list item</li>
                                <li className="list-group-item">A list item</li>
                                <li className="list-group-item">A list item</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Checkboxes and Radios</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="list-group">
                                <label className="list-group-item d-flex gap-2">
                                    <input className="form-check-input flex-shrink-0" type="checkbox" defaultChecked />
                                    <span>First checkbox</span>
                                </label>
                                <label className="list-group-item d-flex gap-2">
                                    <input className="form-check-input flex-shrink-0" type="radio" name="listGroupRadio" />
                                    <span>First radio</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Links and Buttons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="list-group">
                                <button type="button" className="list-group-item list-group-item-action active">The current button</button>
                                <button type="button" className="list-group-item list-group-item-action">A second button item</button>
                                <button type="button" className="list-group-item list-group-item-action" disabled>A disabled button item</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Contextual Classes</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-primary">A simple primary list group item</li>
                                <li className="list-group-item list-group-item-secondary">A simple secondary list group item</li>
                                <li className="list-group-item list-group-item-success">A simple success list group item</li>
                                <li className="list-group-item list-group-item-danger">A simple danger list group item</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Custom Content</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="list-group">
                                <a href="#" className="list-group-item list-group-item-action active">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">List group item heading</h5>
                                        <small>3 days ago</small>
                                    </div>
                                    <p className="mb-1">Some placeholder content in a paragraph.</p>
                                    <small>And some small print.</small>
                                </a>
                                <a href="#" className="list-group-item list-group-item-action">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">List group item heading</h5>
                                        <small className="text-body-secondary">3 days ago</small>
                                    </div>
                                    <p className="mb-1">Some placeholder content in a paragraph.</p>
                                    <small className="text-body-secondary">And some muted small print.</small>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
