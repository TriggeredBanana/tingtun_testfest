import jwt from "jsonwebtoken";
import { getJwtSecret } from "./jwtConfig.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    req.isAuthenticated = false;
    return next();
  }

  //fallback
  jwt.verify(token, getJwtSecret(), (err, decoded) => {
    if (err) {
      console.error("JWT-verifisering feilet:", err.message);
      req.user = null;
      req.isAuthenticated = false;
      return next();
    }

    req.user = decoded;
    req.user.ErSuperbruker = Boolean(decoded.ErSuperbruker); //ErSuperbruker til ren boolean 
    req.isAuthenticated = true;

    next();
  });
};

