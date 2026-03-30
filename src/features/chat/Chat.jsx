import { useState } from 'react'

const ChatNavItem = ({ name, text, time, badge, avatar, status, active, onClick }) => (
    <a href="#" className={`chat-nav-item ${active ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); onClick(); }}>
        <div className={`avatar rounded-circle ${status ? `avatar-status-${status}` : ''}`}>
            <img src={`/assets/images/avatar/vector/avatar${avatar}.webp`} alt="" />
        </div>
        <div className="chat-avatar-info">
            <div className="clearfix">
                <h6 className="name small mb-0">{name}</h6>
                <span className="text-muted text-xs">{text}</span>
            </div>
            <div className="text-end">
                <small className="time text-2xs">{time}</small>
                {badge > 0 && <span className="badge badge-sm rounded-pill bg-primary ms-1">{badge}</span>}
            </div>
        </div>
    </a>
)

export default function Chat() {
    const [activeChat, setActiveChat] = useState(2)

    const chats = [
        { id: 1, name: 'Alex Storm', text: 'Typing...', time: '02:21 PM', badge: 12, avatar: '1', status: 'success' },
        { id: 2, name: 'Jordan Miles', text: 'Hey, did you get th..', time: '02:20 PM', badge: 9, avatar: '2', status: 'success' },
        { id: 3, name: 'Liam Carter', text: 'Looks great, bro', time: '02:19 PM', badge: 0, avatar: '3', status: 'danger' },
        { id: 4, name: 'Noah Blake', text: 'Voice message', time: '01:00 PM', badge: 0, avatar: '4', status: 'danger' },
        { id: 5, name: 'Mia Lane', text: 'Thanks a lot!', time: '12:30 PM', badge: 0, avatar: '5', status: '' }
    ]

    return (
        <>
            <div className="card card-body overflow-hidden chat-wrapper p-0 shadow-none border-0" style={{ height: 'calc(100vh - 180px)' }}>
                <div className="sidebar-mobile-overlay"></div>
                <div className="chat-sidebar border-end">
                    <div className="d-flex p-3 align-items-center justify-content-between border-bottom">
                        <form className="d-flex align-items-center shadow-sm rounded-2 position-relative w-100" action="#">
                            <button type="button" className="btn btn-sm border-0 position-absolute start-0 ms-3 p-0">
                                <i className="fi fi-rr-search"></i>
                            </button>
                            <input type="text" className="form-control ps-5" placeholder="Search" />
                        </form>
                    </div>
                    <div className="chat-nav" data-simplebar style={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
                        {chats.map(chat => (
                            <ChatNavItem
                                key={chat.id}
                                {...chat}
                                active={activeChat === chat.id}
                                onClick={() => setActiveChat(chat.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="chat-container d-flex flex-column h-100">
                    <div className="chat-header p-3 border-bottom d-flex align-items-center justify-content-between bg-white">
                        <div className="d-flex align-items-center gap-3">
                            <div className={`avatar rounded-circle avatar-status-${chats.find(c => c.id === activeChat)?.status || 'success'}`}>
                                <img src={`/assets/images/avatar/vector/avatar${activeChat}.webp`} alt="" />
                            </div>
                            <div>
                                <h6 className="name mb-0">{chats.find(c => c.id === activeChat)?.name}</h6>
                                <small className="text-success">Online</small>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-white btn-sm btn-shadow btn-icon waves-effect text-success"><i className="fi fi-rr-phone-flip"></i></button>
                            <button className="btn btn-white btn-sm btn-shadow btn-icon waves-effect text-danger"><i className="fi fi-rr-video-camera-alt"></i></button>
                            <button className="btn btn-white btn-sm btn-shadow btn-icon waves-effect"><i className="fi fi-rr-menu-dots-vertical"></i></button>
                        </div>
                    </div>
                    <div className="chat-body flex-grow-1 p-3 bg-light overflow-auto">
                        <div className="chat-conversation">
                            <div className="chat-divider text-center my-3"><div className="badge bg-white text-muted shadow-sm">Today, 25 july</div></div>

                            <div className="chat-message-right mb-4 text-end">
                                <div className="chat-message-text d-inline-block p-3 rounded-3 bg-primary text-white shadow-sm text-start" style={{ maxWidth: '75%' }}>
                                    <p className="mb-0">Guysss, next year we go to Japan! ✈️🎉</p>
                                    <p className="mb-0 mt-1">Please help with the task distribution like usual later 🙏</p>
                                </div>
                                <div className="chat-time small text-muted mt-1">10:25 PM</div>
                            </div>

                            <div className="chat-message-left mb-4">
                                <div className="chat-message-text d-inline-block p-3 rounded-3 bg-white border shadow-sm" style={{ maxWidth: '75%' }}>
                                    <p className="mb-0">Are you serious??? Gokilll!!</p>
                                    <p className="mb-0 mt-1">Please check the Figma file for me</p>
                                </div>
                                <div className="chat-time small text-muted mt-1">10:30 PM</div>
                            </div>
                        </div>
                    </div>
                    <div className="chat-footer p-3 border-top bg-white">
                        <form className="chat-send-form d-flex gap-2 align-items-center">
                            <input className="form-control chat-input border-0 bg-light shadow-none" placeholder="Type message..." />
                            <div className="d-flex gap-1">
                                <button type="button" className="btn btn-light btn-icon waves-effect"><i className="fi fi-rr-add-image"></i></button>
                                <button type="button" className="btn btn-light btn-icon waves-effect"><i className="fi fi-rr-link-alt"></i></button>
                                <button type="button" className="btn btn-primary px-4 waves-effect waves-light">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
