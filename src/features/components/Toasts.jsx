import { useEffect, useState } from 'react';

export default function Toasts() {
    const [showLiveToast, setShowLiveToast] = useState(false);

    useEffect(() => {
        // Initialize static toasts
        const toastElements = [].slice.call(document.querySelectorAll('.toast'));
        toastElements.forEach(function (toastEl) {
            window.bootstrap.Toast.getOrCreateInstance(toastEl);
        });
    }, []);

    const toggleLiveToast = () => setShowLiveToast(!showLiveToast);

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Toasts</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Toasts</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Basic Toast</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="toast fade show" role="alert">
                                <div className="toast-header">
                                    <strong className="me-auto">Bootstrap</strong>
                                    <small>11 mins ago</small>
                                    <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                                </div>
                                <div className="toast-body">Hello, world! This is a toast message.</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Live Example</h6>
                        </div>
                        <div className="card-body p-4">
                            <button className="btn btn-primary" onClick={toggleLiveToast}>Show Live Toast</button>
                            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                                <div className={`toast fade ${showLiveToast ? 'show' : 'hide'}`} role="alert">
                                    <div className="toast-header">
                                        <strong className="me-auto">Bootstrap</strong>
                                        <button type="button" className="btn-close" onClick={() => setShowLiveToast(false)}></button>
                                    </div>
                                    <div className="toast-body">Hello, world! This is a live toast.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Custom Colors</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="toast fade show align-items-center text-bg-primary border-0 mb-3" role="alert">
                                <div className="d-flex">
                                    <div className="toast-body">Hello, world! Primary toast.</div>
                                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                                </div>
                            </div>
                            <div className="toast fade show align-items-center text-bg-success border-0" role="alert">
                                <div className="d-flex">
                                    <div className="toast-body">Hello, world! Success toast.</div>
                                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
