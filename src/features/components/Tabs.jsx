export default function Tabs() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Tabs</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Tabs</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Tab Underline</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="nav nav-underline mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab">Home</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab">Profile</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab">Contact</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel">Lorem Ipsum is simply dummy text...</div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel">It is a long established fact...</div>
                                <div className="tab-pane fade" id="pills-contact" role="tabpanel">Contrary to popular belief...</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Tab Pills</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="nav nav-pills mb-3" id="pills-tab-pills" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#tab-pill-1" type="button" role="tab">Home</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab-pill-2" type="button" role="tab">Profile</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" data-bs-toggle="pill" data-bs-target="#tab-pill-3" type="button" role="tab">Contact</button>
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane fade show active" id="tab-pill-1" role="tabpanel">Contenu de l'onglet Home...</div>
                                <div className="tab-pane fade" id="tab-pill-2" role="tabpanel">Contenu de l'onglet Profile...</div>
                                <div className="tab-pane fade" id="tab-pill-3" role="tabpanel">Contenu de l'onglet Contact...</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Vertical Tabs</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex align-items-start">
                                <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab">Home</button>
                                    <button className="nav-link" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab">Profile</button>
                                    <button className="nav-link" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab">Messages</button>
                                    <button className="nav-link" data-bs-toggle="pill" data-bs-target="#v-pills-settings" type="button" role="tab">Settings</button>
                                </div>
                                <div className="tab-content w-100" id="v-pills-tabContent">
                                    <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel">Contenu Vertical Home...</div>
                                    <div className="tab-pane fade" id="v-pills-profile" role="tabpanel">Contenu Vertical Profile...</div>
                                    <div className="tab-pane fade" id="v-pills-messages" role="tabpanel">Contenu Vertical Messages...</div>
                                    <div className="tab-pane fade" id="v-pills-settings" role="tabpanel">Contenu Vertical Settings...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
