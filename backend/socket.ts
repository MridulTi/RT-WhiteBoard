import express, { Express } from "express";
import {createServer} from "http";
import { Server,Socket } from "socket.io";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000','http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

interface Client {
  [key: string]: Socket;
}

const clients:Client = {};
const addClient = (socket:Socket) => {
  console.log("New client connected", socket.id);
  clients[socket.id] = socket;
};

const removeClient = (socket:Socket) => {
  console.log("Client disconnected", socket.id);
  delete clients[socket.id];
};

io.on("connection",(socket: Socket)=> {
  console.log("connection",socket.id)
  let id = socket.id;

  addClient(socket);

  socket.on("mousemove", (data:any) => {
    data.id = id;
    console.log(data)
    socket.broadcast.emit("moving", data);
  });

  socket.on("disconnect", () => {
    removeClient(socket);
    socket.broadcast.emit("clientdisconnect", id);
  });
})

export {
  app,io,server
};