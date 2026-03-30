import { useState } from 'react'

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(true)

    const plans = [
        {
            name: 'Free Trial',
            desc: 'Try the course for a limited time at no cost.',
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                { name: 'Full Access', included: false },
                { name: 'Quizzes', included: true },
                { name: 'Community 24/7 Support', included: true },
                { name: 'Downloadable', included: false },
                { name: 'Video Quality 720dpi', included: false },
                { name: 'Source Files', included: false },
                { name: 'Free Appointments', included: true },
                { name: 'Lifetime Access', included: false },
                { name: 'Certificate', included: true }
            ]
        },
        {
            name: 'Basic Package',
            desc: 'Access to core course materials and quizzes.',
            monthlyPrice: 12,
            yearlyPrice: 199,
            popular: true,
            features: [
                { name: 'Full Access', included: true },
                { name: 'Quizzes', included: true },
                { name: 'Community 24/7 Support', included: true },
                { name: 'Downloadable', included: false },
                { name: 'Video Quality 720dpi', included: true },
                { name: 'Source Files', included: true },
                { name: 'Free Appointments', included: true },
                { name: 'Lifetime Access', included: false },
                { name: 'Certificate', included: true }
            ]
        },
        {
            name: 'Pro Plan',
            desc: 'Includes assignments, mentor support, and downloadable resources.',
            monthlyPrice: 39,
            yearlyPrice: 499,
            features: [
                { name: 'Full Access', included: true },
                { name: 'Quizzes', included: true },
                { name: 'Community 24/7 Support', included: true },
                { name: 'Downloadable', included: true },
                { name: 'Video Quality 720dpi', included: true },
                { name: 'Source Files', included: true },
                { name: 'Free Appointments', included: true },
                { name: 'Lifetime Access', included: true },
                { name: 'Certificate', included: true }
            ]
        }
    ]

    return (
        <>
            <div className="app-page-head d-flex align-items-center justify-content-between mb-4">
                <div className="clearfix">
                    <h1 className="app-page-title">Pricing</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Pricing</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="card">
                <div className="card-header border-0 pt-5 px-xxl-5 pb-2 text-center">
                    <h3 className="mb-2">Our Pricing Plans</h3>
                    <p className="text-muted mb-5">Choose the plan that fits your needs</p>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <span className={!isYearly ? 'fw-bold text-dark' : 'text-muted'}>Monthly</span>
                        <div className="form-check form-switch p-0 m-0">
                            <input
                                className="form-check-input mx-0"
                                type="checkbox"
                                role="switch"
                                style={{ width: '3rem', height: '1.5rem', cursor: 'pointer' }}
                                checked={isYearly}
                                onChange={() => setIsYearly(!isYearly)}
                            />
                        </div>
                        <span className={isYearly ? 'fw-bold text-dark' : 'text-muted'}>Annually <span className="badge bg-success-subtle text-success ms-1 small">Save 20%</span></span>
                    </div>
                </div>
                <div className="card-body p-xxl-5">
                    <div className="row g-4">
                        {plans.map((plan) => (
                            <div key={plan.name} className="col-lg-4">
                                <div className={`card h-100 border ${plan.popular ? 'border-primary shadow-sm' : ''} position-relative overflow-hidden`}>
                                    {plan.popular && (
                                        <span className="badge bg-primary position-absolute top-0 end-0 mt-3 me-3">Popular</span>
                                    )}
                                    <div className="card-header border-0 bg-light p-4" style={{ backgroundImage: 'url(/assets/images/background/price.png)', backgroundSize: 'cover' }}>
                                        <h4 className="fw-bold">{plan.name}</h4>
                                        <p className="small text-muted mb-4">{plan.desc}</p>
                                        <div className="display-6 fw-bold text-dark">
                                            ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                            <span className="h6 text-muted ms-1">/ {isYearly ? 'year' : 'month'}</span>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <ul className="list-unstyled d-grid gap-2 small">
                                            {plan.features.map((feat, i) => (
                                                <li key={i} className={`d-flex align-items-center gap-2 ${!feat.included ? 'opacity-50 text-decoration-line-through' : ''}`}>
                                                    <i className={`fi ${feat.included ? 'fi-rr-check-circle text-success' : 'fi-rr-cross-circle text-danger'}`}></i>
                                                    {feat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-footer p-4 pt-0 border-0 bg-transparent text-center">
                                        <button className={`btn ${plan.name === 'Free Trial' ? 'btn-outline-secondary' : 'btn-primary'} w-100 py-2`}>
                                            {plan.name === 'Free Trial' ? 'Current Plan' : 'Select Plan'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
