export const ownerOnly = (req, res, next) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (
            req.user.role !== "owner" &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        next();

    } catch (error) {
        console.error("Owner authorization error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};