import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import { 
  getUsers, 
  getUserById,
  addUser, 
  updateUser,
  deleteUser,
  loginUser,
  verifyUser
} from "../controllers/brukere.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/verify", verifyToken, verifyUser); 
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ success: true });
});

router.get("/", getUsers);

router.get("/:id", getUserById);     
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;