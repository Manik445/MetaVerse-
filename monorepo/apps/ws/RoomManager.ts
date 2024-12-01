import { OutgoingMessage } from "./src/types";
import type  {User} from "./User";
private class RoomManager {
    rooms: Map<string, User[]> = new Map(); 
    static instance: RoomManager; 

    private constructor(){
        this.rooms = new Map(); 
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new RoomManager(); // initialize the class
        }
        return this.instance; 
    }

    // remove the user from the room 
    public removeUser(spaceId: string , user: User){
        if(!this.rooms.has(spaceId)){
            return; 
        }
        this.rooms.set(spaceId , (this.rooms.get(spaceId)?.filter((u) => u.id !== user.id_) ?? [] )) // return all the others users that are present in that room 

    }

    // add the user in the Room 
    public addUser(spaceId:string , user: User){ {
        if(!this.rooms.has(spaceId)){
            this.rooms.set(spaceId , [user]); 
            return ; 
        }
        this.rooms.set(spaceId ,  [...(this.rooms.get(spaceId) ?? []) , user]);
    }

        // User starts broadcasting messages
    public broadcast(message : OutgoingMessage , user: User , roomId: string) {
                // if the room not found then return
                if (!this.rooms.has(roomId)) {
                    return; 
                }

            // fetch the room and send the message to all the users in the room
            this.rooms.get(roomId)?.forEach((u) => {
                if (u.id !== user.id) {
                    
                }
            })
        }
   } 
}