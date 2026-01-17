import express from "express";
const router=express.Router();
import{addResource}from "../Controller/emergencyController.js";

router.post("/add/resource",addResource);


export default router;
