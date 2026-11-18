import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../services-page/homepage-layout.css';
import './salonLogin.css';
import { useAuthStore } from '../stores/auth-store';

export default function SalonLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [adminSecret, setAdminSecret] = useState('');
    const [urlError, setUrlError] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const errParam = params.get('error');
        if (errParam) {
            window.history.replaceState({}, document.title, window.location.pathname);
            return decodeURIComponent(errParam);
        }
        return '';
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup, isLoading, error, isAuthenticated, user, clearError } = useAuthStore();

    const redirectAfterAuth = (currentUser) => {
        const fromPath = location.state?.from;
        const effectiveRole = currentUser?.role === 'owner' ? 'salon' : currentUser?.role;
        const targetSlug = currentUser?.salonSlug || 'spafy';

        if (effectiveRole === 'salon') {
            navigate(`/${targetSlug}/dashboard`, { replace: true });
        } else if (effectiveRole === 'admin') {
            if (fromPath && fromPath !== '/salon/login' && fromPath !== '/') {
                navigate(fromPath, { replace: true });
            } else {
                navigate(`/${targetSlug}/dashboard`, { replace: true });
            }
        } else {
            // Role: user
            if (fromPath && !fromPath.includes('dashboard') && fromPath !== '/salon/login' && fromPath !== '/') {
                navigate(fromPath, { replace: true });
            } else {
                navigate('/salon/spafy', { replace: true });
            }
        }
    };

    useEffect(() => {
        clearError();
    }, [clearError]);

    useEffect(() => {
        if (isAuthenticated && user) {
            redirectAfterAuth(user);
        }
    }, [isAuthenticated, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUrlError('');
        let res;
        if (isSignUp) {
            res = await signup(fullName, email, password, role, adminSecret);
        } else {
            res = await login(email, password);
        }

        if (res?.success && res?.user) {
            redirectAfterAuth(res.user);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/api/auth/google";
    };

    const handleDemoFill = (demoEmail, demoPassword) => {
        setEmail(demoEmail);
        setPassword(demoPassword);
        setIsSignUp(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-0 bg-background font-body-md text-on-background relative overflow-hidden">

            {/* Background Decorative Images */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute -top-20 -left-20 opacity-[0.03] rotate-12 w-[400px] h-[400px]">
                    <img
                        src="https://lh3.googleusercontent.com/aida/AP1WRLsbXAqytfSYdaA81xEjgvOd7vmw24aYUXiogvddfpMGGH5hKOL-o_d_spqddPF_OPgd8fQ4vhH6rFRo8LSJzks3lqOzSv1ISd_jcMyBNZL269POBNpThPlE-nJdjKmgtBahfIuuefIOkGzteFrDVI04zuOIhcRAc7xQwAF5_5XTL-Fnv48cGz4YqHoFRsxW_6BKh_gSV_XDJUUqt4fkqgx-htiDklLsoqFXQGB2NfVA-sQHSOxlLb1zIbx2"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="absolute -bottom-20 -right-20 opacity-[0.03] -rotate-12 w-[500px] h-[500px]">
                    <img
                        src="https://lh3.googleusercontent.com/aida/AP1WRLveQ_GSeQPfVAncMG25Se3Yq6w_M1owgSg2erMKqD3GkMmHEthyxOhYkxOHk9dUtQ0wGn6IMfJ8Q5xi_ywRHffTSPkHWwQQDl-ORsemu1O0ITJGkv5lax9P5tiP-0OXE4jnNLnxoTsZn9UC6oMvxaUSz06UWv36EuaFtk2--1LOvGDck6daDPUkhKnG6AgH8Yls2dZ3v3T0lhD1_ZIeeYfqZ1LVSuJSJ-kp1PkmlxVyHZklnrqPQjMh8AzC"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            <main className="w-full max-w-md relative z-10 animate-in fade-in duration-700 py-8">

                {/* Central Minimalist Card */}
                <div className="bg-surface-container-lowest rounded-lg p-8 md:p-10 relative overflow-hidden shadow-[0_4px_20px_rgba(74,59,50,0.05)] border border-outline-variant/30">

                    {/* Top Branding */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center justify-center gap-4 mb-2">
                            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
                                Spafy
                            </h1>
                        </div>

                        <h2 className="font-headline-md text-headline-md text-primary-container mt-1">
                            {isSignUp ? "Create Account" : "Welcome Back"}
                        </h2>
                        <p className="font-body-md text-on-surface-variant text-center mt-1 opacity-80 text-xs">
                            {isSignUp
                                ? "Choose your role to get started"
                                : "Log in to access your authorized area"}
                        </p>
                    </div>

                    {(urlError || error) && (
                        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded text-center">
                            {urlError || error}
                        </div>
                    )}

                    {/* Login / Signup Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {isSignUp && (
                            <>
                                {/* Role Selection */}
                                <div className="space-y-1.5">
                                    <label className="font-label-sm text-on-surface-variant uppercase text-[11px]">
                                        Select Role
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setRole("user")}
                                            className={`py-2 px-3 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                                                role === "user"
                                                    ? "border-primary bg-primary text-white shadow-sm"
                                                    : "border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low"
                                            }`}
                                        >
                                            Customer (User)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole("salon")}
                                            className={`py-2 px-3 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                                                role === "salon"
                                                    ? "border-primary bg-primary text-white shadow-sm"
                                                    : "border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low"
                                            }`}
                                        >
                                            Salon Partner
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant/70 italic mt-1">
                                        {role === "user"
                                            ? "• User can access salon pages, bookings, profile & checkout."
                                            : "• Salon can only access the partner dashboard (salonName/dashboard)."}
                                    </p>
                                </div>

                                {/* Full Name Field */}
                                <div className="relative flex flex-col group">
                                    <label htmlFor="fullName" className="font-label-sm text-on-surface-variant uppercase mb-1">
                                        Full Name
                                    </label>
                                    <div className="flex items-center border-b border-secondary-fixed-dim focus-within:border-secondary transition-colors duration-300 py-2">
                                        <span className="material-symbols-outlined text-on-surface-variant mr-3">person</span>
                                        <input
                                            type="text"
                                            id="fullName"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Jane Doe"
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-primary placeholder:text-outline-variant/60"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email Field */}
                        <div className="relative flex flex-col group">
                            <label htmlFor="email" className="font-label-sm text-on-surface-variant uppercase mb-1">
                                Email Address
                            </label>
                            <div className="flex items-center border-b border-secondary-fixed-dim focus-within:border-secondary transition-colors duration-300 py-2">
                                <span className="material-symbols-outlined text-on-surface-variant mr-3">mail</span>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-primary placeholder:text-outline-variant/60"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="relative flex flex-col group">
                            <div className="flex justify-between items-end mb-1">
                                <label htmlFor="password" className="font-label-sm text-on-surface-variant uppercase">
                                    Password
                                </label>
                            </div>
                            <div className="flex items-center border-b border-secondary-fixed-dim focus-within:border-secondary transition-colors duration-300 py-2">
                                <span className="material-symbols-outlined text-on-surface-variant mr-3">lock</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-primary placeholder:text-outline-variant/60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-on-surface-variant/60 hover:text-secondary transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col items-center gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-container text-surface-container-lowest font-label-md py-3.5 rounded transition-all duration-300 hover:bg-primary active:scale-[0.98] shadow-sm tracking-widest uppercase disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    clearError();
                                    setUrlError('');
                                    setIsSignUp(!isSignUp);
                                }}
                                className="text-xs text-secondary hover:underline cursor-pointer"
                            >
                                {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up here"}
                            </button>

                            {/* Quick RBAC Role Demo Logins */}
                            {!isSignUp && (
                                <div className="w-full mt-2 p-3 bg-surface-container-low/60 border border-outline-variant/30 rounded text-left">
                                    <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-on-surface-variant/80 mb-2 flex items-center justify-between">
                                        <span>Quick Test 3 Roles</span>
                                        <span className="text-[9px] lowercase opacity-60">click to populate</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDemoFill("user@spafy.com", "password123")}
                                            className="py-1.5 px-1 bg-white border border-outline-variant/40 rounded text-[11px] text-center font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                            title="Role: user (Customer services & bookings only)"
                                        >
                                            User
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDemoFill("salon@spafy.com", "password123")}
                                            className="py-1.5 px-1 bg-white border border-outline-variant/40 rounded text-[11px] text-center font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                            title="Role: salon (Dashboard only)"
                                        >
                                            Salon
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDemoFill("admin@spafy.com", "password123")}
                                            className="py-1.5 px-1 bg-white border border-outline-variant/40 rounded text-[11px] text-center font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer"
                                            title="Role: admin (Full access)"
                                        >
                                            Admin
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="relative flex items-center py-1 w-full">
                                <div className="flex-grow border-t border-outline-variant/30"></div>
                                <span className="flex-shrink mx-4 text-outline-variant font-label-sm uppercase tracking-widest text-[10px]">or</span>
                                <div className="flex-grow border-t border-outline-variant/30"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-transparent border border-outline-variant/50 text-primary font-label-md py-3 rounded flex items-center justify-center gap-3 transition-all duration-300 hover:bg-surface-container-low active:scale-[0.98] shadow-sm tracking-widest uppercase text-xs cursor-pointer"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer Links */}
                <footer className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-on-surface-variant/60 text-xs">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        <span className="font-label-sm uppercase tracking-widest text-[10px]">Spafy RBAC Protection</span>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="font-label-sm text-[11px] text-on-surface-variant/50 hover:text-secondary transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="font-label-sm text-[11px] text-on-surface-variant/50 hover:text-secondary transition-colors">
                            Support
                        </a>
                    </div>
                </footer>

            </main>
        </div>
    );
};
