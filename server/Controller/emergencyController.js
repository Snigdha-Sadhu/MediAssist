import Emergency from "../Models/emergency.js";
import {  geocodeAddress} from "../utils/geocodeAddress.js";

export const addResource = async (req, res) => {
  console.log(req.body)
  try {
    let {
      name,
      type,
      phone,
      address
    } = req.body;

    if (!name || !type || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    let latitude, longitude;
    try {
      ({ latitude, longitude } = await geocodeAddress(address));
    } catch (geoErr) {
      return res.status(400).json({
        success: false,
        message: "Invalid address. Unable to fetch coordinates."
      });
    }


    // Normalize
    name = name.trim();
    type = type.trim().toLowerCase();

    const allowedTypes = ["blood", "hospital", "ambulance", "police", "pharmacy"];
    

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    
    

    // Prevent duplicate resource
    const existing = await Emergency.findOne({
      phone,
      location: {
        coordinates: [Number(longitude), Number(latitude)]
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Resource already exists"
      });
    }

    const resource = await Emergency.create({
      name,
      type,
      phone,
      verified:"unknown",
      status:"pending",
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)]
      }
    });

    res.status(201).json({
      success: true,
      resource
    });

  } catch (err) {
    console.error("Add Resource Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
