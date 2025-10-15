import express from "express";
import { 
  getUsers, 
  getUserById,
  addUser, 
  updateUser,
  deleteUser,
  loginUser
} from "../controllers/brukere.js";

const router = express.Router();

// Hent alle brukere
router.get("/", getUsers);

// Hent én bruker
router.get("/:id", getUserById);

// Opprett ny bruker
router.post("/", addUser);

// Oppdater bruker
router.put("/:id", updateUser);

// Slett bruker
router.delete("/:id", deleteUser);

// Login
router.post("/login", loginUser);

export default router;