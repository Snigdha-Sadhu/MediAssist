
import dotenv from "dotenv";
dotenv.config();
import Emergency from "../Models/emergency.js";

import {  geocodeAddress} from "../utils/geocodeAddress.js";
const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter"
];



import axios from "axios";

/* --------------------------------------------------
   DISTANCE HELPER (Haversine Formula)
-------------------------------------------------- */
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
}


       
async function findOSMResources(type, lat, lng) {
  const tagMap = {
    hospital: '["amenity"="hospital"]',
    pharmacy: '["amenity"="pharmacy"]',
    blood: '["amenity"="blood_bank"]',
  blood_bank: '["amenity"="blood_bank"]',
    ambulance: '["emergency"="ambulance_station"]'
  };

  if (!tagMap[type]) return [];

  const query = `
    [out:json][timeout:10];
    (
      node${tagMap[type]}(around:2000,${lat},${lng});
      way${tagMap[type]}(around:2000,${lat},${lng});
    );
    out center tags;
  `;

  for (const server of OVERPASS_SERVERS) {
    try {
      const res = await axios.post(
        server,
        query,
        {
          headers: { "Content-Type": "text/plain" },
          timeout: 15000
        }
      );

      return res.data.elements.map(el => ({
        name: el.tags?.name || "Nearby Medical Facility",
        type,
        source: "osm",
        phone: el.tags?.phone || "Not available",
        verified: "unknown",
        location: {
          type: "Point",
          coordinates: [
            el.lon || el.center?.lon,
            el.lat || el.center?.lat
          ]
        }
      }));

    } catch (err) {
      console.warn(`⚠️ OSM failed → ${server}`, err.message);
    }
  }

  return [];
}

function removeDuplicates(resources) {
  const unique = [];

  for (const res of resources) {
    const exists = unique.find(u => {
      const nameMatch =
        u.name?.toLowerCase() === res.name?.toLowerCase();

      const closeEnough =
        Math.abs(u.distanceKm - res.distanceKm) < 0.1;

      return nameMatch && closeEnough;
    });

    if (!exists) {
      unique.push(res);
    }
  }

  return unique;
}

/* --------------------------------------------------
   MAIN EMERGENCY SEARCH CONTROLLER
-------------------------------------------------- */
export const searchEmergency = async (req, res) => {
  console.log(req.body);
  try {
    const { type, address } = req.body;
         console.log(req.body.address);
    // ✅ Validation
    if (!type || address == null) {
      return res.status(400).json({
        success: false,
        message: "type, latitude and longitude are required"
      });
    }
    console.log("Address available")
 let latitude, longitude;
    try {
      ({ latitude, longitude } = await geocodeAddress(address));
      console.log(latitude,longitude);
    } catch (geoErr) {
      return res.status(400).json({
        success: false,
        message: "Invalid address. Unable to fetch coordinates."
      });
    }
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates"
      });
    }

    /* --------------------------------------------
       1️⃣ HUMAN-PROVIDED RESOURCES (MongoDB)
    -------------------------------------------- */
    const humanResources = await Emergency.find({
      type,
      verified: "open",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 15000 // 50 km
        }
      }
    }).limit(5);

    /* --------------------------------------------
       2️⃣ OSM FALLBACK (FREE)
    -------------------------------------------- */
    let osmResources = [];
    if (humanResources.length < 3) {
      osmResources = await findOSMResources(type, lat, lng);
    }

    /* --------------------------------------------
       3️⃣ MERGE + DISTANCE + SORT
    -------------------------------------------- */
     // limit final result
let allResources = [...humanResources, ...osmResources]
  .map(r => {
    const resource = r._doc ? r._doc : r;
    const [lng2, lat2] = resource.location.coordinates;

    return {
      ...resource,
      source: resource.source || "human",
      distanceKm: getDistanceKm(lat, lng, lat2, lng2)
    };
  })
  .sort((a, b) => a.distanceKm - b.distanceKm);

// 🔥 REMOVE DUPLICATES
allResources = removeDuplicates(allResources);

// LIMIT FINAL RESPONSE
allResources = allResources.slice(0, 5);


    /* --------------------------------------------
       FINAL RESPONSE
    -------------------------------------------- */
    res.json({
      success: true,
      source:
        humanResources.length && osmResources.length
          ? "hybrid"
          : humanResources.length
          ? "human"
          : "osm",
      count: allResources.length,
      resources: allResources
    });

  } catch (error) {
    console.error("Emergency search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
