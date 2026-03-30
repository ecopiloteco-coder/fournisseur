import { useEffect } from 'react';

export default function FormValidation() {
    useEffect(() => {
        // Bootstrap validation script
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, []);

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Form Validation</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Form Validation</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Custom Styles</h6>
                        </div>
                        <div className="card-body p-4">
                            <form className="row g-3 needs-validation" noValidate>
                                <div className="col-md-4">
                                    <label htmlFor="validation01" className="form-label">First name</label>
                                    <input type="text" className="form-control" id="validation01" defaultValue="Mark" required />
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="validation02" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id="validation02" defaultValue="Otto" required />
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="validationUsername" className="form-label">Username</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text">@</span>
                                        <input type="text" className="form-control" id="validationUsername" required />
                                        <div className="invalid-feedback">Please choose a username.</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="validation03" className="form-label">City</label>
                                    <input type="text" className="form-control" id="validation03" required />
                                    <div className="invalid-feedback">Please provide a valid city.</div>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="validation04" className="form-label">State</label>
                                    <select className="form-select" id="validation04" required>
                                        <option disabled value="">Choose...</option>
                                        <option>France</option>
                                        <option>USA</option>
                                    </select>
                                    <div className="invalid-feedback">Please select a valid state.</div>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="validation05" className="form-label">Zip</label>
                                    <input type="text" className="form-control" id="validation05" required />
                                    <div className="invalid-feedback">Please provide a valid zip.</div>
                                </div>
                                <div className="col-12">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required />
                                        <label className="form-check-label" htmlFor="invalidCheck">Agree to terms and conditions</label>
                                        <div className="invalid-feedback">You must agree before submitting.</div>
                                    </div>
                                </div>
                                <div className="col-12 text-end">
                                    <button className="btn btn-primary" type="submit">Submit form</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Tooltips</h6>
                        </div>
                        <div className="card-body p-4">
                            <form className="row g-3 needs-validation" noValidate>
                                <div className="col-md-4 position-relative">
                                    <label htmlFor="vTooltip01" className="form-label">First name</label>
                                    <input type="text" className="form-control" id="vTooltip01" defaultValue="John" required />
                                    <div className="valid-tooltip">Looks good!</div>
                                </div>
                                <div className="col-md-4 position-relative">
                                    <label htmlFor="vTooltip02" className="form-label">Last name</label>
                                    <input type="text" className="form-control" id="vTooltip02" defaultValue="Doe" required />
                                    <div className="valid-tooltip">Looks good!</div>
                                </div>
                                <div className="col-12 mt-4 text-end">
                                    <button className="btn btn-primary" type="submit">Submit form</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
