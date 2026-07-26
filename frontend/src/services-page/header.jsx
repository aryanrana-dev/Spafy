export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-[#fbf9f4]/80 backdrop-blur-md border-b border-[#d2c4bd]/40">
            <div className="flex justify-between items-center px-6 py-4 w-full">
                <button className="text-[#4e4540] hover:opacity-70 transition-opacity active:scale-95 duration-300">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="font-headline-md tracking-widest text-[#33251d]">SPAFY</h1>
                <button className="text-[#4e4540] hover:opacity-70 transition-opacity active:scale-95 duration-300">
                    <span className="material-symbols-outlined">shopping_bag</span>
                </button>
            </div>
        </header>
    )
}