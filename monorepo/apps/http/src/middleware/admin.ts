import { NextFunction , Request , Response } from "express";
import jwt from 'jsonwebtoken'

export const adminMiddleware = async (req: Request , res: Response , next: NextFunction) => {
    const header = req.headers['authorization'];  // ['bearer', 'token]
    const token = header?.split('')[1]

 // validate token
 if(!token){
     res.json({
        message: "Token not found"
     })
     return;  
 }
    try{
        // verify token
        const decoded =  jwt.verify(token, process.env.JWT_PASSWORD as string) as {role : string , userId : string}
        if(decoded.role!== 'Admin'){
            res.json({
                message: "Unauthorized access only admin can access "
            })
            return;
        }
        req.userId = decoded.userId
        next()

    } catch(err){
        res.status(401).json({
            message: "Unauthorized access"
        })
    }
}