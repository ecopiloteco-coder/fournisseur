export default function Carousel() {
    const images = [
        '/assets/images/carousel/carousel1.webp',
        '/assets/images/carousel/carousel2.webp',
        '/assets/images/carousel/carousel3.webp',
        '/assets/images/carousel/carousel4.webp',
        '/assets/images/carousel/carousel5.webp'
    ];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Carousel</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Carousel</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Carousel</h6>
                        </div>
                        <div className="card-body p-4">
                            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {images.slice(0, 3).map((img, idx) => (
                                        <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                                            <img src={img} className="d-block w-100 rounded" alt={`Slide ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon"></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                    <span className="carousel-control-next-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">With Indicators</h6>
                        </div>
                        <div className="card-body p-4">
                            <div id="carouselIndicators" className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="0" className="active"></button>
                                    <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="1"></button>
                                    <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to="2"></button>
                                </div>
                                <div className="carousel-inner">
                                    {images.slice(1, 4).map((img, idx) => (
                                        <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                                            <img src={img} className="d-block w-100 rounded" alt={`Slide ${idx + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">With Captions & Fade</h6>
                        </div>
                        <div className="card-body p-4">
                            <div id="carouselCaptions" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src={images[2]} className="d-block w-100 rounded" alt="..." />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5 className="text-white">First Slide</h5>
                                            <p>Description for first slide.</p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <img src={images[3]} className="d-block w-100 rounded" alt="..." />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5 className="text-white">Second Slide</h5>
                                            <p>Description for second slide.</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselCaptions" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon"></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselCaptions" data-bs-slide="next">
                                    <span className="carousel-control-next-icon"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
