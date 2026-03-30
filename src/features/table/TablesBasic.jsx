export default function TablesBasic() {
    const tableData = [
        { id: 1, name: 'James Anderson', department: 'Back-End Developer', days: '30 Days', working: '27 Days', salary: '$22,250', overtime: '$1500', status: 'Completed', avatar: '/assets/images/avatar/avatar1.webp' },
        { id: 2, name: 'William Johnson', department: 'Full-Stack Developer', days: '29 Days', working: '18 Days', salary: '$21,250', overtime: '$1800', status: 'Completed', avatar: '/assets/images/avatar/avatar2.webp' },
        { id: 3, name: 'Benjamin Martinez', department: 'Mobile App Developer', days: '28 Days', working: '4 Days', salary: '$22,250', overtime: '$2900', status: 'Reject', avatar: '/assets/images/avatar/avatar3.webp' },
        { id: 4, name: 'Michael Davis', department: 'UI/UX Designer', days: '27 Days', working: '27 Days', salary: '$86,000', overtime: '$400', status: 'Pending', avatar: '/assets/images/avatar/avatar4.webp' },
        { id: 5, name: 'Matthew Taylor', department: 'DevOps Engineer', days: '26 Days', working: '30 Days', salary: '$12,000', overtime: '$700', status: 'Pending', avatar: '/assets/images/avatar/avatar5.webp' },
    ];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Basic Tables</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Basic Tables</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12">
                    <div className="card overflow-hidden">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Table Basic</h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-border-bottom-0 mb-0">
                                    <thead>
                                        <tr>
                                            <th className="minw-200px">Name</th>
                                            <th className="minw-200px">Department</th>
                                            <th className="minw-100px">Total Days</th>
                                            <th className="minw-150px">Working Day</th>
                                            <th className="minw-150px">Total Salary</th>
                                            <th className="minw-100px">Over Time</th>
                                            <th className="minw-100px">Status</th>
                                            <th className="text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="d-flex align-items-center mw-175px">
                                                        <div className="avatar avatar-xxs rounded-circle">
                                                            <img src={item.avatar} alt="" />
                                                        </div>
                                                        <div className="ms-2 me-auto">{item.name}</div>
                                                    </div>
                                                </td>
                                                <td>{item.department}</td>
                                                <td>{item.days}</td>
                                                <td>{item.working}</td>
                                                <td><span className="fw-semibold">{item.salary}</span></td>
                                                <td>{item.overtime}</td>
                                                <td>
                                                    <span className={`badge bg-${item.status === 'Completed' ? 'primary' : item.status === 'Reject' ? 'danger' : 'secondary'}-subtle text-${item.status === 'Completed' ? 'primary' : item.status === 'Reject' ? 'danger' : 'secondary'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group float-end">
                                                        <button className="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                            <i className="fi fi-rr-menu-dots"></i>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                            <li><a className="dropdown-item" href="/">Edit</a></li>
                                                            <li><a className="dropdown-item" href="/">Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card overflow-hidden bg-dark text-white">
                        <div className="card-header border-0 bg-transparent pt-4 px-4 text-white">
                            <h6 className="card-title mb-0">Table Dark</h6>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-dark table-border-bottom-0 mb-0">
                                    <thead>
                                        <tr>
                                            <th className="minw-200px">Name</th>
                                            <th className="minw-200px">Department</th>
                                            <th className="minw-100px">Total Days</th>
                                            <th className="minw-150px">Working Day</th>
                                            <th className="minw-150px">Total Salary</th>
                                            <th className="minw-100px">Over Time</th>
                                            <th className="minw-100px">Status</th>
                                            <th className="text-end text-white">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="text-white">
                                                    <div className="d-flex align-items-center mw-175px">
                                                        <div className="avatar avatar-xxs rounded-circle">
                                                            <img src={item.avatar} alt="" />
                                                        </div>
                                                        <div className="ms-2 me-auto">{item.name}</div>
                                                    </div>
                                                </td>
                                                <td className="text-white">{item.department}</td>
                                                <td className="text-white">{item.days}</td>
                                                <td className="text-white">{item.working}</td>
                                                <td className="text-white"><span className="fw-semibold">{item.salary}</span></td>
                                                <td className="text-white">{item.overtime}</td>
                                                <td>
                                                    <span className={`badge bg-${item.status === 'Completed' ? 'primary' : item.status === 'Reject' ? 'danger' : 'secondary'}-subtle text-${item.status === 'Completed' ? 'primary' : item.status === 'Reject' ? 'danger' : 'secondary'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group float-end">
                                                        <button className="btn btn-white btn-sm btn-shadow btn-icon waves-effect dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                            <i className="fi fi-rr-menu-dots"></i>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                            <li><a className="dropdown-item" href="/">Edit</a></li>
                                                            <li><a className="dropdown-item" href="/">Delete</a></li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
