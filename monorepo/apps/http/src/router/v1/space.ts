import express,{ Router } from "express";
import { CreateSpaceSchema } from "../../types";
import client from "@repo/db/client"
import { userMiddleware } from "../../middleware/user";
const app = express()
export const spaceRouter = Router(); 

// create a space 
spaceRouter.post('/' , userMiddleware , async (req , res)=>{
     const parseData = CreateSpaceSchema.safeParse(req.body)
     if (!parseData.success) {
        res.json({message: "Validation failed"})
        return; 
     }
    if (!parseData.data.mapId) { 
     await client.space.create({
        data: {
            name: parseData.data.name,
            width: parseData.data.dimension.split("x")[0] , 
            height: parseData.data.dimension.split("y")[0],
            creatorId: req.userId as string
        }
     })
   }
   // if the user wants to use an existant map 
   const map = await client.space.findUnique({
    where: {
        id: parseData.data.mapId
    } , select : {
        mapElement: true // fetch the map element as well
    }
   }) 

   if (!map){
     res.status(400).json({message: "Map Not Found!!"})
   }

   await client.

   // if the map is found
   await client.space.create({
    data: {
        name: parseData.data.name,
        width: parseData.data.dimension.split("x")[0] , 
        height: parseData.data.dimension.split("y")[0],
        creatorId: req.userId as string, 
        spaceElements: {
            
        }
    }
   })
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






