const { check, validationResult } = require("express-validator");

// Helper to handle validation results
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    handleValidation,
];

const bookValidation = [
    check("title", "Title is required").not().isEmpty(),
    check("author", "Author is required").not().isEmpty(),
    check("price", "Price must be a number").isNumeric(),
    check("stock", "Stock must be a number").isNumeric(),
    handleValidation,
];

module.exports = { registerValidation, bookValidation };
