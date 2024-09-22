import express, { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
});

interface Client {
    [key: string]: Socket;
}

interface Session {
    [key: string]: Client; // Maps session ID to clients
}

const sessions: Session = {}; // Store clients by session ID

const addClient = (sessionId: string, socket: Socket) => {
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }
    sessions[sessionId][socket.id] = socket;
    console.log(`Client added to session ${sessionId}: ${socket.id}`);
};

const removeClient = (sessionId: string | undefined, socket: Socket) => {
    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId][socket.id];
        console.log(`Client removed from session ${sessionId}: ${socket.id}`);
    }
};

io.on("connection", (socket: Socket) => {
  console.log("connection", socket.id);

  socket.on("joinSession", (sessionId: string) => {
      if (isValidSessionId(sessionId)) {
          addClient(sessionId, socket);
          socket.join(sessionId);
          socket.emit("joinedSession", { sessionId });
          console.log(`Socket ${socket.id} joined session ${sessionId}`);
      }
  });

  socket.on("mousePosition", (data: { x: number; y: number }) => {
      const positionData = { id: socket.id, x: data.x, y: data.y };
      socket.broadcast.to(Array.from(socket.rooms)).emit("mousePositionFromServer", positionData);
  });

  socket.on('draw', (data) => {
      socket.broadcast.to(Array.from(socket.rooms)).emit('draw-action', data);
  });

  socket.on("disconnect", () => {
      const sessionId = Object.keys(sessions).find(id => sessions[id][socket.id]);
      removeClient(sessionId, socket);
      socket.broadcast.emit("clientDisconnect", socket.id);
  });
});


// Function to validate session ID
const isValidSessionId = (sessionId: string) => {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {}; // Initialize an empty client object for the session
    console.log(`Created new session: ${sessionId}`);
  }
    return true; // Return true since the session is valid
};

export {
    app, io, server
};
