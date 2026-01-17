import jwt from "jsonwebtoken";

export const Adminauth = (req, res, next) => {
  console.log("AdminAuth middleware hit");

  const authHeader = req.headers.authorization;
console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.includes(" ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: decoded itself contains id & role
    req.admin = {
      id: decoded.id,
      role: decoded.role
    };

    console.log("Authenticated admin:", req.admin);
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Token invalid" });
  }
};
