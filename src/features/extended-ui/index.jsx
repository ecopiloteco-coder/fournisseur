// Extended UI
export function Avatar() {
    return (
        <>
            <h1 className="app-page-title">Avatar</h1>
            <div className="card">
                <div className="card-body d-flex gap-3">
                    <div className="avatar avatar-xl rounded-circle"><img src="/assets/images/avatar/avatar1.webp" alt="" /></div>
                    <div className="avatar avatar-lg rounded-circle"><img src="/assets/images/avatar/avatar2.webp" alt="" /></div>
                    <div className="avatar avatar-md rounded-circle"><img src="/assets/images/avatar/avatar3.webp" alt="" /></div>
                    <div className="avatar avatar-sm rounded-circle"><img src="/assets/images/avatar/avatar4.webp" alt="" /></div>
                    <div className="avatar avatar-xs rounded-circle"><img src="/assets/images/avatar/avatar5.webp" alt="" /></div>
                </div>
            </div>
        </>
    )
}

export function Team() {
    return (
        <>
            <h1 className="app-page-title">Team</h1>
            <div className="row g-4">
                {[1, 2, 3, 4].map(id => (
                    <div className="col-md-3" key={id}>
                        <div className="card text-center p-4">
                            <div className="avatar avatar-xl rounded-circle mx-auto mb-3">
                                <img src={`/assets/images/avatar/avatar${id}.webp`} alt="" />
                            </div>
                            <h6 className="mb-0">Team Member {id}</h6>
                            <small className="text-muted">Developer</small>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export function CardAction() {
    return (
        <>
            <h1 className="app-page-title">Card Action</h1>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0">Action Card</h6>
                    <div className="dropdown">
                        <button className="btn btn-icon btn-sm" data-bs-toggle="dropdown"><i className="fi fi-rr-menu-dots"></i></button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Edit</a></li>
                            <li><a className="dropdown-item" href="#">Delete</a></li>
                        </ul>
                    </div>
                </div>
                <div className="card-body">Content with actions...</div>
            </div>
        </>
    )
}

export function DragAndDrop() { return <><h1>Drag & Drop</h1><p>Library integration required (SortableJS/DndKit)</p></> }
export function Simplebar() { return <><h1>Simplebar</h1><p>Scrollbar content...</p></> }
export function Swiper() { return <><h1>Swiper</h1><p>Slider content...</p></> }
