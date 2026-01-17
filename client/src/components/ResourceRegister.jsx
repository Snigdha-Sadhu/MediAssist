import React, { useState } from "react";
import axios from "axios";
import API from "../API/api";
const allowedTypes = ["blood", "hospital", "ambulance", "police", "pharmacy"];
const allowedVerified = ["open", "closed", "unknown"];

export default function ResourceRegister() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    phone: "",
   
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success or error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Basic front validation
    if (!form.name.trim() || !form.type || !form.address.trim()) {
      setMessage({ type: "error", text: "Please fill all required fields." });
      return;
    }

    if (!allowedTypes.includes(form.type)) {
      setMessage({ type: "error", text: "Invalid resource type." });
      return;
    }

    
    try {
      setLoading(true);
      const res = await API.post("emergency/add/resource", form);

      if (res.data.success) {
        setMessage({ type: "success", text: "Resource added successfully!" });
        setForm({
          name: "",
          type: "",
          phone: "",
          verified: "unknown",
          address: "",
        });
        alert("Resource added successfully");
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed to add resource." });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Server error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-blue-100 to-white px-6">
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent text-center   mb-4">Add Resource</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Resource name"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="" disabled>
              Select type
            </option>
            {allowedTypes.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Optional phone number"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

       

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            placeholder="Full address"
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } transition`}
        >
          {loading ? "Adding..." : "Add Resource"}
        </button>
      </form>
    </div>
    </div>
  );
}
