export default function Footer() {
    return (
        <footer className="bg-white border-t border-outline-variant/30 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center py-12 px-16 max-w-[1200px] mx-auto gap-8">
                <div className="text-[24px] font-serif font-medium text-primary">Spafy</div>
                <nav className="flex gap-6">
                    {['Privacy', 'Terms', 'Sustainability', 'Contact'].map((link) => (
                        <a key={link} className="text-[12px] font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">
                            {link}
                        </a>
                    ))}
                </nav>
                <div className="text-[16px] text-secondary opacity-80">
                    © 2024 Spafy Wellness. All rights reserved.
                </div>
            </div>
        </footer>
    )
}