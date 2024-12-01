import express, { Router } from "express"
export const userRouter = Router(); 
import client from '@repo/db/client'
import { UpdateMetaData } from "../../types";
import { userMiddleware } from "../../middleware/user";

// update metadata 
// middleware for fetching the userid
userRouter.post('/meta' , userMiddleware , async(req , res)=>{
    const parseData = UpdateMetaData.safeParse(req.body);
    if (!parseData.success) {  
        res.status(400).json({
            error: parseData.error
        })
        return; 
    }

    await client.User.update({
        where: {
            id: req.userId
        },
        data: {
            avatarId: parseData.data.avatarId
        }
    })

    res.json({
        message : "metadata updated successfully"
    })

})

// get other user metadata 
userRouter.post('/metadata/bulk' , async(req , res)=>{
    const userIdString = (req.query.ids ?? []) as string; 
    const userIds = (userIdString).slice(1 , userIdString.length - 1).split(',')
    if(!userIds){
        res.status(400).json({
            message: "User ids are required"
        })
    }
    try { 
    const metadata = await client.User.findMany({  
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            avatarId: true
        }
    })
    res.json({
        avatars: metadata.map((m: { id: any; avatarId: any; }) => ({
                userId: m.id,
                avatarId: m.avatarId
        
        }))
    })
    } catch(err){
        res.status(403).json({
            message: "Something went wrong"
        })
    }
    })  




