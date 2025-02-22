import jwt, {JwtPayload} from "jsonwebtoken"
import {Response, Request, NextFunction} from "express"
import bcrypt from "bcryptjs";
//import {config} from "dotenv"

//config()

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // Check for the presence of an authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    // Extract the token from the header
    const token = authHeader.split(" ")[1];
  
    try {
      // Verify the token using the JWT library and the secret key
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedToken;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }