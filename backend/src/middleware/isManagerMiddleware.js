const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_SECRET } = process.env;

const isManagerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

    if (user.userType !== "manager") {
      return res.status(403).json({ message: "Access denied: Manager only route" });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = isManagerAuth;