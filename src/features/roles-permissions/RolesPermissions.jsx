import { useState } from 'react'

const PermissionGroup = ({ title, permissions, checkedIndices = [] }) => (
    <div className="mb-4">
        <h6 className="mb-3 text-muted small uppercase fw-bold font-heading">{title}</h6>
        <div className="d-grid gap-2">
            {permissions.map((perm, i) => (
                <div key={perm} className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${title}-${i}`}
                        defaultChecked={checkedIndices.includes(i)}
                    />
                    <label className="form-check-label small" htmlFor={`${title}-${i}`}>{perm}</label>
                </div>
            ))}
        </div>
    </div>
)

export default function RolesPermissions() {
    const [activeRole, setActiveRole] = useState('admin')

    const roles = [
        { id: 'admin', label: 'Super Admin', icon: 'fi-rr-star' },
        { id: 'manager', label: 'Manager', icon: 'fi-rr-admin-alt' },
        { id: 'editor', label: 'Editor', icon: 'fi-rr-vector-alt' },
        { id: 'viewer', label: 'Viewer', icon: 'fi-rr-overview' },
        { id: 'guest', label: 'Guest', icon: 'fi-rr-user' }
    ]

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Roles & Permissions</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Roles & Permissions</li>
                        </ol>
                    </nav>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light">
                    <i className="fi fi-rr-plus me-1"></i> Add New Role
                </button>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header overflow-auto">
                            <ul className="nav nav-underline card-header-tabs flex-nowrap" role="tablist">
                                {roles.map(role => (
                                    <li key={role.id} className="nav-item">
                                        <button
                                            className={`nav-link ${activeRole === role.id ? 'active' : ''} text-nowrap`}
                                            onClick={() => setActiveRole(role.id)}
                                        >
                                            <i className={`fi ${role.icon} me-1`}></i> {role.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-body">
                            <div className="tab-content mt-2">
                                {activeRole === 'admin' && (
                                    <div className="tab-pane fade show active">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <PermissionGroup
                                                    title="User Management"
                                                    permissions={['Create User', 'Edit User', 'Delete User', 'View User List', 'Assign Roles']}
                                                    checkedIndices={[0, 1, 2, 3, 4]}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <PermissionGroup
                                                    title="System Settings"
                                                    permissions={['Change Website Name', 'Manage Logos', 'Update APIs', 'Database Backup', 'System Logs']}
                                                    checkedIndices={[0, 1, 2, 3, 4]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeRole === 'manager' && (
                                    <div className="tab-pane fade show active">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <PermissionGroup
                                                    title="Project Management"
                                                    permissions={['Create Project', 'Edit Project', 'Delete Project', 'View Projects']}
                                                    checkedIndices={[0, 1, 3]}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <PermissionGroup
                                                    title="Team Management"
                                                    permissions={['Assign Tasks', 'Remove Team Members', 'View Team Stats']}
                                                    checkedIndices={[0, 2]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {['editor', 'viewer', 'guest'].includes(activeRole) && (
                                    <div className="tab-pane fade show active">
                                        <p className="text-muted">Permissions for <strong>{activeRole}</strong> are being loaded...</p>
                                        <div className="placeholder-glow">
                                            <span className="placeholder col-7 mb-2"></span>
                                            <span className="placeholder col-4"></span>
                                            <span className="placeholder col-4 ms-2"></span>
                                            <span className="placeholder col-6 mt-3"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-footer bg-light border-0 d-flex justify-content-end gap-2">
                            <button className="btn btn-light btn-sm px-4">Reset</button>
                            <button className="btn btn-primary btn-sm px-4">Update Permissions</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
