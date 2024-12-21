import { createServer } from "http";
import { Server } from "socket.io";
import app from "./index.js"; // Import the Express app

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});

// Store clients by session ID
const sessions = {};

// Helper functions
const addClient = (sessionId, socket) => {
    if (!sessions[sessionId]) {
        sessions[sessionId] = {};
    }
    sessions[sessionId][socket.id] = socket;
    console.log(`Client added to session ${sessionId}: ${socket.id}`);
};

const removeClient = (sessionId, socket) => {
    if (sessionId && sessions[sessionId]) {
        delete sessions[sessionId][socket.id];
        console.log(`Client removed from session ${sessionId}: ${socket.id}`);
    }
};

const isValidSessionId = (sessionId) => {
    if (!sessions[sessionId]) {
        sessions[sessionId] = {}; // Initialize an empty client object for the session
        console.log(`Created new session: ${sessionId}`);
    }
    return true; // Return true since the session is valid
};

// Socket.io connection
io.on("connection", (socket) => {
    console.log("New connection", socket.id);

    socket.on("joinSession", (sessionId) => {
        if (isValidSessionId(sessionId)) {
            addClient(sessionId, socket);
            socket.join(sessionId);
            socket.emit("joinedSession", { sessionId });
            console.log(`Socket ${socket.id} joined session ${sessionId}`);
        }
    });

    socket.on("mousePosition", (data) => {
        const positionData = { id: socket.id, x: data.x, y: data.y };
        socket.broadcast.to([...socket.rooms]).emit("mousePositionFromServer", positionData);
    });

    socket.on("draw", (data) => {
        socket.broadcast.to([...socket.rooms]).emit("draw-action", data);
    });

    socket.on("disconnect", () => {
        const sessionId = Object.keys(sessions).find((id) => sessions[id][socket.id]);
        removeClient(sessionId, socket);
        socket.broadcast.emit("clientDisconnect", socket.id);
    });
});

// Export the server for use in index.js
export { server };
