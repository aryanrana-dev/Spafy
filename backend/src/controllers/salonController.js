// =====================================================
// CREATE SALON - OWNER
// =====================================================

export const createSalon = async (req, res) => {
    try {
        // Get salon data from request body
        const {
            name,
            slug,
            ownerPhone,
            address,
            businessHours
        } = req.body;

        // Validate required fields
        if (!name || !slug || !ownerPhone || !address) {
            return res.status(400).json({
                success: false,
                message: "Name, slug, owner phone and address are required"
            });
        }

        // Validate field types
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

        // Clean user input
        const cleanName = name.trim();
        const cleanSlug = slug.trim().toLowerCase();
        const cleanPhone = ownerPhone.trim();

        // Make sure cleaned fields are not empty
        if (!cleanName || !cleanSlug || !cleanPhone) {
            return res.status(400).json({
                success: false,
                message: "Fields cannot be empty"
            });
        }

        // Validate URL-friendly slug format
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

        if (!slugRegex.test(cleanSlug)) {
            return res.status(400).json({
                success: false,
                message: "Invalid slug format"
            });
        }

        // Check if slug already exists
        const existingSalon = await Salon.findOne({
            slug: cleanSlug
        }).select("_id");

        if (existingSalon) {
            return res.status(409).json({
                success: false,
                message: "Salon slug already exists"
            });
        }

        // Create salon
        // ownerId comes from authenticated user
        // Never trust ownerId from req.body
        const salon = await Salon.create({
            name: cleanName,
            slug: cleanSlug,
            ownerId: req.user._id,
            ownerPhone: cleanPhone,
            address,
            businessHours
        });

        // Return only required public salon data
        return res.status(201).json({
            success: true,
            message: "Salon created successfully",
            salon: {
                _id: salon._id,
                name: salon.name,
                slug: salon.slug,
                address: salon.address,
                businessHours: salon.businessHours,
                isActive: salon.isActive,
                createdAt: salon.createdAt
            }
        });

    } catch (error) {
        console.error("Create salon error:", error);

        // Handle duplicate slug race condition
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Salon slug already exists"
            });
        }

        // Handle unexpected server errors
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
        // Get pagination values
        const {
            page = 1,
            limit = 10
        } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Validate pagination
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

        // Calculate documents to skip
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch only active salons
        // Do not expose private owner information
        const salons = await Salon.find({
            isActive: true
        })
            .select(
                "name slug address businessHours createdAt"
            )
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(limitNumber)
            .lean();

        // Get total active salons
        const total = await Salon.countDocuments({
            isActive: true
        });

        // Return paginated salons
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

        // Handle unexpected server errors
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// =====================================================
// GET SALON BY ID - PUBLIC
// =====================================================

export const getSalonById = async (req, res) => {
    try {
        // Get salon ID from URL parameters
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // Find only an active salon
        // Private owner information is not exposed
        const salon = await Salon.findOne({
            _id: id,
            isActive: true
        })
            .select(
                "name slug address businessHours createdAt"
            )
            .lean();

        // Salon does not exist or is inactive
        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        // Return salon details
        return res.status(200).json({
            success: true,
            salon
        });

    } catch (error) {
        console.error("Get salon by ID error:", error);

        // Handle unexpected server errors
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
        // Find only salons owned by the logged-in user
        // req.user._id comes from authentication middleware
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

        // Return owner's salons
        return res.status(200).json({
            success: true,
            count: salons.length,
            salons
        });

    } catch (error) {
        console.error("Get my salons error:", error);

        // Handle unexpected server errors
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
        // Get salon ID from URL parameters
        const { id } = req.params;

        // Get update data from request body
        const {
            name,
            ownerPhone,
            address,
            businessHours
        } = req.body;

        // Validate salon ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // Find salon belonging to the logged-in owner
        // Never trust ownerId from req.body
        const salon = await Salon.findOne({
            _id: id,
            ownerId: req.user._id
        });

        // Salon not found or user is not the owner
        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        // Update name if provided
        if (name !== undefined) {

            // Validate name type
            if (typeof name !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid name"
                });
            }

            const cleanName = name.trim();

            // Name cannot be empty
            if (!cleanName) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty"
                });
            }

            salon.name = cleanName;
        }

        // Update owner phone if provided
        if (ownerPhone !== undefined) {

            // Validate phone type
            if (typeof ownerPhone !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid owner phone"
                });
            }

            const cleanPhone = ownerPhone.trim();

            // Phone cannot be empty
            if (!cleanPhone) {
                return res.status(400).json({
                    success: false,
                    message: "Owner phone cannot be empty"
                });
            }

            salon.ownerPhone = cleanPhone;
        }

        // Update address if provided
        if (address !== undefined) {
            salon.address = address;
        }

        // Update business hours if provided
        if (businessHours !== undefined) {
            salon.businessHours = businessHours;
        }

        // Save updated salon
        await salon.save();

        // Return updated salon
        return res.status(200).json({
            success: true,
            message: "Salon updated successfully",
            salon
        });

    } catch (error) {
        console.error("Update salon error:", error);

        // Handle unexpected server errors
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// =====================================================
// DELETE SALON - OWNER
// =====================================================

export const deleteSalon = async (req, res) => {
    try {
        // Get salon ID from URL parameters
        const { id } = req.params;

        // Validate salon ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid salon ID"
            });
        }

        // Find salon belonging to the logged-in owner
        // This prevents another owner from deleting this salon
        const salon = await Salon.findOne({
            _id: id,
            ownerId: req.user._id
        });

        // Salon not found or user is not the owner
        if (!salon) {
            return res.status(404).json({
                success: false,
                message: "Salon not found"
            });
        }

        // Check if salon is already inactive
        if (!salon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Salon is already inactive"
            });
        }

        // Soft delete the salon
        // We keep the document in the database
        salon.isActive = false;

        // Save the change
        await salon.save();

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Salon deleted successfully"
        });

    } catch (error) {
        console.error("Delete salon error:", error);

        // Handle unexpected server errors
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};