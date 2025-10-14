import express from "express";

import { 
  getTjenesteeiere, 
  addTjenesteeier, 
  deleteTjenesteeier 
} from "../controllers/tjenesteeier.js";

const router = express.Router();

router.get("/", getTjenesteeiere);
router.post("/", addTjenesteeier);
router.delete("/:TjenesteeierID", deleteTjenesteeier);

export default router;
