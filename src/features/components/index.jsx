// UI Components
export function Accordion() {
    return (
        <>
            <h1 className="app-page-title">Accordion</h1>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                            Accordion Item #1
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            Ecopilot Admin Template content.
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function Alerts() {
    return (
        <>
            <h1 className="app-page-title">Alerts</h1>
            <div className="alert alert-primary" role="alert">A simple primary alert—check it out!</div>
            <div className="alert alert-success" role="alert">A simple success alert—check it out!</div>
            <div className="alert alert-danger" role="alert">A simple danger alert—check it out!</div>
        </>
    )
}

export function Badge() {
    return (
        <>
            <h1 className="app-page-title">Badge</h1>
            <span className="badge bg-primary">Primary</span>
            <span className="badge bg-secondary ms-1">Secondary</span>
            <span className="badge rounded-pill bg-success ms-1">Success</span>
        </>
    )
}

export function Breadcrumb() {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page">Library</li>
            </ol>
        </nav>
    )
}

export function Buttons() {
    return (
        <>
            <h1 className="app-page-title">Buttons</h1>
            <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-outline-primary">Outline</button>
                <button className="btn btn-subtle-primary">Subtle</button>
            </div>
        </>
    )
}

export function Typography() { return <><h1>Typography</h1><h1>H1 Heading</h1><p>Body text...</p></> }
export function ButtonGroup() { return <><h1>Button Group</h1><div className="btn-group"><button className="btn btn-primary">Left</button><button className="btn btn-primary">Right</button></div></> }
export function Card() { return <><h1>Card</h1><div className="card"><div className="card-body">Simple card content.</div></div></> }
export function Collapse() { return <><h1>Collapse</h1><button className="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#demo">Toggle</button><div className="collapse" id="demo">Visible content.</div></> }
export function Carousel() { return <><h1>Carousel</h1><p>Image slider...</p></> }
export function Dropdowns() { return <><h1>Dropdowns</h1><div className="dropdown"><button className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">Menu</button><ul className="dropdown-menu"><li><a className="dropdown-item" href="#">Item</a></li></ul></div></> }
export function Modal() { return <><h1>Modal</h1><button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">Open Modal</button></> }
export function Navbar() { return <><h1>Navbar</h1><nav className="navbar navbar-expand-lg bg-light"><div className="container-fluid"><a className="navbar-brand" href="#">Navbar</a></div></nav></> }
export function ListGroup() { return <><h1>List Group</h1><ul className="list-group"><li className="list-group-item">An item</li></ul></> }
export function Tabs() { return <><h1>Tabs</h1><ul className="nav nav-tabs"><li className="nav-item"><a className="nav-link active" href="#">Home</a></li></ul></> }
export function Offcanvas() { return <><h1>Offcanvas</h1><button className="btn btn-primary" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample">Open</button></> }
export function Pagination() { return <><h1>Pagination</h1><ul className="pagination"><li className="page-item"><a className="page-link" href="#">1</a></li></ul></> }
export function Popovers() { return <><h1>Popovers</h1><button className="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Popover content">Popover</button></> }
export function Progress() { return <><h1>Progress</h1><div className="progress"><div className="progress-bar" style={{ width: '25%' }}></div></div></> }
export function Scrollspy() { return <><h1>Scrollspy</h1><p>Scroll content...</p></> }
export function Spinners() { return <><h1>Spinners</h1><div className="spinner-border text-primary"></div></> }
export function Toasts() { return <><h1>Toasts</h1><div className="toast show"><div className="toast-header">Toast</div><div className="toast-body">Hello world</div></div></> }
export function Tooltips() { return <><h1>Tooltips</h1><button className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">Tooltip</button></> }
