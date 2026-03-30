export default function ComingSoon() {
    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 p-4" style={{ background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(/assets/images/background/coming-soon.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="text-center text-white w-lg-600px">
                <div className="mb-4">
                    <img src="/assets/images/logo-text-white.svg" alt="Logo" className="img-fluid" style={{ maxHeight: '50px' }} />
                </div>
                <h1 className="display-4 fw-bold mb-3">Coming Soon</h1>
                <p className="lead mb-5 text-white text-opacity-75">We are currently working hard to bring you something amazing. Stay tuned for our launch!</p>

                <div className="d-flex justify-content-center gap-3 mb-5">
                    <div className="bg-white bg-opacity-10 p-3 rounded min-w-80px">
                        <h3 className="fw-bold mb-0">12</h3>
                        <small className="text-uppercase opacity-75 x-small">Days</small>
                    </div>
                    <div className="bg-white bg-opacity-10 p-3 rounded min-w-80px">
                        <h3 className="fw-bold mb-0">08</h3>
                        <small className="text-uppercase opacity-75 x-small">Hours</small>
                    </div>
                    <div className="bg-white bg-opacity-10 p-3 rounded min-w-80px">
                        <h3 className="fw-bold mb-0">45</h3>
                        <small className="text-uppercase opacity-75 x-small">Mins</small>
                    </div>
                </div>

                <div className="input-group mb-4">
                    <input type="email" className="form-control" placeholder="Enter your email" />
                    <button className="btn btn-primary px-4" type="button">Notify Me</button>
                </div>

                <div className="d-flex justify-content-center gap-3">
                    <a href="#" className="btn btn-icon btn-outline-light rounded-circle"><i className="fi fi-brand-facebook"></i></a>
                    <a href="#" className="btn btn-icon btn-outline-light rounded-circle"><i className="fi fi-brand-twitter"></i></a>
                    <a href="#" className="btn btn-icon btn-outline-light rounded-circle"><i className="fi fi-brand-linkedin"></i></a>
                </div>
            </div>
        </div>
    )
}
