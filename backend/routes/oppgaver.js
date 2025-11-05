import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  getOppgaverByTestfestID, 
  addOppgaver, 
  deleteOppgaver
} from "../controllers/oppgaver.js";

const router = express.Router();

router.get("/:TestfestID", getOppgaverByTestfestID);
router.post("/", verifyToken, addOppgaver);
router.delete("/:OppgaveID", verifyToken, deleteOppgaver);

export default router;