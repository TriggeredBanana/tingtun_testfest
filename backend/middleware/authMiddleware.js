import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtConfig.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  //fallback
  jwt.verify(token, getJwtSecret(), (err, decoded) => {
    if (err) {
      console.error("JWT-verifisering feilet:", err.message);
      return res.status(403).json({ error: "Ugyldig token" });
    }

    req.user = decoded;
    req.user.ErSuperbruker = Boolean(decoded.ErSuperbruker); //ErSuperbruker til ren boolean 

    next();
  });
};

