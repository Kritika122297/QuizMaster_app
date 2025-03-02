import express from "express";
import { getUserProfile, updateUser,deleteUser, getAllUser,getCurrentUser } from '../controller/usercontroller.js';
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/getProfile/:id", userAuth, getUserProfile)
router.get("/user", userAuth, getCurrentUser);
router.patch("/updateUser/:id", userAuth, updateUser)
router.delete("/deleteUser/:id", userAuth, deleteUser)
router.get("/getAllUser", userAuth, getAllUser)

export default router;
