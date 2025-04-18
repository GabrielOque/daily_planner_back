import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";

export const Auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ code: "TOKEN_NOT_PROVIDED" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ code: "INVALID_TOKEN" });
  }
};
