import React, { useState } from "react";
import axios from "axios";
import API from "../API/api";
export default function EmergencySearch() {
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);

  const handleSearch = async () => {
    if (!type) {
      setError("Please select a resource type");
      return;
    }
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      setResources([]);

      // Fetch emergency resources from backend
      const res = await API.post("/ai/search", {
        type,
       address
      });
console.log(res.data);
      setResources(res.data.resources || []);

    if (!res.data.resources || res.data.resources.length === 0) {
      setError(`No ${type.replace("_", " ")} found near this location`);
    }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center p-6 bg-blue-50">
      <h1 className="text-3xl font-bold  bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent text-center mb-6">Emergency Resource Finder</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label className="block mb-2 font-semibold">Select Resource Type</label>
        <select
          className="w-full border border-gray-300 p-2 rounded mb-4"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="hospital">Hospital</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="blood_bank">Blood_bank</option>
          <option value="ambulance">Ambulance</option>
          {/* Add more options if needed */}
        </select>

        <label className="block mb-2 font-semibold">Enter Address</label>
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Enter city, area, or address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {loading ? "Searching..." : "Find Resources"}
        </button>

        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        {resources.length > 0 ? (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-3">Nearby Resources:</h2>
    <ul className="space-y-3">
      {resources.map((r, idx) => (
        <li
          key={r._id || idx}
          className="border rounded p-3 bg-gray-50"
        >
          <p className="font-semibold">{r.name}</p>
          <p>Type: {r.type}</p>
          <p>Status: {r.verified}</p>
          <p>
            Distance: {r.distanceKm ? r.distanceKm.toFixed(2) : "N/A"} km
          </p>
        </li>
      ))}
    </ul>
  </div>
) : (
  !resources && (
    <p className="mt-6 text-yellow-700 font-semibold text-center">
      No nearby resources available for the selected type and location.
    </p>
  )
)}
</div>
    </div>
  );
}
