import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next;
  }

jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
    console.error("JWT-verifisering feilet:", err.message);
    return res.status(403).json({ error: "Ugyldig token" });
  }

  console.log("Token OK, decoded payload:", decoded);
  req.user = decoded;
  next();
  });
};
