export default function FormFloating() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Form Floating</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Form Floating</li>
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
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea" style={{ height: '100px' }}></textarea>
                                <label htmlFor="floatingTextarea">Comments</label>
                            </div>
                            <div className="form-floating">
                                <select className="form-select" id="floatingSelect">
                                    <option defaultValue>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                                <label htmlFor="floatingSelect">Works with selects</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Validation States</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control is-valid" id="floatingVal1" defaultValue="test@example.com" />
                                <label htmlFor="floatingVal1">Valid input</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control is-invalid" id="floatingVal2" defaultValue="invalid-email" />
                                <label htmlFor="floatingVal2">Invalid input</label>
                                <div className="invalid-feedback">Please provide a valid email.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Layout Grid</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-2">
                                <div className="col-md">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="floatingGrid1" placeholder="name@example.com" />
                                        <label htmlFor="floatingGrid1">Email address</label>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="form-floating">
                                        <select className="form-select" id="floatingGrid2">
                                            <option defaultValue>Open this select menu</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                        </select>
                                        <label htmlFor="floatingGrid2">Works with selects</label>
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
