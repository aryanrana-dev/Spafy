import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Salon from "../models/Salon.js";
import Payment from "../models/Payment.js";

// =====================================================
// GET OWNER DASHBOARD METRICS - OWNER ONLY
// =====================================================
export const getDashboardMetrics = async (req, res) => {
    try {
        const ownerId = req.user._id;

        // Find all salons owned by this owner
        const salons = await Salon.find({ ownerId }).select("_id name");
        const salonIds = salons.map((s) => s._id);

        if (salonIds.length === 0) {
            return res.status(200).json({
                success: true,
                hasSalon: false,
                metrics: {
                    totalBookingsToday: 0,
                    totalBookingsAllTime: 0,
                    totalRevenue: 0,
                    todayRevenue: 0,
                    topServicesToday: [],
                    queue: [],
                    recentTransactions: []
                }
            });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        // 1. Booking counts
        const [totalBookingsToday, totalBookingsAllTime] = await Promise.all([
            Booking.countDocuments({
                salonId: { $in: salonIds },
                appointmentDate: { $gte: startOfDay, $lt: endOfDay },
                status: { $ne: "cancelled" }
            }),
            Booking.countDocuments({
                salonId: { $in: salonIds },
                status: { $ne: "cancelled" }
            })
        ]);

        // 2. Revenue calculations
        const revenueAgg = await Payment.aggregate([
            {
                $match: {
                    salonId: { $in: salonIds },
                    status: "success"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ]);
        const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

        const todayRevenueAgg = await Payment.aggregate([
            {
                $match: {
                    salonId: { $in: salonIds },
                    status: "success",
                    createdAt: { $gte: startOfDay, $lt: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    todayRevenue: { $sum: "$amount" }
                }
            }
        ]);
        const todayRevenue = todayRevenueAgg[0]?.todayRevenue || 0;

        // 3. Queue (Today's confirmed/pending appointments in order)
        const queue = await Booking.find({
            salonId: { $in: salonIds },
            appointmentDate: { $gte: startOfDay, $lt: endOfDay },
            status: { $in: ["confirmed", "payment_pending"] }
        })
            .populate("userId", "name phone")
            .populate("salonServiceId", "name price durationMinutes")
            .sort({ startTime: 1 })
            .limit(10)
            .lean();

        // 4. Top Services Today
        const topServicesAgg = await Booking.aggregate([
            {
                $match: {
                    salonId: { $in: salonIds },
                    appointmentDate: { $gte: startOfDay, $lt: endOfDay },
                    status: { $ne: "cancelled" }
                }
            },
            {
                $group: {
                    _id: "$salonServiceId",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "salonservices",
                    localField: "_id",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            { $unwind: "$serviceDetails" },
            {
                $project: {
                    serviceId: "$_id",
                    name: "$serviceDetails.name",
                    price: "$serviceDetails.price",
                    count: 1
                }
            }
        ]);

        // 5. Recent Transactions
        const recentTransactions = await Booking.find({
            salonId: { $in: salonIds }
        })
            .populate("userId", "name email")
            .populate("salonServiceId", "name price")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        return res.status(200).json({
            success: true,
            hasSalon: true,
            metrics: {
                totalBookingsToday,
                totalBookingsAllTime,
                totalRevenue,
                todayRevenue,
                topServicesToday: topServicesAgg,
                queue,
                recentTransactions
            }
        });

    } catch (error) {
        console.error("Dashboard metrics error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
