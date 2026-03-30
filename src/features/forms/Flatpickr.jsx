import { useEffect } from 'react';

export default function Flatpickr() {
    useEffect(() => {
        if (!window.flatpickr) return;

        const basic = window.flatpickr('.flatpickr-basic', { dateFormat: "Y-m-d H:i", disableMobile: true });
        const datetime = window.flatpickr('.flatpickr-datetime', { dateFormat: "Y-m-d H:i", enableTime: true, disableMobile: true });
        const time = window.flatpickr('.flatpickr-time', { noCalendar: true, enableTime: true, disableMobile: true });
        const range = window.flatpickr('.flatpickr-range', { mode: 'range' });
        const multiple = window.flatpickr('.flatpickr-multiple', { mode: 'multiple' });
        const inline = window.flatpickr('.flatpickr-inline', { enableTime: true, dateFormat: "Y-m-d H:i", inline: true });

        return () => {
            [basic, datetime, time, range, multiple, inline].forEach(fp => fp && fp.destroy && fp.destroy());
        };
    }, []);

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Flatpickr</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Flatpickr</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header border-0 bg-transparent pt-4 px-4">
                            <h6 className="card-title mb-0">Flatpickr Examples</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="row">
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <label className="form-label">Date Picker</label>
                                    <input type="text" className="form-control flatpickr-basic" id="flatpickr_basic" placeholder="Select Date" />
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <label className="form-label">Datetime Picker</label>
                                    <input type="text" className="form-control flatpickr-datetime" id="flatpickr_datetime" placeholder="Select Datetime" />
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <label className="form-label">Time Picker</label>
                                    <input type="text" className="form-control flatpickr-time" id="flatpickr_time" placeholder="Select Time" />
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <label className="form-label">Range Picker</label>
                                    <input type="text" className="form-control flatpickr-range" id="flatpickr_range" placeholder="Select Range" />
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <label className="form-label">Multiple Dates</label>
                                    <input type="text" className="form-control flatpickr-multiple" id="flatpickr_multiple_dates" placeholder="Select Multiple" />
                                </div>
                                <div className="col-lg-4 col-md-6 mb-4">
                                    <label className="form-label">Inline Picker</label>
                                    <div className="flatpickr-inline" id="flatpickr_inline"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
