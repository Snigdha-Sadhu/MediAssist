import express from "express";
const router=express.Router();
import{getReceivedRequests,updateRequestStatus,reverseGeocode}from "../Controller/RequestController.js";
import{Adminauth } from '../middleware/Adminauth.js'

router.patch('/:id',Adminauth,updateRequestStatus);
router.get('/received',Adminauth,getReceivedRequests);
router.get('/reverse-geocode',reverseGeocode);
//router.post("/add",addEmergency);



export default router;
