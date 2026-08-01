import './dashboard-layout.css';
import Sidebar from './sidebar';
import { Header } from './header';
import { MetricCard, AppointmentCard } from './dashboard-card';
import { StatBar, QueueItem, TableRow } from './helper';

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-[#fbf9f4]">
            {/* Mobile Overlay */}
            <div className="fixed inset-0 bg-[#1b1c19]/50 z-40 hidden md:hidden" />

            <Sidebar />

            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <Header />

                <div className="p-6 md:p-16 flex-1 overflow-y-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-serif text-[#1b1c19] mb-2 tracking-tight">Welcome back, Eleanor</h2>
                        <p className="text-base text-[#4e4540]">Here is an overview of your sanctuary's performance today.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Row 1 */}
                        <MetricCard title="Total Bookings" value="24" trend="+12% from yesterday" icon="calendar_month">
                            <select className="bg-transparent border-b border-[#d6c5a5] text-xs font-medium text-[#1b1c19] focus:outline-none">
                                <option>Today</option>
                                <option>Week</option>
                            </select>
                        </MetricCard>

                        <MetricCard title="Advance Payments" value="$1,240.00" subtext="View Payments" icon="account_balance_wallet" />

                        <AppointmentCard />

                        {/* Row 2: Stats & Queue */}
                        <div className="bg-white rounded-xl p-6 hairline-border md:col-span-2">
                            <h3 className="text-sm font-medium text-[#4e4540] uppercase tracking-wider mb-6">Top Services Today</h3>
                            <div className="space-y-6">
                                <StatBar label="Deep Tissue Massage" bookings="12" width="60%" color="bg-[#4a3b32]" />
                                <StatBar label="Signature Facial" bookings="8" width="40%" color="bg-[#51625e]" />
                                <StatBar label="Aromatherapy Soak" bookings="4" width="20%" color="bg-[#483d25]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 hairline-border flex flex-col">
                            <h3 className="text-sm font-medium text-[#4e4540] uppercase tracking-wider mb-6">Queue</h3>
                            <div className="space-y-4 flex-1">
                                <QueueItem time="11:00" name="Michael Chen" service="Deep Tissue" />
                                <QueueItem time="11:45" name="Emma Watson" service="Couples Massage" />
                            </div>
                            <button className="mt-4 text-xs font-medium text-[#33251d] uppercase tracking-widest hover:text-[#51625e]">
                                View Full Schedule →
                            </button>
                        </div>

                        {/* Row 3: Table */}
                        <div className="bg-white rounded-xl p-6 hairline-border md:col-span-3 overflow-x-auto">
                            <h3 className="text-sm font-medium text-[#4e4540] uppercase tracking-wider mb-6">Recent Transactions</h3>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[#d2c4bd]/40 text-xs text-[#4e4540] uppercase tracking-wider">
                                        <th className="py-4 px-2 font-normal">Client</th>
                                        <th className="py-4 px-2 font-normal">Service</th>
                                        <th className="py-4 px-2 font-normal">Amount</th>
                                        <th className="py-4 px-2 font-normal text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-[#1b1c19]">
                                    <TableRow name="Sarah Jenkins" initial="SJ" service="Signature Facial" amount="$120.00" status="Confirmed" />
                                    <TableRow name="Michael Chen" initial="MC" service="Deep Tissue" amount="$95.00" status="Pending" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};