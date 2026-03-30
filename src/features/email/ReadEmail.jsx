import EmailWrapper from './EmailWrapper';
import { Link } from 'react-router-dom';

export default function ReadEmail() {
    return (
        <EmailWrapper>
            <div className="mail-header">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-white btn-shadow btn-icon waves-effect mail-sidebar-toggler d-lg-none">
                        <i className="fi fi-rs-list"></i>
                    </button>
                    <Link to="/email/inbox" className="btn btn-white btn-shadow btn-icon waves-effect">
                        <i className="fi fi-rr-arrow-small-left"></i>
                    </Link>
                </div>
                <div className="d-flex align-items-center gap-2 ms-auto">
                    <button className="btn btn-white btn-shadow btn-icon waves-effect">
                        <i className="fi fi-rr-trash text-danger"></i>
                    </button>
                    <button className="btn btn-white btn-shadow btn-icon waves-effect">
                        <i className="fi fi-rr-box"></i>
                    </button>
                    <button className="btn btn-white btn-shadow btn-icon waves-effect">
                        <i className="fi fi-rr-menu-dots"></i>
                    </button>
                </div>
            </div>
            <div className="p-4" data-simplebar style={{ maxHeight: 'calc(100vh - 350px)' }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <h4 className="mb-1">💰 You Made a Sale!</h4>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary-subtle text-primary rounded-pill">Inbox</span>
                            <span className="badge bg-warning-subtle text-warning rounded-pill">Important</span>
                        </div>
                    </div>
                    <small className="text-muted">July 21, 2023 at 1:02 AM</small>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="avatar avatar-md rounded-circle bg-success text-white">DW</div>
                    <div>
                        <div className="fw-bold text-dark">DesignWave &lt;sales@designwave.com&gt;</div>
                        <small className="text-muted">to robert brown &lt;robert@gmail.com&gt;</small>
                    </div>
                </div>

                <div className="mail-content text-body mb-4">
                    <p>Hello Robert,</p>
                    <p>Congrats, layoutWave! Your product <strong>“MetroGrid Figma Layout”</strong> has sold for $6.50 USD.</p>
                    <p>You can view the details of this transaction in your dashboard. Keep up the great work!</p>
                    <p>Best regards,<br />The DesignWave Team</p>
                </div>

                <div className="mail-attachments border-top pt-4">
                    <h6 className="mb-3"><i className="fi fi-rr-paperclip me-2"></i> 2 Attachments</h6>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="card card-body p-2 border d-flex flex-row align-items-center gap-3 w-250px">
                            <div className="avatar avatar-sm bg-light text-primary rounded">
                                <i className="fi fi-rr-file-pdf"></i>
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-dark fw-bold text-truncate">Invoice_12345.pdf</div>
                                <small className="text-muted">1.2 MB</small>
                            </div>
                            <button className="btn btn-link ms-auto text-muted p-0"><i className="fi fi-rr-download"></i></button>
                        </div>
                        <div className="card card-body p-2 border d-flex flex-row align-items-center gap-3 w-250px">
                            <div className="avatar avatar-sm bg-light text-info rounded">
                                <i className="fi fi-rr-picture"></i>
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-dark fw-bold text-truncate">transaction-receipt.png</div>
                                <small className="text-muted">856 KB</small>
                            </div>
                            <button className="btn btn-link ms-auto text-muted p-0"><i className="fi fi-rr-download"></i></button>
                        </div>
                    </div>
                </div>

                <div className="mt-5 d-flex gap-2">
                    <button className="btn btn-primary waves-effect waves-light px-4">
                        <i className="fi fi-rr-reply me-2"></i> Reply
                    </button>
                    <button className="btn btn-white btn-shadow waves-effect px-4">
                        <i className="fi fi-rr-share me-2"></i> Forward
                    </button>
                </div>
            </div>
        </EmailWrapper>
    );
}
