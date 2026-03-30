function PageStub({ title, subtitle, icon }) {
    return (
        <>
            <div className="app-page-head d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
                <div>
                    <h1 className="app-page-title">{title}</h1>
                    <span>{subtitle}</span>
                </div>
            </div>
            <div className="card">
                <div className="card-body text-center py-5">
                    <div className="avatar avatar-xl bg-primary bg-opacity-10 rounded-circle text-primary mx-auto mb-3">
                        <i className={`fi ${icon} fs-4`}></i>
                    </div>
                    <h5>{title}</h5>
                    <p className="text-muted">This page content is loaded from the template assets.</p>
                </div>
            </div>
        </>
    )
}

export default PageStub
