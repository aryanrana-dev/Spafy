import mongoose from "mongoose";
import Salon from "../models/Salon.js";


// =====================================================
// CREATE SALON - OWNER
// =====================================================

export const createSalon = async (req, res) => {
    try {
        const {
            name,
            slug,
            ownerPhone,
            address,
            businessHours
        } = req.body;

        // ---------------------------------------------
        // 1. Validate required fields
        // ---------------------------------------------

        if (!name || !slug || !ownerPhone || !address) {
            return res.status(400).json({
                success: false,
                message: "Name, slug, owner phone and address are required"
            });
        }

        // ---------------------------------------------
        // 2. Validate field types
        // ---------------------------------------------

        if (
            typeof name !== "string" ||
            typeof slug !== "string" ||
            typeof ownerPhone !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid field types"
            });
        }

        // ---------------------------------------------
        // 3. Validate strings
        // ---------------------------------------------

        const cleanName = name.trim();
        const cleanSlug = slug.trim().toLowerCase();
        const cleanPhone = ownerPhone.trim();

        if (!cleanName || !cleanSlug || !cleanPhone) {
            return res.status(400).json({
                success: false,
                message: "Fields cannot be empty"
            });
        }

        // ---------------------------------------------
        // 4. Validate slug format
        // ---------------------------------------------

        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

        if (!slugRegex.test(cleanSlug)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slug format"
            });
        }

        // ---------------------------------------------
        // 5. Check duplicate slug
        // ---------------------------------------------

        const existingSalon = await Salon.findOne({
            slug: cleanSlug
        }).select("_id");

        if (existingSalon) {
            return res.status(409).json({
                success: false,
                message: "Salon slug already exists"
            });
        }

        // ---------------------------------------------
        // 6. Create salon
        // ---------------------------------------------
        // IMPORTANT:
        // ownerId comes from authenticated user.
        // NEVER trust ownerId from req.body.

        const salon = await Salon.create({
            name: cleanName,
            slug: cleanSlug,
            ownerId: req.user._id,
            ownerPhone: cleanPhone,
            address,
            businessHours
        });

        return res.status(201).json({
            success: true,
            message: "Salon created successfully",
            salon
        });

    } catch (error) {
        console.error("Create salon error:", error);

        // Handle duplicate key race condition
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Salon slug already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// GET ALL ACTIVE SALONS - PUBLIC
// =====================================================

export const getAllSalons = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // ---------------------------------------------
        // Validate pagination
        // ---------------------------------------------

        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1 ||
            limitNumber > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination values"
            });
        }

        const skip = (pageNumber - 1) * limitNumber;

        // ---------------------------------------------
        // Fetch salons
        // ---------------------------------------------

        const salons = await Salon.find({
            isActive: true
        })
            .select(
                "name slug address businessHours ownerPhone createdAt"
            )
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limitNumber)
            .lean();

        const total = await Salon.countDocuments({
            isActive: true
        });

        return res.status(200).json({
            success: true,
            count: salons.length,
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            salons
        });

    } catch (error) {
        console.error("Get all salons error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// GET SALON BY ID
// =====================================================

export const getSalonById = async (req, res) => {
    try {
        const { id } = req.params;

        // ---------------------------------------------
        // Validate ID
        // ---------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // ---------------------------------------------
        // Find active salon
        // ---------------------------------------------

        const salon = await Salon.findOne({
            _id: id,
            isActive: true
        })
            .select(
                "name slug address businessHours ownerPhone createdAt"
            )
            .lean();

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        return res.status(200).json({
            success: true,
            salon
        });

    } catch (error) {
        console.error("Get salon error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// GET MY SALONS - OWNER
// =====================================================

export const getMySalons = async (req, res) => {
    try {
        const salons = await Salon.find({
            ownerId: req.user._id
        })
            .select(
                "name slug ownerPhone address businessHours isActive createdAt"
            )
            .sort({
                createdAt: -1
            })
            .lean();

        return res.status(200).json({
            success: true,
            count: salons.length,
            salons
        });

    } catch (error) {
        console.error("Get my salons error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// UPDATE SALON - OWNER
// =====================================================

export const updateSalon = async (req, res) => {
    try {
        const { id } = req.params;

        // ---------------------------------------------
        // 1. Validate ID
        // ---------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // ---------------------------------------------
        // 2. Allowed fields
        // ---------------------------------------------

        const allowedFields = [
            "name",
            "ownerPhone",
            "address",
            "businessHours"
        ];

        const receivedFields = Object.keys(req.body);

        const invalidFields = receivedFields.filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid fields: ${invalidFields.join(", ")}`
            });
        }

        if (receivedFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        // ---------------------------------------------
        // 3. Find only owner's salon
        // ---------------------------------------------

        const salon = await Salon.findOne({
            _id: id,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found or access denied"
            });
        }

        // ---------------------------------------------
        // 4. Update allowed fields only
        // ---------------------------------------------

        if (req.body.name !== undefined) {
            if (
                typeof req.body.name !== "string" ||
                !req.body.name.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid salon name"
                });
            }

            salon.name = req.body.name.trim();
        }

        if (req.body.ownerPhone !== undefined) {
            if (
                typeof req.body.ownerPhone !== "string" ||
                !req.body.ownerPhone.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid owner phone"
                });
            }

            salon.ownerPhone = req.body.ownerPhone.trim();
        }

        if (req.body.address !== undefined) {
            salon.address = req.body.address;
        }

        if (req.body.businessHours !== undefined) {
            salon.businessHours = req.body.businessHours;
        }

        await salon.save();

        return res.status(200).json({
            success: true,
            message: "Salon updated successfully",
            salon
        });

    } catch (error) {
        console.error("Update salon error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// =====================================================
// DEACTIVATE SALON - OWNER
// =====================================================

export const deleteSalon = async (req, res) => {
    try {
        const { id } = req.params;

        // ---------------------------------------------
        // 1. Validate ID
        // ---------------------------------------------

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // ---------------------------------------------
        // 2. Find only owner's salon
        // ---------------------------------------------

        const salon = await Salon.findOne({
            _id: id,
            ownerId: req.user._id
        });

        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found or access denied"
            });
        }

        // ---------------------------------------------
        // 3. Already inactive
        // ---------------------------------------------

        if (!salon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Salon is already inactive"
            });
        }

        // ---------------------------------------------
        // 4. Soft delete
        // ---------------------------------------------

        salon.isActive = false;

        await salon.save();

        return res.status(200).json({
            success: true,
            message: "Salon deactivated successfully"
        });

    } catch (error) {
        console.error("Delete salon error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};