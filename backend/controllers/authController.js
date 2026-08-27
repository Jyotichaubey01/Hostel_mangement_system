const jwt = require("jsonwebtoken");

// Check if user is logged in (valid JWT token)
const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach decoded user information to request
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({
                message: "Not authorized, invalid token",
            });
        }
    } else {
        return res.status(401).json({
            message: "Not authorized, no token",
        });
    }
};

// Check if logged-in user is admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({
            message: "Access denied, admin only",
        });
    }
};

module.exports = {
    protect,
    adminOnly,
};