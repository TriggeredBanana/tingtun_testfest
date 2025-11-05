import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  addProgram,
  getProgrambyID,
  getProgram
} from "../controllers/program.js";


const router = express.Router();

router.post("/", verifyToken, addProgram);
router.get("/:ProgramID", getProgrambyID);
router.get("/", getProgram)
 

export default router;