export default function FormLayout() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Form Layout</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Form Layout</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-xxl-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Vertical Form</h6>
                        </div>
                        <div className="card-body p-4">
                            <form className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="inputEmail4" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="inputPassword4" />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="inputAddress" className="form-label">Address</label>
                                    <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="inputCity" className="form-label">City</label>
                                    <input type="text" className="form-control" id="inputCity" />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="inputState" className="form-label">State</label>
                                    <select id="inputState" className="form-select">
                                        <option defaultValue>Choose...</option>
                                        <option>...</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label htmlFor="inputZip" className="form-label">Zip</label>
                                    <input type="text" className="form-control" id="inputZip" />
                                </div>
                                <div className="col-12">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="gridCheck" />
                                        <label className="form-check-label" htmlFor="gridCheck">Check me out</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <button type="submit" className="btn btn-primary">Sign in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-xxl-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Horizontal Form</h6>
                        </div>
                        <div className="card-body p-4">
                            <form>
                                <div className="row mb-3">
                                    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input type="email" className="form-control" id="inputEmail3" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-10">
                                        <input type="password" className="form-control" id="inputPassword3" />
                                    </div>
                                </div>
                                <fieldset className="row mb-3">
                                    <legend className="col-form-label col-sm-2 pt-0">Radios</legend>
                                    <div className="col-sm-10">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" defaultChecked />
                                            <label className="form-check-label" htmlFor="gridRadios1">First radio</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2" />
                                            <label className="form-check-label" htmlFor="gridRadios2">Second radio</label>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row mb-3">
                                    <div className="col-sm-10 offset-sm-2">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="gridCheck1" />
                                            <label className="form-check-label" htmlFor="gridCheck1">Example checkbox</label>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Auto Sizing</h6>
                        </div>
                        <div className="card-body p-4">
                            <form className="row gy-2 gx-3 align-items-center">
                                <div className="col-auto">
                                    <label className="visually-hidden" htmlFor="autoSizingInput">Name</label>
                                    <input type="text" className="form-control" id="autoSizingInput" placeholder="Jane Doe" />
                                </div>
                                <div className="col-auto">
                                    <label className="visually-hidden" htmlFor="autoSizingInputGroup">Username</label>
                                    <div className="input-group">
                                        <div className="input-group-text">@</div>
                                        <input type="text" className="form-control" id="autoSizingInputGroup" placeholder="Username" />
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="autoSizingCheck" />
                                        <label className="form-check-label" htmlFor="autoSizingCheck">Remember me</label>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
