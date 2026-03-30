export default function Card() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Card</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Card</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <h6 className="mb-0">Basic Example</h6>
                </div>
                {[2, 3, 4, 5].map((i) => (
                    <div key={i} className="col-lg-3 col-sm-6">
                        <div className="card h-100">
                            <img src={`/assets/images/card/card${i}.webp`} className="card-img-top" alt="Card cap" />
                            <div className="card-body">
                                <h5 className="card-title mb-2">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" className="btn btn-primary waves-effect waves-light">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <h6 className="mb-0">Kitchen Sink</h6>
                </div>
                {[5, 3, 1, 2].map((i) => (
                    <div key={i} className="col-lg-3 col-sm-6">
                        <div className="card h-100">
                            <img src={`/assets/images/card/card${i}.webp`} className="card-img-top" alt="Card cap" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title.</p>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">An item</li>
                                <li className="list-group-item">A second item</li>
                            </ul>
                            <div className="card-body">
                                <a href="#" className="card-link">Card link</a>
                                <a href="#" className="card-link">Another link</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-6">
                    <div className="card text-center">
                        <div className="card-header">
                            <ul className="nav nav-tabs card-header-tabs">
                                <li className="nav-item"><a className="nav-link active" href="#">Active</a></li>
                                <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                                <li className="nav-item"><a className="nav-link disabled">Disabled</a></li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title mb-2">Special title treatment</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <a href="#" className="btn btn-primary waves-effect waves-light">Go somewhere</a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card text-center">
                        <div className="card-header">
                            <ul className="nav nav-pills card-header-pills">
                                <li className="nav-item"><a className="nav-link active" href="#">Active</a></li>
                                <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                                <li className="nav-item"><a className="nav-link disabled">Disabled</a></li>
                            </ul>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title mb-2">Special title treatment</h5>
                            <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            <a href="#" className="btn btn-primary waves-effect waves-light">Go somewhere</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-12">
                    <h6 className="mb-0">Horizontal</h6>
                </div>
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="row g-0 h-100">
                            <div className="col-md-4">
                                <img src="/assets/images/card/card1.webp" className="img-fluid rounded-start h-100 object-fit-cover" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title mb-2">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                                    <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="row g-0 h-100">
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title mb-2">Card title</h5>
                                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content.</p>
                                    <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <img src="/assets/images/card/card2.webp" className="img-fluid rounded-end h-100 object-fit-cover" alt="..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <h6 className="mb-0">Background and Color</h6>
                </div>
                {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].map((color) => (
                    <div key={color} className="col-lg-3 col-sm-6">
                        <div className={`card text-bg-${color} border-0`}>
                            <div className={`card-header border-bottom border-${color === 'light' ? 'dark' : 'light'} border-opacity-25`}>Header</div>
                            <div className="card-body">
                                <h5 className={`card-title ${color === 'light' ? 'text-dark' : 'text-white'} mb-2`}>{color.charAt(0).toUpperCase() + color.slice(1)} card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
