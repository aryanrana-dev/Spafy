import { useState } from 'react';
import '../services-page/homepage-layout.css';
import './salonLogin.css';

export default function SalonLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/api/auth/google"
    }

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

            <main className="w-full max-w-md relative z-10 animate-in fade-in duration-700">

                {/* Central Minimalist Card */}
                <div className="bg-surface-container-lowest rounded-lg p-10 md:p-12 relative overflow-hidden shadow-[0_4px_20px_rgba(74,59,50,0.05)] border border-outline-variant/30">

                    {/* Top Branding */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
                                Spafy
                            </h1>
                        </div>

                        <h2 className="font-headline-md text-headline-md text-primary-container mt-2">Owner Login</h2>
                        <p className="font-body-md text-on-surface-variant text-center mt-2 opacity-80">
                            Access your professional dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <form action="#" className="space-y-8" onSubmit={handleSubmit}>

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
                                    placeholder="salon@example.com"
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
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-md text-primary placeholder:text-outline-variant/60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-on-surface-variant/60 hover:text-secondary transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex flex-col items-center gap-6">
                            <button
                                type="submit"
                                className="w-full bg-primary-container text-surface-container-lowest font-label-md py-4 rounded transition-all duration-300 hover:bg-primary active:scale-[0.98] shadow-sm tracking-widest uppercase"
                            >
                                Login
                            </button>

                            <div className="relative flex items-center py-2 w-full">
                                <div className="flex-grow border-t border-outline-variant/30"></div>
                                <span className="flex-shrink mx-4 text-outline-variant font-label-sm uppercase tracking-widest text-[10px]">or</span>
                                <div className="flex-grow border-t border-outline-variant/30"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-transparent border border-outline-variant/50 text-primary font-label-md py-4 rounded flex items-center justify-center gap-3 transition-all duration-300 hover:bg-surface-container-low active:scale-[0.98] shadow-sm tracking-widest uppercase"
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

                            <a href="#" className="font-label-sm text-secondary hover:text-primary transition-colors tracking-wide underline underline-offset-4 decoration-secondary/30">
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div>

                {/* Footer Links */}
                <footer className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-on-surface-variant/60">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        <span className="font-label-sm uppercase tracking-widest">Secure Admin Gateway</span>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="font-label-sm text-on-surface-variant/50 hover:text-secondary transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="font-label-sm text-on-surface-variant/50 hover:text-secondary transition-colors">
                            Support
                        </a>
                    </div>
                </footer>

            </main>
        </div>
    );
};