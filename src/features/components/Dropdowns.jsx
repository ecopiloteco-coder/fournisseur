const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];

export default function Dropdowns() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Dropdowns</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Dropdowns</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Dropdowns</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {colors.map((color) => (
                                    <div key={color} className="btn-group">
                                        <button type="button" className={`btn btn-${color} waves-effect waves-light dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                                            {color.charAt(0).toUpperCase() + color.slice(1)}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item" href="#">Separated link</a></li>
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex flex-wrap gap-2 mb-4">
                                {colors.map((color) => (
                                    <div key={color} className="btn-group">
                                        <button type="button" className={`btn btn-subtle-${color} waves-effect waves-light dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                                            {color.charAt(0).toUpperCase() + color.slice(1)}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <div key={color} className="btn-group">
                                        <button type="button" className={`btn btn-outline-${color} waves-effect waves-light dropdown-toggle`} data-bs-toggle="dropdown" aria-expanded="false">
                                            {color.charAt(0).toUpperCase() + color.slice(1)}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Split Button Dropdowns</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {colors.map((color) => (
                                    <div key={color} className="btn-group">
                                        <button type="button" className={`btn btn-${color} waves-effect waves-light`}>{color.charAt(0).toUpperCase() + color.slice(1)}</button>
                                        <button type="button" className={`btn btn-${color} waves-effect waves-light dropdown-toggle dropdown-toggle-split`} data-bs-toggle="dropdown" aria-expanded="false">
                                            <span className="visually-hidden">Toggle Dropdown</span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item" href="#">Separated link</a></li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Dropdown Directions</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                <div className="btn-group dropup">
                                    <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropup</button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                    </ul>
                                </div>
                                <div className="btn-group dropend">
                                    <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropend</button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                    </ul>
                                </div>
                                <div className="btn-group dropstart">
                                    <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Dropstart</button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Dropdown Alignment</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
                                    Right-aligned menu
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><button className="dropdown-item" type="button">Action</button></li>
                                    <li><button className="dropdown-item" type="button">Another action</button></li>
                                    <li><button className="dropdown-item" type="button">Something else here</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
