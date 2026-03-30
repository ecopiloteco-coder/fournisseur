export default function Navbar() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Navbar</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Navbar</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <h6 className="mb-3">Basic Navbar</h6>
                    <nav className="navbar navbar-expand-lg bg-light rounded shadow-sm">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="#">Navbar</a>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBasic">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navBasic">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Dropdown</a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><a className="dropdown-item" href="#">Something else</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item"><a className="nav-link disabled">Disabled</a></li>
                                </ul>
                                <form className="d-flex" role="search">
                                    <input className="form-control me-2" type="search" placeholder="Search" />
                                    <button className="btn btn-primary waves-effect waves-light" type="submit">Search</button>
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <h6 className="mb-3">Color Schemes</h6>
                    {['dark', 'primary', 'secondary', 'success', 'danger', 'warning', 'info'].map((color) => (
                        <nav key={color} className={`navbar navbar-expand-lg bg-${color} mb-3 rounded shadow-sm ${color === 'warning' || color === 'info' ? 'navbar-light' : 'navbar-dark'}`}>
                            <div className="container-fluid">
                                <a className="navbar-brand" href="#">
                                    <img src="/assets/images/logo-text-white.svg" alt="logo" height="24" />
                                </a>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target={`#nav${color}`}>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id={`#nav${color}`}>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
                                        <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                                        <li className="nav-item dropdown">
                                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Settings</a>
                                            <ul className="dropdown-menu">
                                                <li><a className="dropdown-item" href="#">Action</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <ul className="navbar-nav ms-auto">
                                        <li className="nav-item"><a className="nav-link" href="#">Messages</a></li>
                                        <li className="nav-item"><a className="nav-link" href="#">Notifications</a></li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    ))}
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <h6 className="mb-3">Navbar Text</h6>
                    <nav className="navbar navbar-expand-lg bg-light rounded shadow-sm">
                        <div className="container-fluid">
                            <span className="navbar-text">Navbar text with an inline element</span>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
