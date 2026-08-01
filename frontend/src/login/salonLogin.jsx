import { useState } from 'react';
import '../services-page/homepage-layout.css';
import './salonLogin.css';

export default function SalonLogin() {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
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