export default function BlogDetails() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Blog Details</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Blog Details</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm overflow-hidden mb-4">
                        <img src="/assets/images/blog/blog1.webp" alt="Blog Details" className="img-fluid w-100" />
                        <div className="card-body p-4 p-md-5">
                            <div className="d-flex gap-3 mb-4 small text-muted">
                                <span><i className="fi fi-rr-calendar text-primary me-1"></i> 17 March 2025</span>
                                <span><i className="fi fi-rr-user text-primary me-1"></i> Roberts</span>
                                <span><i className="fi fi-rr-comment-alt text-primary me-1"></i> 24 Comments</span>
                            </div>

                            <h2 className="fw-bold mb-4">Effective Hiring Process for Finding the Right Talent</h2>

                            <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                            <blockquote className="blockquote bg-light p-4 rounded border-start border-primary border-4 mb-4">
                                <p className="mb-0 small text-dark italic">"Hiring is not just about filling a position; it's about finding the right piece of the puzzle that completes your team's vision."</p>
                                <footer className="blockquote-footer mt-2 small">By <cite title="Source Title">Jane Doe</cite></footer>
                            </blockquote>

                            <p className="mb-4">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                            <h4 className="fw-bold mb-3 mt-5">The Importance of HR Strategy</h4>
                            <p className="mb-4">At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.</p>

                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <img src="/assets/images/blog/blog2.webp" className="img-fluid rounded" alt="" />
                                </div>
                                <div className="col-md-6">
                                    <img src="/assets/images/blog/blog3.webp" className="img-fluid rounded" alt="" />
                                </div>
                            </div>

                            <div className="d-flex flex-wrap gap-2 mt-5 py-4 border-top border-bottom">
                                <span className="fw-bold me-2">Tags:</span>
                                <a href="#" className="badge bg-light text-dark text-decoration-none">Business</a>
                                <a href="#" className="badge bg-light text-dark text-decoration-none">Hiring</a>
                                <a href="#" className="badge bg-light text-dark text-decoration-none">HR Tips</a>
                                <a href="#" className="badge bg-light text-dark text-decoration-none">Strategy</a>
                            </div>

                            <div className="mt-5">
                                <h5 className="fw-bold mb-4">Comments (2)</h5>
                                <div className="d-flex gap-3 mb-4 pb-4 border-bottom">
                                    <img src="/assets/images/avatar/avatar1.webp" className="rounded-circle" alt="" style={{ width: '50px', height: '50px' }} />
                                    <div>
                                        <h6 className="mb-1">Michel Rodrygo <small className="text-muted ms-2">12:30 PM, Today</small></h6>
                                        <p className="small text-muted mb-2">Great article! Very insightful tips for our upcoming recruitment drive. Thanks for sharing.</p>
                                        <a href="#" className="btn btn-link p-0 small text-primary fw-bold">Reply</a>
                                    </div>
                                </div>
                                <div className="d-flex gap-3">
                                    <img src="/assets/images/avatar/avatar2.webp" className="rounded-circle" alt="" style={{ width: '50px', height: '50px' }} />
                                    <div>
                                        <h6 className="mb-1">Sofia Loran <small className="text-muted ms-2">11:15 AM, Yesterday</small></h6>
                                        <p className="small text-muted mb-2">Excellent points on the power of first impressions during onboarding.</p>
                                        <a href="#" className="btn btn-link p-0 small text-primary fw-bold">Reply</a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 pt-4 bg-light p-4 rounded">
                                <h5 className="fw-bold mb-4">Leave a Comment</h5>
                                <form onSubmit={e => e.preventDefault()}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <input type="text" className="form-control" placeholder="Name" />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="email" className="form-control" placeholder="Email" />
                                        </div>
                                        <div className="col-lg-12">
                                            <textarea className="form-control" rows="5" placeholder="Your Comment"></textarea>
                                        </div>
                                        <div className="col-lg-12">
                                            <button className="btn btn-primary" type="submit">Post Comment</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
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
                            <h6 className="fw-bold mb-4">Related Posts</h6>
                            <ul className="list-unstyled d-grid gap-3">
                                <li className="d-flex gap-3">
                                    <img src="/assets/images/blog/blog2.webp" className="rounded" alt="" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                    <div>
                                        <h6 className="mb-1 small font-heading"><a href="#" className="text-dark line-clamp-2">Employee Onboarding and Power</a></h6>
                                        <small className="text-muted">15 March 2025</small>
                                    </div>
                                </li>
                                <li className="d-flex gap-3">
                                    <img src="/assets/images/blog/blog3.webp" className="rounded" alt="" style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                                    <div>
                                        <h6 className="mb-1 small font-heading"><a href="#" className="text-dark line-clamp-2">Training and Development Strategy</a></h6>
                                        <small className="text-muted">10 March 2025</small>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Ad Box */}
                    <div className="card border-0 shadow-sm bg-primary text-white p-4 text-center overflow-hidden position-relative">
                        <div className="position-relative z-index-1">
                            <h5 className="mb-3">Master HR Skills with Ecopilot</h5>
                            <p className="small mb-4 text-white text-opacity-75">Learn from industry experts and advance your career today with our certified courses.</p>
                            <a href="/pages/pricing" className="btn btn-light btn-sm fw-bold">Join Now</a>
                        </div>
                        <div className="position-absolute bottom-0 end-0 me-n3 mb-n3 opacity-25">
                            <i className="fi fi-rr-graduation-cap display-1"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
