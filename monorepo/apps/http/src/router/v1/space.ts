import express,{ Router } from "express";
const app = express()
export const spaceRouter = Router(); 

// create a space 
spaceRouter.post('/' , (req , res)=>{
     
})

// delete a space
spaceRouter.delete('/:spaceId' , (req , res)=>{

})

// get all spaces
spaceRouter.get('/all' , (req , res)=>{

})

// create an element in space
spaceRouter.post('/element' , (req , res)=>{

})

// delete an element in space
spaceRouter.delete('/:elementId' , (req , res) => {

})






