import { useEffect, useRef } from 'react';

export default function TablesDatatable() {
    const tableRef = useRef(null);

    useEffect(() => {
        if (window.$ && window.$.fn.DataTable) {
            const table = window.$(tableRef.current).DataTable({
                searching: true,
                pageLength: 5,
                lengthChange: false,
                info: true,
                paging: true
            });
            return () => table.destroy();
        }
    }, []);
    const tableData = [
        { id: 1, name: 'James Anderson', type: 'Casual Leave', department: 'Back-End Developer', days: '2 Days', start: '12 July 2024', end: '15 July 2024', status: 'Approved', avatar: '/assets/images/avatar/avatar1.webp' },
        { id: 2, name: 'William Johnson', type: 'Maternity Leave', department: 'Full-Stack Developer', days: '1st Half Day', start: '03 July 2024', end: '04 July 2024', status: 'Approved', avatar: '/assets/images/avatar/avatar2.webp' },
        { id: 3, name: 'Benjamin Martinez', type: 'Casual Leave', department: 'Mobile App Developer', days: '4 Days', start: '27 July 2024', end: '31 July 2024', status: 'New', avatar: '/assets/images/avatar/avatar3.webp' },
        { id: 4, name: 'Michael Davis', type: 'Maternity Leave', department: 'UI/UX Designer', days: '2nd Half Day', start: '05 June 2024', end: '04 June 2025', status: 'Pending', avatar: '/assets/images/avatar/avatar4.webp' },
        { id: 5, name: 'Matthew Taylor', type: 'Paternity Leave', department: 'DevOps Engineer', days: '1 Days', start: '04 Aug 2024', end: '05 Aug 2024', status: 'Rejected', avatar: '/assets/images/avatar/avatar5.webp' },
        { id: 6, name: 'David Wilson', type: 'Paternity Leave', department: 'DevOps Engineer', days: '22 Days', start: '04 Aug 2024', end: '04 Aug 2024', status: 'Rejected', avatar: '/assets/images/avatar/avatar1.webp' },
        { id: 7, name: 'Anthony Thomas', type: 'Casual Leave', department: 'Back-End Developer', days: '2 Days', start: '12 July 2024', end: '15 July 2024', status: 'New', avatar: '/assets/images/avatar/avatar2.webp' },
    ];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Datatable</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Datatable</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card overflow-hidden">
                        <div className="card-header border-0 bg-transparent pt-4 px-4 d-flex align-items-center justify-content-between">
                            <h6 className="card-title mb-0">DataTable basic</h6>
                        </div>
                        <div className="card-body p-0 pb-2">
                            <div className="table-responsive">
                                <table ref={tableRef} className="table display mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="minw-200px">Name</th>
                                            <th className="minw-150px">Leave Type</th>
                                            <th className="minw-200px">Department</th>
                                            <th className="minw-150px">Days</th>
                                            <th className="minw-150px">Start</th>
                                            <th className="minw-150px">End</th>
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
                                                <td>
                                                    <span className={item.type.includes('Casual') ? 'text-success' : item.type.includes('Paternity') ? 'text-warning' : 'text-body'}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td>{item.department}</td>
                                                <td>{item.days}</td>
                                                <td>{item.start}</td>
                                                <td>{item.end}</td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button
                                                            className={`btn btn-sm dropdown-toggle waves-effect waves-light ${item.status === 'Approved' ? 'btn-subtle-primary' :
                                                                item.status === 'New' ? 'btn-subtle-success' :
                                                                    item.status === 'Pending' ? 'btn-outline-light' : 'btn-subtle-secondary'
                                                                }`}
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                        >
                                                            {item.status}
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end">
                                                            <li><a className="dropdown-item" href="/">Pending</a></li>
                                                            <li><a className="dropdown-item" href="/">Approved</a></li>
                                                            <li><a className="dropdown-item" href="/">Rejected</a></li>
                                                            <li><a className="dropdown-item" href="/">New</a></li>
                                                        </ul>
                                                    </div>
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
