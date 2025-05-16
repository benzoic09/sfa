import express from "express";
import { getRoleNameById } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
 

const router = express.Router();

// Route to get the role name by role ID (protected for authenticated users)
router.get("/role/:roleId", authenticateToken, getRoleNameById);

export default router;