import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import Front from './components/Front';
import Login from "./components/Login.jsx";
import { useContext } from 'react';
import { AuthProvider,AuthContext } from "./context/AuthContext";
import HealthChat from './components/HealthChat';
import EmergencyResult from './components/EmergencyResult';
import AdminDashboard from './components/AdminDashboard';
import ResourceRegister from './components/ResourceRegister';

function PrivateRoute({children}){
  const {admin}=useContext(AuthContext);
  return admin? children :<Navigate to ="/login"/>
}
function AppRoutes(){
  
   

  return(
   <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Front />} />
        <Route path="/analyze" element={<HealthChat />} />
        <Route path="/emergency" element={<EmergencyResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addresource" element={<ResourceRegister />} />

        {/* 🔒 Admin Protected Route */}
        <Route
          path="/adminDashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
  );
}
function App() {
  

 return (
  <AuthProvider>
    <BrowserRouter>
     <AppRoutes/>
    </BrowserRouter>
  </AuthProvider>
);
}
export default App
