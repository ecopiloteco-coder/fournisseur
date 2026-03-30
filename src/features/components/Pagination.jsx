export default function Pagination() {
    const colors = ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'dark'];

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Pagination</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Pagination</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Sizing</h6>
                        </div>
                        <div className="card-body p-4">
                            <nav aria-label="Large pagination">
                                <ul className="pagination pagination-lg mb-4">
                                    <li className="page-item"><a className="page-link" href="#">«</a></li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">»</a></li>
                                </ul>
                            </nav>
                            <nav aria-label="Small pagination">
                                <ul className="pagination pagination-sm">
                                    <li className="page-item"><a className="page-link" href="#">«</a></li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">»</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Rounded Circle</h6>
                        </div>
                        <div className="card-body p-4">
                            <nav aria-label="Rounded pagination">
                                <ul className="pagination pagination-rounded">
                                    <li className="page-item"><a className="page-link" href="#">«</a></li>
                                    <li className="page-item"><a className="page-link" href="#">1</a></li>
                                    <li className="page-item active"><a className="page-link" href="#">2</a></li>
                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                    <li className="page-item"><a className="page-link" href="#">»</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Pagination Colors</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-4">
                                {colors.map((color) => (
                                    <nav key={color} aria-label={`${color} pagination`}>
                                        <ul className={`pagination pagination-rounded pagination-${color}`}>
                                            <li className="page-item"><a className="page-link" href="#">1</a></li>
                                            <li className="page-item active"><a className="page-link" href="#">2</a></li>
                                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                                        </ul>
                                    </nav>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
