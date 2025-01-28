import express from "express";
import { getUserProfile, updateUser,deleteUser, getAllUser } from './Quiz-Master-/controller/usercontroller.js';
import { userAuth } from "./Quiz-Master-/middleware/authMiddleware.js";


router.get("/getProfile/:id", userAuth, getUserProfile)
router.patch("/updateUser/:id", userAuth, updateUser)
router.delete("/deleteUser/:id", userAuth, deleteUser)
router.get("/getAllUser", userAuth, getAllUser)

export default router;
