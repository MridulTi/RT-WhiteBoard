import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface MousePosition {
  x: number | null;
  y: number | null;
}

interface Clients {
  [key: string]: MousePosition;
}


const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: null, y: null });
  const [clients, setClients] = useState<Clients>({});
  const socketRef = useRef<Socket | null>(null);


  // Update local mouse position and emit it to the backend
  const updateMousePosition = (e: MouseEvent) => {
    const newPosition = { x: e.clientX, y: e.clientY };
    setMousePosition(newPosition);

    // Emit the mouse position to the server
    if (socketRef.current) {
      socketRef.current.emit('mousePosition', newPosition);
    }
  };

  useEffect(() => {
    const generateRandomColor = () => {
      return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    };
    // Initialize socket connection
    const socket = io(import.meta.env.VITE_BACKEND_URL);
    socketRef.current = socket;

    // Listen for the mousemove event to track local mouse position
    window.addEventListener("mousemove", updateMousePosition);

    // Listen for mouse positions from other users
    socket.on('mousePositionFromServer', (data: { id: string; x: number; y: number }) => {
      console.log(data)
      setClients((prevClients) => ({
        ...prevClients,
        [data.id]: { x: data.x, y: data.y ,color: prevClients[data.id]?.color || generateRandomColor() }
      }));
    });

    // Handle user disconnections
    socket.on('clientDisconnect', (id: string) => {
      setClients((prevClients) => {
        const updatedClients = { ...prevClients };
        delete updatedClients[id];
        return updatedClients;
      });
    });

    // Clean up when the component unmounts
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      socket.off("mousePositionFromServer")
      socket.disconnect();
    };
  }, []);

  return { mousePosition, clients };
};

export default useMousePosition;
