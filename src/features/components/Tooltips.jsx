import { useEffect } from 'react';

export default function Tooltips() {
    useEffect(() => {
        // Initialize Tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });

        return () => {
            // Cleanup tooltips on unmount
            tooltipList.forEach(tooltip => tooltip.dispose());
        };
    }, []);

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Tooltips</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Tooltips</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Directions</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-3">
                                <button className="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">Top</button>
                                <button className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">Right</button>
                                <button className="btn btn-success" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">Bottom</button>
                                <button className="btn btn-info" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">Left</button>
                                <button className="btn btn-danger" data-bs-toggle="tooltip" data-bs-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">HTML</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Custom Styles</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-3">
                                <button className="btn btn-outline-primary" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-primary" title="Primary Tooltip">Primary</button>
                                <button className="btn btn-outline-success" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-success" title="Success Tooltip">Success</button>
                                <button className="btn btn-outline-danger" data-bs-toggle="tooltip" data-bs-custom-class="tooltip-danger" title="Danger Tooltip">Danger</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
