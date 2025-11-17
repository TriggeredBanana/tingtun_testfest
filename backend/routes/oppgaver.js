import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  getOppgaverByTestfestID, 
  addOppgaver, 
  updateOppgaver,
  deleteOppgaver
} from "../controllers/oppgaver.js";

const router = express.Router();

router.get("/:TestfestID", getOppgaverByTestfestID);
router.post("/", verifyToken, addOppgaver);
router.put("/:OppgaveID", verifyToken, updateOppgaver);
router.delete("/:OppgaveID", verifyToken, deleteOppgaver);

export default router;