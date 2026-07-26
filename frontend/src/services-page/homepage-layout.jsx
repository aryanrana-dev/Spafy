import React, { useState, useEffect } from 'react';
import Hero from './hero';
import BottomNav from './bottom-nav';
import Header from './header';
import ServiceCard from './service-card';
import "./homepage-layout.css";

export default function HomepageLayout() {
    return (<>
        <div className="min-h-screen pb-32 animate-in fade-in duration-700">
            <Header />

            <main className="pt-20">
                <Hero />

                <section className="container mx-auto max-w-[1200px] px-6 md:px-16 py-12">
                    <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
                        <ServiceCard
                            category="MASSAGE"
                            title="Signature Rejuvenation Massage"
                            description="A holistic 60-minute therapy."
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCFfKipIf2VyiZEQ8S_bakF7OvPY9IE04W0W3bxfvLysG5t-_rzamvsYnXYFTAS_KhHdvudwgCxZmL1uRnSDVOo9EaiJvwxC5vcSTCgEb4Uo-wlulLGkfysAaRKnxt3jG9x_cTQolIS30tK515f90XLsFYDe2KajUPXAlVCJhQ3kt5m0AU-QA-eQ698wdHWrFkCXLo2xkEFPB1NWyoQMNxUCjFvvwoM7J8uMkGulmscOtdqvQsyb98D4m5gKlwJvNDYd192plamArTJ"
                        />
                        <ServiceCard
                            category="FACIAL"
                            title="Luminous Gold Facial"
                            description="Deep cleansing with gold-infused serums."
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCa-NQt0f388FP8_EscD3k9-RvgmjGy2rL5HkUlYXpSG1s9F5Ah2EYFTd3d6E6tmZ0pxFZldSx0jlrLi0UcNLb68MVuP5902Xuzh0n2qkl3GkqRj3f1c9JFUHEvD91pM3M1N_3H28ipHY80Fg_l72M7TecTIWnJrcfjC54IphynmxfeMhIZoJIPNh9ds15fWG3PfaZ2XEwFz1f0b9KhNTEzBVNpDS6giHLHsGZ1Jra6yHBgwnx5jKr76kJ-TVDo67oIUoBoOTF2xNa0"
                        />
                        <ServiceCard
                            category="HAIR"
                            title="Artisanal Hair Styling"
                            description="Precision cut and signature blow-out."
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAe7bK7yJN7dxzV-SFAhiBTAgoGjpgd6vwKW3gGRzkcwz0jPkIit2h6inJIdkHEXF_XAl5_L5qq5XzPv3Z8sulH2qaE3w7S-MDZvNymaFuK29VoEa6PzNnZYLMeye1_jiCg_H7VN_7Fe4KmOePSLalxqaFdxV1_1bH7CmYmAwQsgJAf4n-K0bCSSgMXQO9yGsYm1RjLD1ryKkYqO_FmGRQ4mDEhCBBwqb85-yAcVKvY17HjjBR-YpX67ByVWK2Pm7vC-mU2cVR0XGss"
                        />
                        <ServiceCard
                            category="NAILS"
                            title="Bronze Glow Manicure"
                            description="Luxury nail care with high-shine finish."
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuByDLVyjYkgXYhC09ZeLb1HJ8LnqVL9iOgoajJ7Vxk7cc_l1Sf37UtLMLSnSU3C1ZMFUZziWeyVLItmZXt1vZcuWlFW4ylyB2e5LGvcIPpeV5UUQK8D5qLBGW2ID8PYhjZ7JJr2ntWsAi78rGDB4qSEU0HOBy1P3984m-IkVACJmQ1XWNN5pmJNbK3E_hFph_EL1zHEPgr4FQ5PWz7zQmYftC8M5QZIk5xrQOsNtOcbyqp0tVxQ08Ki3M3An1zCKy4TQ1URK-FDgsSn"
                        />
                    </div>
                </section>
            </main>

            <BottomNav />

            {/* Floating Action Button (Desktop Only) */}
            <div className="fixed bottom-8 right-8 z-50 hidden md:block">
                <button className="bg-[#4a3b32] text-white font-label-md uppercase tracking-widest px-6 py-4 rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                    <span className="material-symbols-outlined">spa</span>
                    View Services
                </button>
            </div>
        </div>
    </>)
}