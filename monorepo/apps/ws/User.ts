import { OutgoingMessage } from "./src/types";
import client from "@repo/db"
import jwt from "jsonwebtoken"

function generateRandomStrin(){
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = ""; 
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result
}


class User {
    public id?: string; 
    private userId? : string; 
    private spaceId : string; 
    public x : number; 
    public y : number; 

 constructor(private ws: webSocket){
    this.id  = generateRandomStrin(); 
    this.x  = 0 ; 
    this.y = 0 ; 
 }  

 initHandlers(){
    this.ws.on('message' , async(data)=>{
        const parseData = await JSON.parse(data.toString()) // need to check
        switch (parseData.type) {
            case 'join' : 
        const spaceId  = parseData.payload.spaceId; 
        const token = parseData.payload.token; 
        const userId = (jwt.verify(token , JWT_PASSWORD as string) as {userId : string}).userId;
        if (!userId){
            this.ws.close(); 
            return;
        }
        this.userId = userId
        RoomManager.getInstance().addUser(spaceId , this.ws); 
    // find the space in the database where is user is trying to join 
        const space  = await client.space.findFirst({
            where : {
                id : spaceId
            }
        })

        if (!space){
            // if space is not found then close the connection
            this.ws.close()
            return; 
        }

        this.x  = Math.floor(Math.random() * space?.width);
        this.y = Math.floor(Math.random() * space?.height);

        this.send({ // server sends to the  client 
            type: "space-joined", 
            payload : {
                spawn : {
                    x: this.x ,
                    y: this.y
                },  
                users : RoomManager.getInstance().rooms?.get(spaceId)?.map((u)=>({id : u:id}) ?? []) // current users in the space
            }
        })
            case "move" : 
            const movex = parseData.payload.x;
            const movey = parseData.payload.y; 
            const xDisplacement = Math.abs(this.x - movex); 
            const yDisplacement = Math.abs(this.y - movey);

            if ( (xDisplacement == 0 && yDisplacement == 1 ) || (xDisplacement == 1 && yDisplacement == 0) || (xDisplacement == 0 && yDisplacement == 1)){
                this.x = movex; 
                this.y = movey; 

                RoomManager.getInstance().broadcast({ 
                    type: "move",
                    payload : {
                        x: this.x,
                        y: this.y
                    }
                } , this , this.spaceId)
                return;
            }
            this.send({
                type: 'movement-rejected' ,
                payload : {
                    x : this.x ,
                    y : this.y
                }
            })

        }
    })
 }

 destory() {
    RoomManager.getInstance().broadcast({
        type: "user-left" , 
        payload: {
            userId : this.userId
        }
    })
    RoomManager.getInstance().removeUser(this , this.spaceId);
 }

 send(payload : OutgoingMessage){
    // send the message to the client 
    this.ws.send(JSON.stringify(payload))
 }
}