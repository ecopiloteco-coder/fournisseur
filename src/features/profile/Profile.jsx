import { Link } from 'react-router-dom'

export default function Profile() {
    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Profile</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex flex-wrap gap-4 align-items-center">
                                <div className="d-flex align-items-center">
                                    <div className="position-relative">
                                        <div className="avatar avatar-xxl rounded-circle border border-primary border-3">
                                            <img src="/assets/images/avatar/avatar3.webp" alt="Emma Smith" />
                                        </div>
                                        <button className="btn btn-primary btn-icon btn-xxs rounded-circle position-absolute top-0 end-0">
                                            <i className="fi fi-rr-camera"></i>
                                        </button>
                                    </div>
                                    <div className="ms-4">
                                        <h4 className="fw-bold mb-1">Emma Smith</h4>
                                        <p className="text-muted mb-2">Front-End Developer</p>
                                        <div className="d-flex gap-2">
                                            <span className="badge rounded-pill bg-primary-subtle text-primary">Admin</span>
                                            <span className="badge rounded-pill bg-success-subtle text-success">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="ms-auto d-flex gap-2">
                                    <Link to="/chat" className="btn btn-primary">Message</Link>
                                    <button className="btn btn-outline-secondary">Follow</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="row g-3">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header border-0 pb-0 d-flex justify-content-between align-items-center">
                                    <h6 className="card-title mb-0">Basic Info</h6>
                                    <button className="btn btn-sm btn-icon btn-light"><i className="fi fi-rr-pencil"></i></button>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">Full Name</label>
                                        <span className="fw-bold">Emma Smith</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">Email</label>
                                        <span className="fw-bold">emma.smith@gmail.com</span>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small d-block">Phone</label>
                                        <span className="fw-bold">+1 (123) 456-7890</span>
                                    </div>
                                    <div className="mb-0">
                                        <label className="text-muted small d-block">Joined Date</label>
                                        <span className="fw-bold">March 12, 2020</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card text-center">
                                <div className="card-header border-0 pb-0"><h6 className="card-title mb-0 text-start">Social Media</h6></div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-center gap-2 flex-wrap">
                                        {['facebook-f', 'twitter', 'instagram', 'linkedin-in', 'github'].map(icon => (
                                            <button key={icon} className="btn btn-light btn-icon rounded-circle"><i className={`fa-brands fa-${icon}`}></i></button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card mb-3">
                        <div className="card-header border-0 pb-0"><h6 className="card-title mb-0">Account Settings</h6></div>
                        <div className="card-body">
                            <form>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-12">
                                        <label className="form-label">Full Name</label>
                                        <input type="text" className="form-control" defaultValue="Emma Smith" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input type="email" className="form-control" defaultValue="emma.smith@gmail.com" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Phone</label>
                                        <input type="tel" className="form-control" defaultValue="+1 (123) 456-7890" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Bio</label>
                                        <textarea className="form-control" rows="4" defaultValue="I manage user roles, oversee platform settings, and ensure everything runs smoothly..."></textarea>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn btn-success">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card border-danger border-opacity-25 bg-danger-subtle">
                        <div className="card-body">
                            <h6 className="text-danger fw-bold">Danger Zone</h6>
                            <p className="small text-muted mb-4">Critical actions that affect your account.</p>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                    <h6 className="mb-0 small text-danger">Delete Account</h6>
                                    <p className="text-2xs text-muted mb-0">Once you delete your account, there is no going back. Please be certain.</p>
                                </div>
                                <button className="btn btn-danger btn-sm">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
