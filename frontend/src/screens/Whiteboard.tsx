import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const Whiteboard: React.FC = () => {
  const [drawing, setDrawing] = useState(false);
  const [clients, setClients] = useState<Record<string, any>>({});
  const [pointers, setPointers] = useState<Record<string, HTMLElement>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerContainerRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const prev = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize canvas and context
    const canvas = canvasRef.current;
    if (canvas) {
      contextRef.current = canvas.getContext("2d");
    }

    // Initialize socket connection
    const url = "http://localhost:3000";
    const socket = io(url);
    socket.connect()
    socketRef.current = socket;

    // Listen for "moving" event from the server
    socket.on("moving", (data) => {
      handleMouseMoveFromServer(data);
    });

    // Listen for "clientdisconnect" event
    socket.on("clientdisconnect", (id) => {
      handleClientDisconnect(id);
    });

    return () => {
      // Clean up socket connection when the component unmounts
      socket.disconnect();
    };
  }, []);

  const drawLine = (fromX: number, fromY: number, toX: number, toY: number) => {
    const context = contextRef.current;
    if (context) {
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.stroke();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { pageX, pageY, type } = e;
    const canvas = canvasRef.current;
    if (!canvas || !socketRef.current) return;

    switch (type) {
      case "mouseup":
        setDrawing(false);
        break;

      case "mousemove":
        if (drawing) {
          drawLine(prev.current.x, prev.current.y, pageX, pageY);
          prev.current = { x: pageX, y: pageY };
        }

        // Emit the mouse movement to the server
        socketRef.current.emit("mousemove", {
          x: pageX,
          y: pageY,
          drawing
        });

        break;

      case "mousedown":
        setDrawing(true);
        prev.current = { x: pageX, y: pageY };
        break;

      default:
        break;
    }
  };

  const handleMouseMoveFromServer = (data: any) => {
    const pointerContainer = pointerContainerRef.current;
    if (!pointerContainer) return;

    if (!clients[data.id]) {
      const newPointer = document.createElement("div");
      newPointer.setAttribute("class", "pointer");
      pointerContainer.appendChild(newPointer);

      setPointers((prev) => ({
        ...prev,
        [data.id]: newPointer
      }));
      console.log(pointers)
    }

    const pointer = pointers[data.id];
    if (pointer) {
      pointer.style.width="12px";
      pointer.style.backgroundColor="blue";
      pointer.style.left = `${data.x}px`;
      pointer.style.top = `${data.y}px`;
    }

    if (data.drawing && clients[data.id]) {
      drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
    }

    setClients((prev) => ({
      ...prev,
      [data.id]: { ...data, updated: Date.now() }
    }));
  };

  const handleClientDisconnect = (id: string) => {
    if (pointers[id]) {
      pointers[id].parentNode?.removeChild(pointers[id]);
    }

    setClients((prev) => {
      const newClients = { ...prev };
      delete newClients[id];
      return newClients;
    });

    setPointers((prev) => {
      const newPointers = { ...prev };
      delete newPointers[id];
      return newPointers;
    });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseMove}
        onMouseUp={handleMouseMove}
        style={{ border: "1px solid black" }}
      >
      <div ref={pointerContainerRef} id="pointers"></div>
      </canvas>
    </div>
  );
};

export default Whiteboard;
