export default function Accordion() {
    const sections = [
        { id: 'CustomPrimary', title: 'Accordion Custom Primary', class: 'accordion-primary' },
        { id: 'CustomSecondary', title: 'Accordion Custom Secondary', class: 'accordion-secondary' },
        { id: 'WithIcon', title: 'Accordion with icon', hasIcon: true },
        { id: 'Default', title: 'Default Accordion' },
        { id: 'Flush', title: 'Flush', flush: true },
        { id: 'AlwaysOpen', title: 'Always open', stayOpen: true }
    ]

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Accordion</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Accordion</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                {sections.map((section) => (
                    <div key={section.id} className="col-lg-12 mb-4">
                        <h6 className="mb-3">{section.title}</h6>
                        <div
                            className={`accordion ${section.class || ''} ${section.flush ? 'accordion-flush p-2 border bg-light rounded' : ''}`}
                            id={`accordion-${section.id}`}
                        >
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button
                                            className={`accordion-button ${num !== 1 ? 'collapsed' : ''}`}
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${section.id}-${num}`}
                                            aria-expanded={num === 1}
                                        >
                                            {section.hasIcon && (
                                                <i className={`fi fi-rr-${num === 1 ? 'star' : num === 2 ? 'gift' : 'trophy-star'} me-2 scale-2x`}></i>
                                            )}
                                            Accordion Item #{num}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${section.id}-${num}`}
                                        className={`accordion-collapse collapse ${num === 1 ? 'show' : ''}`}
                                        data-bs-parent={!section.stayOpen ? `#accordion-${section.id}` : undefined}
                                    >
                                        <div className="accordion-body">
                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
