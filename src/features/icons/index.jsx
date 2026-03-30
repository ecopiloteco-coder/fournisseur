// Icons
export function FlatIcon() {
    return (
        <>
            <h1 className="app-page-title">FlatIcon</h1>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-4 text-center">
                        <div className="p-3 border rounded">
                            <i className="fi fi-rr-apps scale-3x"></i>
                            <div className="mt-2 text-2xs">fi-rr-apps</div>
                        </div>
                        <div className="p-3 border rounded">
                            <i className="fi fi-rr-user scale-3x"></i>
                            <div className="mt-2 text-2xs">fi-rr-user</div>
                        </div>
                        <div className="p-3 border rounded">
                            <i className="fi fi-rr-envelope scale-3x"></i>
                            <div className="mt-2 text-2xs">fi-rr-envelope</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function Lucide() {
    return (
        <>
            <h1 className="app-page-title">Lucide</h1>
            <p>Lucide icons are supported via class names or as SVG components.</p>
        </>
    )
}

export function FontAwesome() {
    return (
        <>
            <h1 className="app-page-title">Font Awesome</h1>
            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-4 text-center">
                        <div className="p-3 border rounded">
                            <i className="fa fa-home fa-3x"></i>
                            <div className="mt-2 text-2xs">fa-home</div>
                        </div>
                        <div className="p-3 border rounded">
                            <i className="fa fa-search fa-3x"></i>
                            <div className="mt-2 text-2xs">fa-search</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
