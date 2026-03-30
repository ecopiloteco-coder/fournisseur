const blogPosts = [
    { id: 1, title: 'Effective Hiring Process for Finding the Right Talent', image: '/assets/images/blog/blog1.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since the 1500s.' },
    { id: 2, title: 'Employee Onboarding and the Power of First Impressions', image: '/assets/images/blog/blog2.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since the 1500s.' },
    { id: 3, title: 'Training and Development for a Skilled Workforce', image: '/assets/images/blog/blog3.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since the 1500s.' },
]

export default function BlogList() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Blog List</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Blog List</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    {blogPosts.map(post => (
                        <div key={post.id} className="card card-action action-elevate border-0 shadow-sm overflow-hidden mb-4">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img src={post.image} alt={post.title} className="img-fluid h-100 w-100" style={{ objectFit: 'cover', minHeight: '200px' }} />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body p-4">
                                        <div className="d-flex gap-3 mb-2 small text-muted">
                                            <span><i className="fi fi-rr-calendar text-primary me-1"></i> {post.date}</span>
                                            <span><i className="fi fi-rr-user text-primary me-1"></i> {post.author}</span>
                                        </div>
                                        <h5 className="fw-bold mb-3"><a href="/pages/blog-details" className="text-dark">{post.title}</a></h5>
                                        <p className="small text-muted mb-4">{post.summary}</p>
                                        <a href="/pages/blog-details" className="btn btn-outline-primary btn-sm waves-effect">Read Detailed Article</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <nav aria-label="Page navigation" className="mt-5">
                        <ul className="pagination">
                            <li className="page-item disabled"><a className="page-link" href="#"><i className="fi fi-rr-angle-small-left"></i></a></li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#"><i className="fi fi-rr-angle-small-right"></i></a></li>
                        </ul>
                    </nav>
                </div>

                <div className="col-lg-4">
                    {/* Sidebar Search */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body text-center p-4">
                            <h6 className="fw-bold mb-3">Search Article</h6>
                            <div className="position-relative">
                                <input type="text" className="form-control" placeholder="Search..." />
                                <i className="fi fi-rr-search position-absolute end-0 top-50 translate-middle-y me-3 text-muted"></i>
                            </div>
                        </div>
                    </div>

                    {/* Popular Posts */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h6 className="fw-bold mb-4">Popular Posts</h6>
                            <ul className="list-unstyled d-grid gap-3">
                                {blogPosts.map(post => (
                                    <li key={post.id} className="d-flex gap-3">
                                        <img src={post.image} className="rounded" alt="" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                        <div>
                                            <h6 className="mb-1 small font-heading"><a href="/pages/blog-details" className="text-dark line-clamp-2">{post.title}</a></h6>
                                            <small className="text-muted">{post.date}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
