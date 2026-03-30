import { useEffect } from 'react';

export default function Tagify() {
    useEffect(() => {
        if (!window.Tagify) return;

        const inputs = document.querySelectorAll('.tagify-input');
        const tagifies = [];
        inputs.forEach(el => tagifies.push(new window.Tagify(el)));

        const usersListEl = document.querySelector('.tagify-users-list');
        if (usersListEl) {
            tagifies.push(new window.Tagify(usersListEl, {
                whitelist: [
                    { value: 1, name: "Sophia Hall", avatar: "/assets/images/avatar/avatar1.webp", email: "sophia@example.com" },
                    { value: 2, name: "Emma Smith", avatar: "/assets/images/avatar/avatar2.webp", email: "emma@example.com" }
                ],
                dropdown: { enabled: 0 }
            }));
        }

        const advanceEl = document.querySelector('.tagify-advance-options');
        if (advanceEl) {
            tagifies.push(new window.Tagify(advanceEl, {
                maxTags: 6,
                dropdown: { enabled: 1 }
            }));
        }

        return () => {
            tagifies.forEach(t => t.destroy());
        };
    }, []);

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Tagify</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Tagify</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Tagify Examples</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-lg-12 mb-5">
                                    <label className="form-label">Basic Tagify</label>
                                    <input className="form-control tagify-input" defaultValue="sales@example.com, info@example.com, support@example.com" />
                                </div>
                                <div className="col-lg-12 mb-5">
                                    <label className="form-label">Users List</label>
                                    <input className="form-control tagify-users-list" defaultValue="Sophia Hall, Olivia Clark" />
                                </div>
                                <div className="col-lg-12 mb-4">
                                    <label className="form-label">Advance Options</label>
                                    <input className="form-control tagify-advance-options" defaultValue='[{"value":"Michael Davis"}, {"value":"James Anderson"}]' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
