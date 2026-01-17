import { useState } from "react";
import HealthChat from "./HealthChat";
import EmergencyResult from "./EmergencyResult";
import { useNavigate } from "react-router-dom";

export default function Front() {
  const navigate = useNavigate();

 return (
  <div className="min-h-screen w-full bg-[#F3F7FF] overflow-x-hidden">

    {/* ================= NAVBAR ================= */}
    <header className="w-full bg-white shadow">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-4 sm:px-6 py-3 md:h-20">

        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start mb-3 md:mb-0">
          <img
            src="/image/health-logo.png"
            alt="MediAssist Logo"
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mr-2 sm:mr-3 object-contain"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-purple-600">
            MediAssist
          </h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Administrator Login
          </button>

          <button
            onClick={() => navigate("/addresource")}
            className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
          >
            Healthcare Services Portal
          </button>
        </div>

      </div>
    </header>

    {/* ================= HERO ================= */}
    <main className="w-full">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-4 sm:px-6 py-12 gap-10">

        {/* Left Content */}
        <section className="text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-700 mb-6">
            Your AI Health <br className="hidden sm:block" /> Companion
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 max-w-xl mx-auto md:mx-0">
            Analyze symptoms or quickly find emergency medical resources near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/analyze")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
            >
              Analyze Symptoms
            </button>

            <button
              onClick={() => navigate("/emergency")}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition"
            >
              Find Emergency Help
            </button>
          </div>
        </section>

        {/* Right Image */}
        <section className="flex justify-center">
          <img
            src="/image/image.png"
            alt="Healthcare Illustration"
            className="max-w-full w-[240px] sm:w-[360px] md:w-[520px] object-contain"
          />
        </section>

      </div>
    </main>

  </div>
);

}