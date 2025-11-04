import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  getTestfester, 
  getTestfesterByID,
  updateProgramForTestfest,
  addTestfester, 
  updateTestfester,
  deleteTestfester
} from "../controllers/testfester.js";


const router = express.Router();

router.get("/", getTestfester);
router.get("/:TestfestID", verifyToken, getTestfesterByID);
router.post("/", verifyToken, addTestfester);
router.put("/:TestfestID", verifyToken, updateTestfester);
router.delete("/:TestfestID", verifyToken, deleteTestfester);
router.put("/:TestfestID/program", verifyToken, updateProgramForTestfest);

export default router;