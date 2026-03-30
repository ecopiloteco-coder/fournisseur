export default function Recruitment() {
    const stats = [
        { label: 'Total Job Openings', value: '1,335', icon: 'fi-sr-shopping-bag', color: 'secondary' },
        { label: 'Total Application', value: '35,002', icon: 'fi-sr-document', color: 'warning' },
        { label: 'Shortlisted', value: '20,273', icon: 'fi-sr-users', color: 'info' },
        { label: 'Interviewed', value: '12,240', icon: 'fi-sr-headphones', color: 'primary' },
        { label: 'Rejected', value: '13,250', icon: 'fi-sr-delete-user', color: 'danger' },
        { label: 'Hired', value: '2,724', icon: 'fi-ss-badget-check-alt', color: 'success' }
    ]

    const interviewSchedule = [
        { name: 'William Johnson', role: 'Web Designer', time: '12.30 PM', avatar: '1', badgeClass: 'bg-danger-subtle text-danger' },
        { name: 'Alexander Brown', role: 'Front-End Developer', time: '24 July 2024', avatar: '2', badgeClass: 'bg-primary-subtle text-primary' },
        { name: 'Michael Davis', role: 'UI/UX Designer', time: '11.00 AM', avatar: '3', badgeClass: 'bg-secondary-subtle text-secondary' },
        { name: 'David Wilson', role: 'Back-End Developer', time: '12.30 PM', avatar: '4', badgeClass: 'bg-success-subtle text-success' }
    ]

    const vacancies = [
        { title: 'Figma Designer', type1: 'Full Time', type2: 'Remote', applied: 76, newCount: 14, salary: '$100K - $200K', location: 'USA', img: 'figma.png', bg: 'primary-subtle' },
        { title: 'Python Developer', type1: 'Full Time', type2: 'Remote', applied: 12, newCount: 7, salary: '$100K - $200K', location: 'USA', img: 'python.png', bg: 'secondary-subtle' },
        { title: 'Web Developer', type1: 'Full Time', type2: 'Remote', applied: 99, newCount: 23, salary: '$100K - $200K', location: 'USA', img: 'code.png', bg: 'info-subtle' },
        { title: 'React Developer', type1: 'Full Time', type2: 'Remote', applied: 46, newCount: 61, salary: '$100K - $200K', location: 'USA', img: 'react.png', bg: 'success-subtle' }
    ]

    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Recruitment</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Recruitment</li>
                        </ol>
                    </nav>
                </div>
                <button type="button" className="btn btn-primary waves-effect waves-light">
                    <i className="fi fi-rr-plus me-1"></i> Create Job
                </button>
            </div>

            <div className="row">
                <div className="col-xxl-5">
                    <div className="row g-3">
                        {stats.map((stat, i) => (
                            <div key={i} className="col-xxl-6 col-md-4 col-sm-6">
                                <div className={`card card-action action-border-${stat.color} p-1 position-relative`}>
                                    <div className="card-body d-flex gap-3 align-items-center p-4">
                                        <div className={`clearfix pe-2 text-${stat.color}`}>
                                            <i className={`fi ${stat.icon} fs-1`}></i>
                                        </div>
                                        <div className="clearfix">
                                            <div className="mb-1">{stat.label}</div>
                                            <h3 className="mb-0 fw-bold">{stat.value}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-xxl-7">
                    <div className="card bg-gray bg-opacity-10 border-0 shadow-none h-100">
                        <div className="card-header d-flex gap-3 flex-wrap align-items-center justify-content-between border-0 pb-0">
                            <h6 className="card-title mb-0">Interview Schedule</h6>
                            <a href="#" className="btn-link">View All</a>
                        </div>
                        <div className="card-body px-3 pb-2">
                            <div className="row gx-2">
                                <div className="col-md-6">
                                    <ul className="list-group list-group-smooth list-group-unlined mb-0">
                                        {interviewSchedule.slice(0, 4).map((item, i) => (
                                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                                <div className="avatar rounded-circle me-1">
                                                    <img src={`/assets/images/avatar/avatar${item.avatar}.webp`} alt="" />
                                                </div>
                                                <div className="ms-2 me-auto">
                                                    <h6 className="mb-0 small">{item.name}</h6>
                                                    <small className="text-body text-xs">{item.role}</small>
                                                </div>
                                                <span className={`badge badge-lg ${item.badgeClass}`}>{item.time}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="list-group list-group-smooth list-group-unlined mb-0">
                                        {interviewSchedule.slice(0, 4).map((item, i) => (
                                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center mb-2">
                                                <div className="avatar rounded-circle me-1">
                                                    <img src={`/assets/images/avatar/avatar${item.avatar}.webp`} alt="" />
                                                </div>
                                                <div className="ms-2 me-auto">
                                                    <h6 className="mb-0 small">{item.name}</h6>
                                                    <small className="text-body text-xs">{item.role}</small>
                                                </div>
                                                <span className={`badge badge-lg ${item.badgeClass}`}>{item.time}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-12 my-3">
                    <h5 className="fw-bold mb-0">Current Vacancy <span className="text-primary ms-1 text-2xs">74 Job Added</span></h5>
                </div>
                {vacancies.map((job, i) => (
                    <div key={i} className="col-xxl-3 col-md-6">
                        <div className={`card card-action action-elevate bg-${job.bg} border-0 shadow-none mb-4`}>
                            <div className="card-body">
                                <div className="d-flex gap-3 align-items-center mb-4">
                                    <div className="avatar bg-body rounded-3 p-2">
                                        <img src={`/assets/images/media/${job.img}`} alt="" />
                                    </div>
                                    <div className="clearfix">
                                        <h6 className="mb-1 text-sm">{job.title}</h6>
                                        <ul className="list-inline list-inline-disc d-flex mb-0 text-xs text-muted">
                                            <li>{job.type1}</li>
                                            <li className="ms-3">{job.type2}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-body p-3 rounded-3 mb-3 d-flex">
                                    <div className="text-center w-50">
                                        <h2 className="fs-1 fw-bold mb-1">{job.applied}</h2>
                                        <span className="text-primary small">Applied</span>
                                    </div>
                                    <div className="vr"></div>
                                    <div className="text-center w-50">
                                        <h2 className="fs-1 fw-bold mb-1">{job.newCount}</h2>
                                        <span className="text-primary small">New</span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between gap-2 pt-1 mb-3">
                                    <div className="text-start">
                                        <span className="text-1xs d-block text-muted">Salary</span>
                                        <span className="text-sm text-dark d-block fw-semibold">{job.salary}</span>
                                    </div>
                                    <div className="text-end">
                                        <span className="text-1xs d-block text-muted">Location</span>
                                        <span className="text-sm text-dark d-block fw-semibold">{job.location}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary waves-effect waves-light w-100">See Job Post</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-4">
                <div className="col-lg-12">
                    <div className="card overflow-hidden">
                        <div className="card-header d-flex gap-3 flex-wrap align-items-center justify-content-between border-0 pb-0">
                            <h6 className="card-title mb-0">Candidate List</h6>
                            <div className="d-flex gap-2 flex-wrap">
                                <input type="text" className="form-control form-control-sm w-auto" placeholder="Search..." />
                                <button type="button" class="btn btn-sm btn-outline-light waves-effect">Download Report</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="ps-3">Name</th>
                                            <th>Department</th>
                                            <th>Phone No.</th>
                                            <th>Mail ID</th>
                                            <th>Status</th>
                                            <th>Interview</th>
                                            <th className="pe-3 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { name: 'James Anderson', dept: 'Back-End Developer', phone: '+01 789 456 3201', email: 'example@mail.com', status: 'Hired', statusClass: 'subtle-success', interview: 'Completed', interviewClass: 'bg-success' },
                                            { name: 'William Johnson', dept: 'Full-Stack Developer', phone: '+01 789 456 3201', email: 'example@mail.com', status: 'Shortlisted', statusClass: 'subtle-info', interview: 'Completed', interviewClass: 'bg-success' },
                                            { name: 'Benjamin Martinez', dept: 'Mobile App Developer', phone: '+01 789 456 3201', email: 'example@mail.com', status: 'Pending', statusClass: 'subtle-secondary', interview: 'Schedule', interviewClass: 'bg-info' }
                                        ].map((row, idx) => (
                                            <tr key={idx}>
                                                <td className="ps-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar avatar-xxs rounded-circle">
                                                            <img src={`/assets/images/avatar/avatar${idx + 1}.webp`} alt="" />
                                                        </div>
                                                        <span className="ms-2 fw-medium">{row.name}</span>
                                                    </div>
                                                </td>
                                                <td>{row.dept}</td>
                                                <td>{row.phone}</td>
                                                <td>{row.email}</td>
                                                <td><span className={`badge ${row.statusClass} px-2 py-1`}>{row.status}</span></td>
                                                <td><span className={`badge ${row.interviewClass} px-2 py-1 text-white`}>{row.interview}</span></td>
                                                <td className="pe-3 text-end">
                                                    <button className="btn btn-white btn-sm btn-icon waves-effect"><i className="fi fi-rr-menu-dots"></i></button>
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
