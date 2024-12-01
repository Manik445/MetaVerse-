import express, { Router } from "express"
require('dotenv').configure()
import { spaceRouter } from "./space"
import { adminRouter } from "./admin"
import { userRouter } from "./users"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import client from "@repo/db/client"
import { SignInSchema , SignUpSchema } from "../../types"
const router = Router()
const app = express()

// signup
app.post('/signup' , async (req , res)=> {
    // import signup schema
    const parseData = SignUpSchema.safeParse(req.body)
    if (!parseData.success) {
         res.status(400).json({
            error: parseData.error
        })
        return;
    }
     try {
        const hashedPassword = await bcrypt.hash(parseData.data.password , 10)
        const user = await client.user.create({
            data: {
                username: parseData.data.username,
                password: hashedPassword,
                role: parseData.data.type === 'admin' ? 'Admin' : 'User'
            }
        })
        res.json({  
            userid : user.id
        })

     } catch(err){
        res.status(400).json({message : 'Duplicate User'})
     }
})

// signin
app.post('/signin' , async (req , res)=>{
    const parseData = SignInSchema.safeParse(req.body); 
    if(!parseData.success){
        res.status(400).json({
            error: parseData.error
        })
        return;
    }

    try {
        const user = await client.User.findUnique({
            where: {
                username: parseData.data.username
            }
        })
        if(!user){
            res.json({message : 'User not found'})
            return;
        }
        const isMatch = await bcrypt.compare(parseData.data.password , user.password)

        if(!isMatch){
            res.json({message : 'Invalid password'})
            return;
        }
        // login logic 
        const token = jwt.sign(
            {userId : user.id , role: user.role},
            process.env.JWT_PASSWORD as string
        )

        res.json({
            token // need to check 
        })
 
    } catch(err){
        res.json({message : 'User not found'})
    }
})


// get all the elements
app.get('/elements' , (req , res)=>{

})

// get all the avatars
app.get('/avatars' , (req , res)=>{

})

router.use('/users' , userRouter)
router.use('/space' , spaceRouter)
router.use('/admin' , adminRouter)



export default router ;