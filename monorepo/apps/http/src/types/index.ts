import {z} from "zod"

// signup schema 
export const SignUpSchema = z.object({
    username: z.string().email(), 
    password: z.string().min(3),
    type: z.enum(["user" , "admin"])
})

// signin schema 
export const SignInSchema = z.object({
    username: z.string().email(), 
    password: z.string().min(3)
})

// update metadata 
export const UpdateMetaData = z.object({
    avatarId: z.string()
})

// const createSpace 
export const CreateSpaceSchema = z.object({
    name: z.string().min(3),
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,3}$/), 
    mapId: z.string(), 

})

export const DeleteSpaceSchema = z.object({
    spaceId: z.string()
})

export const AddElementSchema = z.object({
    spaceId: z.string(), 
    elementId: z.string(), 
    x: z.number(),
    y: z.number(),
})

export const CreateElementSchame = z.object({
    elementId: z.string(), 
    width: z.number(),
    height: z.number(),
    static: z.number(), 
})

export const UpdateElementSchema = z.object({  
    imageUrl: z.string(),
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})  

export const CreateMapSchema = z.object({
    thumnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements : z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    })),
})

// middlewares 
declare global {
    namespace Express {
        interface Request {
            userId: string
        }
    }
}