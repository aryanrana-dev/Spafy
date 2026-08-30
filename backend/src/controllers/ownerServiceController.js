import SalonService from "../models/SalonService.js";
import Salon from "../models/Salon.js";

// CREATE SERVICE - Salon Owner
export const createService = async (req, res) => {
    try {
        const {
            salonId,
            masterServiceId,
            price,
            durationMinutes
        } = req.body;

        // Validate required fields
        if (
            !salonId ||
            !masterServiceId ||
            price == null ||
            !durationMinutes
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check salon ownership
        const salon = await Salon.findOne({
            _id: salonId,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You do not own this salon"
            });
        }

        // Create service
        const service = await SalonService.create({
            salonId,
            masterServiceId,
            price,
            durationMinutes,
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Service created successfully",
            service
        });

    } catch (error) {
        console.error("Create service error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// UPDATE SERVICE - Salon Owner
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            price,
            durationMinutes,
            isActive
        } = req.body;

        // Find service
        const service = await SalonService.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Check salon ownership
        const salon = await Salon.findOne({
            _id: service.salonId,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You do not own this salon"
            });
        }

        // Update fields
        if (price !== undefined) {
            service.price = price;
        }

        if (durationMinutes !== undefined) {
            service.durationMinutes = durationMinutes;
        }

        if (isActive !== undefined) {
            service.isActive = isActive;
        }

        await service.save();

        return res.status(200).json({
            success: true,
            message: "Service updated successfully",
            service
        });

    } catch (error) {
        console.error("Update service error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// DELETE / DEACTIVATE SERVICE - Salon Owner
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // Find service
        const service = await SalonService.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        // Check salon ownership
        const salon = await Salon.findOne({
            _id: service.salonId,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(403).json({
                success: false,
                message: "You do not own this salon"
            });
        }

        // Soft delete
        service.isActive = false;

        await service.save();

        return res.status(200).json({
            success: true,
            message: "Service deactivated successfully"
        });

    } catch (error) {
        console.error("Delete service error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};