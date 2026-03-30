const blogPosts = [
    { id: 1, title: 'Effective Hiring Process for Finding the Right Talent', image: '/assets/images/blog/blog1.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.' },
    { id: 2, title: 'Employee Onboarding and the Power of First Impressions', image: '/assets/images/blog/blog2.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.' },
    { id: 3, title: 'Training and Development for a Skilled Workforce', image: '/assets/images/blog/blog3.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.' },
    { id: 4, title: 'Managing Remote Work with the Right HR Strategy', image: '/assets/images/blog/blog4.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.' },
    { id: 5, title: 'HR Management the Backbone of Modern Organizations', image: '/assets/images/blog/blog5.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.' },
    { id: 6, title: 'Using HR Analytics for Better Decision Making', image: '/assets/images/blog/blog6.webp', date: '17 March 2025', author: 'Roberts', summary: 'Lorem Ipsum is simply dummy text of the printing and typesetting standard dummy text ever since.' },
]

export default function BlogGrid() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Blog Grid</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Blog</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4 mb-5">
                {blogPosts.map(post => (
                    <div key={post.id} className="col-xl-4 col-lg-6">
                        <div className="card h-100 card-action action-elevate border-0 shadow-sm overflow-hidden">
                            <div className="position-relative">
                                <img src={post.image} alt={post.title} className="img-fluid w-100" style={{ height: '200px', objectFit: 'cover' }} />
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 opacity-0 hover-opacity-100 d-flex align-items-center justify-content-center transition-basic">
                                    <a href={`/pages/blog-details`} className="btn btn-secondary btn-icon rounded-circle"><i className="fi fi-rr-arrow-right"></i></a>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-flex gap-3 mb-2 small text-muted">
                                    <span><i className="fi fi-rr-calendar text-primary me-1"></i> {post.date}</span>
                                    <span><i className="fi fi-rr-user text-primary me-1"></i> {post.author}</span>
                                </div>
                                <h5 className="fw-bold mb-3"><a href="/pages/blog-details" className="text-dark">{post.title}</a></h5>
                                <p className="small text-muted mb-0">{post.summary}</p>
                            </div>
                            <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                <a href="/pages/blog-details" className="btn btn-link p-0 text-primary fw-bold small">Read More <i className="fi fi-rr-arrow-small-right ms-1"></i></a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled"><a className="page-link" href="#"><i className="fi fi-rr-angle-small-left"></i></a></li>
                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item"><a className="page-link" href="#"><i className="fi fi-rr-angle-small-right"></i></a></li>
                </ul>
            </nav>
        </>
    )
}
