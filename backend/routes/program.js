import express from "express";

import { 
  addProgram,
  getProgrambyID,
  getProgram
} from "../controllers/program.js";


const router = express.Router();

router.post("/", addProgram);
router.get("/:ProgramID", getProgrambyID);
router.get("/", getProgram)
 

export default router;