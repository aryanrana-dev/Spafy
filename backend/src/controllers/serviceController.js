import mongoose from "mongoose";
import SalonService from "../models/SalonService.js";
import Salon from "../models/Salon.js";

// =====================================================
// GET SERVICES FOR A SALON - PUBLIC
// =====================================================
export const getServicesBySalon = async (req, res) => {
    try {
        const { salonId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(salonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        const services = await SalonService.find({
            salonId,
            isActive: true
        }).populate("masterServiceId");

        return res.status(200).json({
            success: true,
            count: services.length,
            services
        });

    } catch (error) {
        console.error("Get services by salon error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// GET SERVICES BY SALON SLUG - PUBLIC
// =====================================================
export const getServicesBySalonSlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const salon = await Salon.findOne({
            slug: slug.toLowerCase().trim(),
            isActive: true
        }).select("_id name slug");

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        const services = await SalonService.find({
            salonId: salon._id,
            isActive: true
        }).populate("masterServiceId");

        return res.status(200).json({
            success: true,
            salon,
            count: services.length,
            services
        });

    } catch (error) {
        console.error("Get services by slug error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// GET ALL ACTIVE SERVICES (GLOBAL CATALOG) - PUBLIC
// =====================================================
export const getAllServices = async (req, res) => {
    try {
        const services = await SalonService.find({ isActive: true })
            .populate("salonId", "name slug address")
            .populate("masterServiceId");

        return res.status(200).json(services);

    } catch (error) {
        console.error("Get all services error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch services"
        });
    }
};

// =====================================================
// CREATE SALON SERVICE - OWNER ONLY
// =====================================================
export const createSalonService = async (req, res) => {
    try {
        const {
            salonId,
            name,
            price,
            durationMinutes,
            masterServiceId
        } = req.body;

        if (!salonId || !name || price === undefined || !durationMinutes) {
            return res.status(400).json({
                success: false,
                message: "Salon ID, name, price, and duration are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(salonId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // Verify owner owns this salon
        const salon = await Salon.findOne({
            _id: salonId,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to add services to this salon"
            });
        }

        const service = await SalonService.create({
            salonId,
            masterServiceId: masterServiceId && mongoose.Types.ObjectId.isValid(masterServiceId) ? masterServiceId : undefined,
            name: name.trim(),
            price: Number(price),
            durationMinutes: Number(durationMinutes),
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            service
        });

    } catch (error) {
        console.error("Create salon service error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// UPDATE SALON SERVICE - OWNER ONLY
// =====================================================
export const updateSalonService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, durationMinutes, isActive } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID"
            });
        }

        const service = await SalonService.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Verify salon ownership
        const salon = await Salon.findOne({
            _id: service.salonId,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this service"
            });
        }

        if (name !== undefined) service.name = name.trim();
        if (price !== undefined) service.price = Number(price);
        if (durationMinutes !== undefined) service.durationMinutes = Number(durationMinutes);
        if (isActive !== undefined) service.isActive = Boolean(isActive);

        await service.save();

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service
        });

    } catch (error) {
        console.error("Update salon service error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// =====================================================
// DELETE SALON SERVICE - OWNER ONLY
// =====================================================
export const deleteSalonService = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID"
            });
        }

        const service = await SalonService.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const salon = await Salon.findOne({
            _id: service.salonId,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this service"
            });
        }

        service.isActive = false;
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Service disabled successfully"
        });

    } catch (error) {
        console.error("Delete salon service error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
