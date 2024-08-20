import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ error: "No Autorizado" });
  }

  const [, token] = bearer.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validación del ID como ObjectId
    if (
      typeof decoded === "object" &&
      decoded.id &&
      mongoose.Types.ObjectId.isValid(decoded.id)
    ) {
      const user = await User.findById(decoded.id).select("_id name email surname bio nick image");
      if (user) {
        req.user = user;
      } else {
        return res.status(401).json({ error: "Token No Válido" });
      }
    } else {
      return res.status(401).json({ error: "Token No Válido" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Token No Válido" });
  }

  next();
};
