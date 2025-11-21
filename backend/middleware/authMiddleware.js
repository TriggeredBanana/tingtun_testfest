import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtConfig.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    req.isAuthenticated = false;
    return next();
  }

  // Fallback
  jwt.verify(token, getJwtSecret(), (err, decoded) => {
    if (err) {
      console.error("JWT-verifisering feilet:", err.message);
      req.user = null;
      req.isAuthenticated = false;
      return next();
    }

    req.user = decoded;
    req.user.ErSuperbruker = Boolean(decoded.ErSuperbruker); // ErSuperbruker to pure boolean 
    req.isAuthenticated = true;

    next();
  });
};

