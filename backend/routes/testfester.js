import express from "express";

import { 
  getTestfesterByID,
  getTestfester, 
  updateProgramForTestfest,
  addTestfester, 
  deleteTestfester
} from "../controllers/testfester.js";

const router = express.Router();

router.get("/:TestfestID", getTestfesterByID);
router.get("/", getTestfester);
router.put("/:TestfestID/program", updateProgramForTestfest);
router.post("/", addTestfester);
router.delete("/:TestfestID", deleteTestfester);

export default router;