import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  addProgram,
  getProgrambyID,
  getProgram,
  updateProgram,
  deleteProgram
} from "../controllers/program.js";


const router = express.Router();

router.post("/", verifyToken, addProgram);
router.get("/:ProgramID", getProgrambyID);
router.get("/", getProgram)
router.put("/:ProgramID", verifyToken, updateProgram)
router.delete("/:ProgramID", verifyToken, deleteProgram)

export default router;