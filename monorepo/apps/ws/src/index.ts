import { WebSocketServer } from 'ws';
import {User} from './User.ts'

const wss = new WebSocketServer({ port: 3001 });
let user : User | undefined
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    user = new User(ws); 
  });

  ws.on('close' , () => {
      // destroy the user 
      user?.destory()
  })

  ws.send('something');
});