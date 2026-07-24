export default function ServiceCard({ image, title, category, description }) {
    return (
        <div className="flex items-center gap-6 p-4 rounded-lg bg-[#f5f3ee] hairline-border transition-colors hover:bg-[#e4e2dd]">
            <img className="w-24 h-24 object-cover rounded-md flex-shrink-0" src={image} alt={title} />
            <div className="flex-grow">
                <span className="inline-block px-3 py-1 mb-2 text-label-sm uppercase tracking-widest text-[#33251d] border border-[#d2c4bd] rounded-full">
                    {category}
                </span>
                <h3 className="font-body-lg text-[#33251d] mb-1">{title}</h3>
                <p className="font-body-md text-[#4e4540]">{description}</p>
            </div>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4a3b32] text-white hover:opacity-90 transition-opacity flex-shrink-0">
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    )
}