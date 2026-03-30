import { useEffect } from 'react';

export default function Popovers() {
    useEffect(() => {
        // Initialize Bootstrap popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new window.bootstrap.Popover(popoverTriggerEl);
        });

        return () => {
            // Cleanup popovers on unmount
            popoverList.forEach(popover => popover.dispose());
        };
    }, []);

    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Popovers</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Popovers</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Directions</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                <button type="button" className="btn btn-primary" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Popover on top">Popover on top</button>
                                <button type="button" className="btn btn-primary" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Popover on right">Popover on right</button>
                                <button type="button" className="btn btn-primary" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="Popover on bottom">Popover on bottom</button>
                                <button type="button" className="btn btn-primary" data-bs-toggle="popover" data-bs-placement="left" data-bs-content="Popover on left">Popover on left</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Custom Colors</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`btn btn-${color}`}
                                        data-bs-toggle="popover"
                                        data-bs-custom-class={`popover-${color}`}
                                        data-bs-title={`${color.charAt(0).toUpperCase() + color.slice(1)} Popover`}
                                        data-bs-content="This is a custom colored popover.">
                                        {color.charAt(0).toUpperCase() + color.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
