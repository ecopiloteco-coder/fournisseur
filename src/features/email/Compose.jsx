import EmailWrapper from './EmailWrapper';

export default function Compose() {
    return (
        <EmailWrapper>
            <div className="mail-header justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-white btn-shadow btn-icon waves-effect mail-sidebar-toggler d-lg-none">
                        <i className="fi fi-rs-list"></i>
                    </button>
                    <h5 className="mb-0">New Message</h5>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-white btn-shadow btn-icon waves-effect">
                        <i className="fi fi-rr-trash text-danger"></i>
                    </button>
                    <button className="btn btn-primary waves-effect waves-light px-4 d-none d-sm-block">
                        Send
                    </button>
                </div>
            </div>
            <div className="p-4" data-simplebar style={{ maxHeight: 'calc(100vh - 350px)' }}>
                <form>
                    <div className="mb-3">
                        <label className="form-label">To:</label>
                        <input type="text" className="form-control" placeholder="Recipient email" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Subject:</label>
                        <input type="text" className="form-control" placeholder="Subject" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Message:</label>
                        <textarea className="form-control" rows="12" placeholder="Write your message here..."></textarea>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-white btn-icon btn-shadow waves-effect" title="Attach file">
                                <i className="fi fi-rr-paperclip"></i>
                            </button>
                            <button type="button" className="btn btn-white btn-icon btn-shadow waves-effect" title="Insert image">
                                <i className="fi fi-rr-picture"></i>
                            </button>
                            <button type="button" className="btn btn-white btn-icon btn-shadow waves-effect" title="Emoji">
                                <i className="fi fi-rr-smile"></i>
                            </button>
                        </div>
                        <button className="btn btn-primary waves-effect waves-light px-4 d-sm-none">
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </EmailWrapper>
    );
}
