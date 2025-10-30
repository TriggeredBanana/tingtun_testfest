import express from "express";

import { 
  getOppgaverByTestfestID, 
  addOppgaver, 
  deleteOppgaver
} from "../controllers/oppgaver.js";

const router = express.Router();

router.get("/:TestfestID", getOppgaverByTestfestID);
router.post("/", addOppgaver);
router.delete("/:OppgaveID", deleteOppgaver);

export default router;