import express from "express";
const router = express.Router();
import{Adminauth } from '../middleware/Adminauth.js'

import {  login, getMe } from "../Controller/AdminController.js";
router.post("/login",login);


//router.post("/create", Adminauth, SuperAdmin, createAdmin);
router.get("/me", Adminauth, getMe);

export default router;