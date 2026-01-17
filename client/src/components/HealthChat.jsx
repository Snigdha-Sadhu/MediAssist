import {useState} from "react";
import axios from "axios";
import API from "../API/api";
export default function HealthChat(){
    const[abnormality,setAbnormality]=useState("");
    const[analysis,setAnalysis]=useState(null);
    const[resources,setResources]=useState([]);
    const[loading,setLoading]=useState(false);
    const[error,setError]=useState("");

    const analyzeHealth=async()=>{
        if(!abnormality.trim())return;
        try{
            setLoading(true);
                setError("");
            const res=await API.post("/ai/health",{
                abnormality
            })
            setAnalysis(res.data.analysis);
            }  catch(err){
        setError("Something went wrong.please try again");
        setResources([]); 
    }finally{
        setLoading(false)
    }
    
    }
   return (
  <div className="min-h-screen w-screen bg-blue-50 flex justify-center">
    <div className="w-full max-w-3xl px-4 py-10">

      {/* Page Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent text-center   mb-4">
          Health Symptom Analyzer
        </h2>
        <p className="text-gray-600 mt-2">
          Describe your symptoms to understand urgency and get help if needed.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

        {/* Input */}
        <label className="block font-semibold text-gray-700 mb-2">
          Describe your physical abnormality
        </label>

        <textarea
          className="w-full border border-gray-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          placeholder="Describe What you are feeling"
          value={abnormality}
          onChange={(e) => setAbnormality(e.target.value)}
        />

        {/* Action Button */}
        <button
          onClick={analyzeHealth}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Analyzing symptoms..." : "Analyze Symptoms"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-500 mt-4 text-center">
            {error}
          </p>
        )}

        {/* Analysis Result */}
        {analysis && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent text-center mb-4">
              Health Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p><strong>Disease:</strong> {analysis.diseaseName}</p>
              <p><strong>Stage:</strong> {analysis.stage}</p>
              <p><strong>Urgency:</strong> {analysis.urgencyScore}/10</p>
              <p><strong>Resource Needed:</strong> {analysis.resourceNeeded}</p>
            </div>

            <div className="mt-4">
              <p className="font-semibold mb-2 text-gray-700">Immediate Prevention Steps:</p>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {analysis.preventionSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        
      </div>
    </div>
  </div>
);
}