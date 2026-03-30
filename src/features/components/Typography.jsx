export default function Typography() {
    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Typography</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Typography</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Headings</h6>
                        </div>
                        <div className="card-body p-4">
                            <h1>h1. Bootstrap heading</h1>
                            <h2>h2. Bootstrap heading</h2>
                            <h3>h3. Bootstrap heading</h3>
                            <h4>h4. Bootstrap heading</h4>
                            <h5>h5. Bootstrap heading</h5>
                            <h6>h6. Bootstrap heading</h6>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Display Headings</h6>
                        </div>
                        <div className="card-body p-4">
                            <h1 className="display-1">Display 1</h1>
                            <h1 className="display-2">Display 2</h1>
                            <h1 className="display-3">Display 3</h1>
                            <h1 className="display-4">Display 4</h1>
                            <h1 className="display-5">Display 5</h1>
                            <h1 className="display-6">Display 6</h1>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Lead and Inline Elements</h6>
                        </div>
                        <div className="card-body p-4">
                            <p className="lead">This is a lead paragraph. It stands out from regular paragraphs.</p>
                            <p>You can use the mark tag to <mark>highlight</mark> text.</p>
                            <p><del>This line of text is meant to be treated as deleted text.</del></p>
                            <p><s>This line of text is meant to be treated as no longer accurate.</s></p>
                            <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
                            <p><u>This line of text will render as underlined.</u></p>
                            <p><small>This line of text is meant to be treated as fine print.</small></p>
                            <p><strong>This line rendered as bold text.</strong></p>
                            <p><em>This line rendered as italicized text.</em></p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Blockquotes</h6>
                        </div>
                        <div className="card-body p-4">
                            <blockquote className="blockquote">
                                <p>A well-known quote, contained in a blockquote element.</p>
                            </blockquote>
                            <blockquote className="blockquote text-center">
                                <p>A well-known quote, contained in a blockquote element.</p>
                                <cite title="Source Title">Source Title</cite>
                            </blockquote>
                            <blockquote className="blockquote text-end">
                                <p>A well-known quote, contained in a blockquote element.</p>
                                <cite title="Source Title">Source Title</cite>
                            </blockquote>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Lists</h6>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-unstyled">
                                <li>This is a list.</li>
                                <li>It appears completely unstyled.</li>
                                <li>Structurally, it's still a list.</li>
                            </ul>
                            <ul className="list-inline mt-3">
                                <li className="list-inline-item">This is a list item.</li>
                                <li className="list-inline-item">And another one.</li>
                                <li className="list-inline-item">But they're displayed inline.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Description List Alignment</h6>
                        </div>
                        <div className="card-body p-4">
                            <dl className="row mb-0">
                                <dt className="col-sm-3">Description lists</dt>
                                <dd className="col-sm-9">A description list is perfect for defining terms.</dd>
                                <dt className="col-sm-3">Term</dt>
                                <dd className="col-sm-9">Definition for the term.</dd>
                                <dt className="col-sm-3 text-truncate">Truncated term</dt>
                                <dd className="col-sm-9">This can be useful when space is tight.</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
