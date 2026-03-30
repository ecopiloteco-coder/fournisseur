export default function FormElements() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Form Elements</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Form Elements</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Inputs</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-3">
                                <label className="form-label">Text Input</label>
                                <input type="text" className="form-control" placeholder="Entrez du texte..." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" placeholder="nom@exemple.com" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" defaultValue="123456" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Textarea</label>
                                <textarea className="form-control" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Checkboxes & Radios</h6>
                        </div>
                        <div className="card-body p-4">
                            <h6 className="small fw-bold mb-3">Checkboxes</h6>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" id="check1" defaultChecked />
                                <label className="form-check-label" htmlFor="check1">Default checkbox</label>
                            </div>
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" id="check2" disabled />
                                <label className="form-check-label" htmlFor="check2">Disabled checkbox</label>
                            </div>

                            <h6 className="small fw-bold mb-3">Radios</h6>
                            <div className="form-check mb-2">
                                <input className="form-check-input" type="radio" name="radioTest" id="radio1" defaultChecked />
                                <label className="form-check-label" htmlFor="radio1">Default radio</label>
                            </div>
                            <div className="form-check mb-3">
                                <input className="form-check-input" type="radio" name="radioTest" id="radio2" />
                                <label className="form-check-label" htmlFor="radio2">Second radio</label>
                            </div>

                            <h6 className="small fw-bold mb-3">Switches</h6>
                            <div className="form-check form-switch mb-2">
                                <input className="form-check-input" type="checkbox" id="switch1" defaultChecked />
                                <label className="form-check-label" htmlFor="switch1">Toggle this switch element</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Selection & Sizing</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-3">
                                <label className="form-label">Default Select</label>
                                <select className="form-select">
                                    <option defaultValue>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Large Input</label>
                                <input className="form-control form-control-lg" type="text" placeholder=".form-control-lg" />
                            </div>
                            <div className="mb-0">
                                <label className="form-label">Small Input</label>
                                <input className="form-control form-control-sm" type="text" placeholder=".form-control-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">File Browser & Range</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-4">
                                <label className="form-label">Default file input example</label>
                                <input className="form-control" type="file" id="formFile" />
                            </div>
                            <div className="mb-0">
                                <label className="form-label">Example range</label>
                                <input type="range" className="form-range" id="customRange1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
