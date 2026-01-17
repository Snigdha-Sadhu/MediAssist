import { useEffect, useState,useContext } from "react";
import axios from "axios";
import API from "../API/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate} from "react-router-dom";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const handleLogout=async()=>{
     try {
     
      logout();
      alert("Logout Successfully");
      
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
    }
  }

  // Define fetchRequests outside so it can be reused
  const fetchRequests = async () => {
    try {
      
      setLoading(true);
      console.log("FETCHING REQUESTS...");
      const res = await API.get("/request/received");
      setRequests(res.data.requests);
      console.log("FETCHED DATA:", res.data.requests);

      const addrMap = {};
      await Promise.all(
        res.data.requests.map(async (req, index) => {
          try {
            const lat = req.location.coordinates[1];
            const lon = req.location.coordinates[0];
            console.log(lat,lon);
            const geoRes = await API.get(
  `/request/reverse-geocode?lat=${lat}&lon=${lon}`
);
console.log("GEOCODE RAW RESPONSE:", geoRes.data);
            addrMap[req._id] =
  geoRes.data.address||
  "Unknown address";
await new Promise(r => setTimeout(r, 1000));
          } catch {
            addrMap[req._id || index] = "Failed to load address";
          }
        })
      );
      setAddresses(addrMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(true);
  }, []);

  const handleAction = async (id, status) => {
    try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        console.log("in handle");
      await API.patch(`/request/${id}`, { status });
      setRequests((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status } : req))
    );// Now accessible here
      console.log("PATCH DONE");
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading requests...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Emergency Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-lg shadow p-5 flex flex-col gap-2"
            >
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {req.name}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Type:</span> {req.type}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Address:</span>{" "}
                {addresses?.[req._id] || "Loading address..."}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold
                    ${
                      req.status === "Approve"
                        ? "bg-green-100 text-green-700"
                        : req.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {req.status}
                </span>
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  disabled={req.status !== "pending" || actionLoading[req._id]}
                  onClick={() => handleAction(req._id, "approved")}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve
                </button>

                <button
                  disabled={req.status !== "pending" || actionLoading[req._id]}
                  onClick={() => handleAction(req._id, "rejected")}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex">
      <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed mt-10 ml-auto" onClick={handleLogout}>Logout</button>
    </div>
    </div>
  </div>
);
}