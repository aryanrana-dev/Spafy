import { useEffect } from "react";
import "./splash.css";
import comb from "../assets/comb.png"
import scissors from "../assets/scissors.png"

const SplashScreen = () => {
    useEffect(() => {
        const handleMouseMove = (e) => {
            const amount = 15;
            const x = (e.clientX / window.innerWidth - 0.5) * amount;
            const y = (e.clientY / window.innerHeight - 0.5) * amount;

            const watermarks = document.querySelectorAll('.watermark-float');
            watermarks.forEach((w, index) => {
                const factor = (index + 1) * 0.5;
                w.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <main className="relative h-screen w-full flex flex-col items-center justify-center bg-[#F7F5F0] overflow-hidden">
                {/* Top-Right Decorative Corner Art (Scissors) */}
                <div className="absolute top-10 right-10 w-64 h-64 md:w-96 md:h-96 opacity-10 pointer-events-none watermark-float translate-x-12 -translate-y-12">
                    <img
                        alt=""
                        className="w-full h-full object-contain filter grayscale brightness-50"
                        src={comb}
                    />
                </div>

                {/* Bottom-Left Decorative Corner Art (Comb) */}
                <div
                    className="absolute bottom-10 left-10 w-64 h-64 md:w-80 md:h-80 opacity-10 pointer-events-none watermark-float -translate-x-12 translate-y-12"
                    style={{ animationDelay: '-4s' }}
                >
                    <img
                        alt=""
                        className="w-full h-full object-contain filter grayscale sepia brightness-50"
                        src={scissors}
                    />
                </div>

                {/* Center Branding Content */}
                <div className="text-center px-[20px] md:px-[64px] z-10">
                    {/* Sub-header */}
                    <div className="mb-4 soft-fade-in" style={{ animationDelay: '0.2s' }}>
                        <p className="font-label-sm text-[12px] text-secondary uppercase tracking-[0.2em]">
                            Greetings by Spafy
                        </p>
                    </div>

                    {/* Main Headline */}
                    <div className="max-w-2xl soft-fade-in" style={{ animationDelay: '0.5s' }}>
                        <h1 className="font-headline-display text-[48px] md:text-[64px] text-primary leading-tight">
                            Book. Relax. Glow.
                        </h1>
                    </div>

                    {/* Decorative Flourish */}
                    <div className="mt-8 flex justify-center soft-fade-in" style={{ animationDelay: '0.8s' }}>
                        <div className="w-12 h-[1px] bg-outline-variant/40"></div>
                    </div>
                </div>

                {/* Bottom Transition Cue */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-outline-variant/10">
                    <div className="h-full bg-tertiary-fixed-dim animate-progress" style={{ width: '30%' }}></div>
                </div>

                {/* Subtle Atmospheric Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
            </main>
        </>
    );
};
export default SplashScreen