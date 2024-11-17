import express from "express"
import router from "./router/v1"
const app = express()
require('dotenv').config(); 
// import client from '@repo/db' // need to setup this for prisma db 

const PORT = process.env.PORT || 5001

app.use('/api/v1' , router)
app.use(express.json())

app.listen(PORT , ()=>{
    console.log(`server is listening at https://localhost:${PORT}`)
})

