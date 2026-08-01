export default function FloatBtn() {
    return (
        <div className="fixed bottom-8 right-8 z-50 hidden md:block">
            <button className="bg-primary-container text-white font-label-md text-label-md uppercase tracking-widest px-6 py-4 rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined">spa</span>
                View Services
            </button>
        </div>
    )
}