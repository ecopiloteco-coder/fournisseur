import { useEffect } from 'react';

export default function Scrollspy() {
    useEffect(() => {
        // Initialize Scrollspy
        const scrollSpyElements = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));
        scrollSpyElements.forEach(function (dataSpyEl) {
            window.bootstrap.ScrollSpy.getOrCreateInstance(dataSpyEl);
        });
    }, []);

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Scrollspy</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Scrollspy</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-xl-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Navbar Scrollspy</h6>
                        </div>
                        <div className="card-body p-4">
                            <nav id="navbar-scrollspy" className="navbar bg-light px-3 mb-3 rounded">
                                <ul className="nav nav-pills">
                                    <li className="nav-item"><a className="nav-link" href="#heading-1">First</a></li>
                                    <li className="nav-item"><a className="nav-link" href="#heading-2">Second</a></li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button">Dropdown</a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#heading-3">Third</a></li>
                                            <li><a className="dropdown-item" href="#heading-4">Fourth</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                            <div data-bs-spy="scroll" data-bs-target="#navbar-scrollspy" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true" className="scrollspy-example p-3 border rounded-2" tabIndex="0" style={{ height: '200px', overflowY: 'auto' }}>
                                <h4 id="heading-1">First Heading</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                <h4 id="heading-2">Second Heading</h4>
                                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                                <h4 id="heading-3">Third Heading</h4>
                                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                <h4 id="heading-4">Fourth Heading</h4>
                                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">List Group Scrollspy</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-4">
                                    <div id="list-scrollspy" className="list-group">
                                        <a className="list-group-item list-group-item-action" href="#list-item-1">Item 1</a>
                                        <a className="list-group-item list-group-item-action" href="#list-item-2">Item 2</a>
                                        <a className="list-group-item list-group-item-action" href="#list-item-3">Item 3</a>
                                        <a className="list-group-item list-group-item-action" href="#list-item-4">Item 4</a>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <div data-bs-spy="scroll" data-bs-target="#list-scrollspy" data-bs-smooth-scroll="true" className="scrollspy-example p-3 border rounded-2" tabIndex="0" style={{ height: '200px', overflowY: 'auto' }}>
                                        <h4 id="list-item-1">Item 1</h4>
                                        <p>Contenu pour l'item 1...</p>
                                        <h4 id="list-item-2">Item 2</h4>
                                        <p>Contenu pour l'item 2...</p>
                                        <h4 id="list-item-3">Item 3</h4>
                                        <p>Contenu pour l'item 3...</p>
                                        <h4 id="list-item-4">Item 4</h4>
                                        <p>Contenu pour l'item 4...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
