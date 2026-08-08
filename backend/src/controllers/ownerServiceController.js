

import SalonService from "../models/SalonService.js";

// CREATE SERVICE - Salon Owner
export const createService = async (req, res) => {
    try {
        const {
            salonId,
            masterServiceId,
            price,
            durationMinutes
        } = req.body;

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
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
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

        const service = await SalonService.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

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
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE / DEACTIVATE SERVICE - Salon Owner
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await SalonService.findById(id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
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
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};