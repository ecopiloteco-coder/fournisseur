export default function Buttons() {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
    const socials = ['facebook', 'twitter', 'github', 'instagram', 'youtube', 'linkedin', 'whatsapp', 'pinterest', 'snapchat', 'telegram', 'tiktok', 'reddit']

    const getSocialIcon = (network) => {
        if (network === 'twitter') return 'fa-brands fa-x-twitter'
        return `fa-brands fa-${network}`
    }

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Buttons</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Buttons</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Button Variants</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {variants.map(v => (
                                    <button key={v} type="button" className={`btn btn-${v} waves-effect waves-light`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                                ))}
                                <button type="button" className="btn btn-white waves-effect waves-light">White</button>
                                <button type="button" className="btn btn-link">Link</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Outline Buttons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {variants.map(v => (
                                    <button key={v} type="button" className={`btn btn-outline-${v} waves-effect waves-light`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Subtle Buttons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {variants.map(v => (
                                    <button key={v} type="button" className={`btn btn-subtle-${v} waves-effect waves-light`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Rounded Pill</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-2">
                                {variants.map(v => (
                                    <button key={v} type="button" className={`btn btn-subtle-${v} rounded-pill waves-effect waves-light`}>{v.charAt(0).toUpperCase() + v.slice(1)}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Social Buttons</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-wrap gap-3">
                                {socials.map(s => (
                                    <div key={s} className="d-flex gap-2">
                                        <button className={`btn btn-icon btn-${s} waves-effect waves-light`}><i className={getSocialIcon(s)}></i></button>
                                        <button className={`btn btn-icon btn-subtle-${s} waves-effect waves-light`}><i className={getSocialIcon(s)}></i></button>
                                        <button className={`btn btn-icon btn-outline-${s} waves-effect waves-light`}><i className={getSocialIcon(s)}></i></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Button Sizes</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                <button className="btn btn-primary btn-lg">Large Button</button>
                                <button className="btn btn-secondary">Default Button</button>
                                <button className="btn btn-info btn-sm">Small Button</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Block Level</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary" type="button">Block primary button</button>
                                <button className="btn btn-secondary" type="button">Block secondary button</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
