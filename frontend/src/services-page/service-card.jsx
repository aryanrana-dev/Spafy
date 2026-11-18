
import { IoAddSharp } from "react-icons/io5";

export default function ServiceCard({ id, _id, salonId, image, title, category, addService, description, duration, price }) {
    const serviceId = _id || id;
    return (
        <div className="flex items-center gap-6 p-4 rounded-lg bg-[#f5f3ee] hairline-border transition-colors hover:bg-[#e4e2dd]">
            <img className="w-24 h-24 object-cover rounded-md flex-shrink-0" src={image} alt={title} />
            <div className="flex-grow">
                <span className="inline-block px-3 py-1 mb-2 text-label-sm uppercase tracking-widest text-[#33251d] border border-[#d2c4bd] rounded-full">
                    {category}
                </span>
                <h3 className="font-body-lg text-[#33251d] mb-1">{title ? title : "Default"}</h3>
                <p className="font-body-md text-[#4e4540]">{description ? description : "Default description"}</p>
            </div>
            <button
                onClick={() => addService({
                    _id: serviceId,
                    id: serviceId,
                    salonId: salonId,
                    title: title,
                    name: title,
                    img: image,
                    duration: duration,
                    price: price
                })}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#4a3b32] text-white hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer"
            >
                <span className="material-symbols-outlined">{<IoAddSharp size={25} />}</span>
            </button>
        </div>
    )
}