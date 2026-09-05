// middleware/validateMiddleware.js

const validate = (schema) => {
    return (req, res, next) => {

        // Validate request body, params and query
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query
        });

        // If validation fails
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message
                }))
            });
        }

        // Use the validated data
        req.body = result.data.body;
        req.params = result.data.params;
        req.query = result.data.query;

        // Continue to controller
        next();
    };
};

export default validate;