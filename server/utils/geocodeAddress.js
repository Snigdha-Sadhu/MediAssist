import axios from "axios";



export const geocodeAddress = async (address, countryCode = null) => {
  console.log("GEOCODING:", address);

  const parts = address.split(",").map(p => p.trim());

  const queries = [
    address,
    parts[0],
    parts.slice(-2).join(", "),
  ];

  for (const q of queries) {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q,
            format: "json",
            limit: 1,
            ...(countryCode && { countrycodes: countryCode })
          },
          headers: {
            "User-Agent": "Emergency-App/1.1",
          },
        }
      );

      const data = response.data;
      if (!data || data.length === 0) continue;

      const lat = Number(data[0].lat);
      const lon = Number(data[0].lon);

      console.log("FOUND:", lat, lon);

      return { latitude: lat, longitude: lon };

    } catch {
      continue;
    }
  }

  throw new Error("Unable to fetch coordinates for this address");
};
