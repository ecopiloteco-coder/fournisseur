// Auth page variants — reuse Login layout pattern
import { Link } from 'react-router-dom'
function AuthCard({ title, children, bgImage = '/backraund.jpg', logo = '/logo.jpg' }) {
    return (
        <div className="page-layout">
            <div className="auth-wrapper min-vh-100 px-2" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="row g-0 min-vh-100">
                    <div className="col-xl-5 col-lg-6 ms-auto px-sm-4 align-self-center py-4">
                        <div className="card card-body p-4 p-sm-5 maxw-450px m-auto rounded-4 auth-card shadow-lg" data-simplebar>
                            <div className="mb-4 text-center">
                                <Link to="/dashboard"><img className="visible-light" src={logo} alt="Logo" style={{ maxWidth: '160px', height: 'auto' }} /></Link>
                            </div>
                            <div className="text-center mb-4"><h5 className="fw-bold">{title}</h5></div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function LoginCover() {
    return <AuthCard title="Sign In - Cover"><form action="/dashboard"><input type="email" className="form-control mb-3" placeholder="Email" /><input type="password" className="form-control mb-3" placeholder="Password" /><button className="btn btn-primary w-100">Login</button></form></AuthCard>
}
export function LoginFrame() {
    return <AuthCard title="Sign In - Frame"><form action="/dashboard"><input type="email" className="form-control mb-3" placeholder="Email" /><input type="password" className="form-control mb-3" placeholder="Password" /><button className="btn btn-primary w-100">Login</button></form></AuthCard>
}
export function Register() {
    return <AuthCard title="Create Account"><form><input type="text" className="form-control mb-3" placeholder="Full Name" /><input type="email" className="form-control mb-3" placeholder="Email" /><input type="password" className="form-control mb-3" placeholder="Password" /><button className="btn btn-primary w-100">Register</button></form><p className="text-center mt-3">Already have an account? <Link to="/auth/login">Login</Link></p></AuthCard>
}
export function RegisterCover() { return <Register /> }
export function RegisterFrame() { return <Register /> }
export function ForgotPassword() {
    return (
        <AuthCard title="Forgot Password" bgImage="/backraund.jpg" logo="/logo.jpg">
            <form>
                <div className="mb-3">
                    <input type="email" className="form-control form-control-lg border-light-subtle shadow-sm" placeholder="Email Address" />
                </div>
                <button className="btn btn-primary w-100 py-2 fs-6 fw-semibold shadow-sm mb-3" style={{ backgroundColor: '#2b63f1', borderRadius: '8px' }}>Send Reset Link</button>
            </form>
            <p className="text-center mt-2 mb-0">
                <Link to="/auth/login" className="text-decoration-none text-muted small">Back to Login</Link>
            </p>
        </AuthCard>
    )
}
export function ForgotPasswordCover() { return <ForgotPassword /> }
export function ForgotPasswordFrame() { return <ForgotPassword /> }
export function NewPassword() {
    return <AuthCard title="Set New Password"><form><input type="password" className="form-control mb-3" placeholder="New Password" /><input type="password" className="form-control mb-3" placeholder="Confirm Password" /><button className="btn btn-primary w-100">Update Password</button></form></AuthCard>
}
export function NewPasswordCover() { return <NewPassword /> }
export function NewPasswordFrame() { return <NewPassword /> }
