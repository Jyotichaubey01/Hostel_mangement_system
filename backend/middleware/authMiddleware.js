const jwt = require("jsonwebtoken");

// Protect routes - check JWT token
const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Store logged-in user's information
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                message: "Not authorized, invalid token"
            });
        }
    } else {
        return res.status(401).json({
            message: "Not authorized, no token"
        });
    }
};

// Allow only admin users
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied, admin only"
        });
    }
};

module.exports = {
    protect,
    adminOnly
};
