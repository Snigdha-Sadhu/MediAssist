import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import emergencyRoutes from "./Routes/emergency.js";
import aiRoutes from "./Routes/ai.js";
import requestRoutes from "./Routes/request.js";
import adminRoutes from "./Routes/adminRoute.js"
import createAdmin from "./createAdmin.js";

const app=express();
/*app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json()); 

app.use(cors({origin:process.env.CLIENT_URL,credentials:true}));
app.use('/api/emergency',emergencyRoutes);
app.use('/api/ai',aiRoutes);
app.use('/api/request',requestRoutes);
*/
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend working fine!" });
});
//app.use('/api/admin',adminRoutes);
const PORT=process.env.PORT|| 5000;
mongoose.connect(process.env.MONGO_URL) .then(()=>{
  console.log('mongodb connected');
  
  app.listen(PORT, "0.0.0.0", () => {
  console.log("server running on", PORT);
});
})
.catch(err => console.error(err));
 

