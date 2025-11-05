import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  getTjenesteeiere, 
  addTjenesteeier, 
  deleteTjenesteeier 
} from "../controllers/tjenesteeier.js";

const router = express.Router();

router.get("/", verifyToken, getTjenesteeiere);
router.post("/", verifyToken, addTjenesteeier);
router.delete("/:TjenesteeierID", verifyToken, deleteTjenesteeier);

export default router;
