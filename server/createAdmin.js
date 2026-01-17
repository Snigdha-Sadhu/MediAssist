import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be FIRST


import bcrypt from "bcryptjs";
import Admin from "./Models/Admin.js";

const createAdmin = async () => {
  try {
    console.log("createAdmin function called"); // 👈 MUST PRINT

    const exists = await Admin.findOne({ role: "ADMIN" });
    if (exists) {
      console.log(" admin already exists");
      return;
    }

    const hashed = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashed,
      role: "ADMIN",
    });

    console.log(" admin created");
  } catch (err) {
    console.error("Error creating  admin:", err);
  }
};

export default createAdmin;
