import express from "express"
import router from "./router/v1"
const app = express()
require('dotenv').config(); 

const PORT = process.env.PORT || 5001

app.use('/api/v1' , router)

app.listen(PORT , ()=>{
    console.log(`server is listening at https://localhost:${PORT}`)
})

