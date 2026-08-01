const StatBar = ({ label, bookings, width, color }) => (
    <div>
        <div className="flex justify-between text-sm mb-2">
            <span>{label}</span>
            <span className="text-[#4e4540]">{bookings} Bookings</span>
        </div>
        <div className="w-full bg-[#f0eee9] h-1 rounded-full overflow-hidden">
            <div className={`${color} h-full rounded-full`} style={{ width }}></div>
        </div>
    </div>
);

const QueueItem = ({ time, name, service }) => (
    <div className="flex items-start gap-4 pb-4 border-b border-[#d2c4bd]/30">
        <div className="w-12 h-12 rounded bg-[#f0eee9] flex flex-col items-center justify-center text-[#33251d]">
            <span className="text-xs font-bold">{time}</span>
            <span className="text-[10px] uppercase">AM</span>
        </div>
        <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-[#4e4540] mt-1 uppercase">{service}</p>
        </div>
    </div>
);

const TableRow = ({ name, initial, service, amount, status }) => (
    <tr className="border-b border-[#d2c4bd]/20 hover:bg-[#f5f3ee]/50 transition-colors">
        <td className="py-4 px-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#d6c5a5] text-[#312711] flex items-center justify-center text-xs">{initial}</div>
            <span>{name}</span>
        </td>
        <td className="py-4 px-2 text-[#4e4540]">{service}</td>
        <td className="py-4 px-2">{amount}</td>
        <td className="py-4 px-2 text-right">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-widest ${status === 'Confirmed' ? 'bg-[#d4e7e1] text-[#51625e]' : 'bg-[#f3e0bf] text-[#483d25]'}`}>
                {status}
            </span>
        </td>
    </tr>
);

export { StatBar, QueueItem, TableRow };