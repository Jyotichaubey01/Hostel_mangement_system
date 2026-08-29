const jwt = require("jsonwebtoken");

// Protect routes - verify JWT token
const protect = (req, res, next) => {
    console.log("AUTH HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    // No Authorization header
    if (!authHeader) {
        return res.status(401).json({
            message: "Not authorized, no token"
        });
    }

    // Wrong Authorization format
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid authorization format. Use Bearer <token>"
        });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token"
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach user information to request
        req.user = decoded;

        console.log("Authenticated user:", {
            id: decoded.id,
            role: decoded.role
        });

        next();
    } catch (error) {
        console.log("JWT Error:", error.message);

        return res.status(401).json({
            message: "Not authorized, invalid token"
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