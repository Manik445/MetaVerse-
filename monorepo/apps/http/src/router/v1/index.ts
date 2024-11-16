import express, { Router } from "express"
const router = Router()
const app = express()

// signup
app.post('/sigup' , (req , res)=> {
    res.json({
        message : "inside signup"
    })
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