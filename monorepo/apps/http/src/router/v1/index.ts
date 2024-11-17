import express, { Router } from "express"
import { spaceRouter } from "./space"
import { adminRouter } from "./admin"
import { userRouter } from "./users"
const router = Router()
const app = express()

// signup
app.post('/sigup' , (req , res)=> {

})

// signin
app.post('/signin' , (req , res)=>{
    res.json({
        message : "inside signin"
    })
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