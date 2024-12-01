import { NextFunction , Request , Response } from "express";
import jwt from "jsonwebtoken"

export const userMiddleware = async (req: Request , res: Response , next: NextFunction) => {
    const header = req.headers['authorization'];  // ['bearer', 'token']
    const token = header?.split('')[1]

    if (!token){
        res.json({
            message: 'Token is required'
        })
        return; 
    }
    try {
        // verify token
       const decoded = await jwt.verify(token , process.env.JWT_PASSWORD as string) as {role: string , userId: string} 
        req.userId = decoded.userId; 
        // pass the userId to the next function
        next()

    } catch(err){
        res.status(401).json({
            message: 'Unauthorized access'
        })
    }
}