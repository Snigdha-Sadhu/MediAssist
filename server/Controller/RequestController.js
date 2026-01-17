import Emergency from "../Models/emergency.js";
import axios from "axios";

export const getReceivedRequests = async (req, res) => {
  try {
    const requests = await Emergency.find({
      verified: "unknown"
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests
    });

  } catch (error) {
    console.error("GET RECEIVED REQUESTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateRequestStatus = async (req, res) => {
  try {
    const status = req.body.status;

    // Step 1: validate
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Step 2: decide verified value
    let verified = "unknown";

    if (status === "approved") {
      verified = "open";
    }

    if (status === "rejected") {
      verified = "closed";
    }

    // Step 3: update database
    const resource = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verified,
        lastUpdated: new Date()
      },
      { new: true }
    );

    // Step 4: response
    res.json({ success: true, resource });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon,
          format: "json",
          zoom: 18,
          addressdetails: 1
        },
        headers: {
          "User-Agent": "EmergencyApp/1.0 (contact@yourapp.com)"
        }
      }
    );

    res.json({
      address:
        geoRes.data.display_name ||
        geoRes.data.name ||
        geoRes.data.address
    });
  } catch (err) {
    res.status(500).json({ address: "Unknown address" });
  }
};
