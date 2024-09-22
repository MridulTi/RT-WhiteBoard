import React, { useRef, useState, useEffect } from 'react';
import { Rect, Stage, Layer, Circle, Arrow, Line, Transformer } from 'react-konva';
import { useActions } from '../hooks/useActions';
import { ACTIONS } from '../constants';
import { v4 as uuidv4 } from "uuid";
import { BiSolidPointer } from "react-icons/bi";
import useMousePosition from "../components/mousePosition";
import io from "socket.io-client";
import { useParams } from 'react-router-dom';

const socket = io("http://localhost:3000"); // Connect to the server

function Whiteboard() {
  const { action, setAction, isDraggable,stageRef } = useActions();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: null, y: null });
  const [clients, setClients] = useState<Clients>({});

  const [fillColor, setFillColor] = useState("#fff000");
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircle] = useState([]);
  const [arrows, setArrow] = useState([]);
  const [scribbles, setScribble] = useState([]);

  const strokeColor = "#000";
  const isPainting = useRef(false);
  const currentShapeId = useRef();
  const transformerRef = useRef();
  const {id}=useParams()


  const socketRef = useRef<Socket | null>(null);
  socketRef.current = socket;

  // Update local mouse position and emit it to the backend
  const updateMousePosition = (e: MouseEvent) => {
    const newPosition = { x: e.clientX, y: e.clientY };
    setMousePosition(newPosition);

    // Emit the mouse position to the server
    if (socketRef.current) {
      socketRef.current.emit('mousePosition', newPosition);
    }
  };
  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  };
  useEffect(() => {
    socket.emit("joinSession", id);
    socket.on("joinedSession", (data) => {
      console.log(`Successfully joined session: ${data.sessionId}`);
      socket.on("draw-action", (data) => {
        const { action, shape } = data;
    
        switch (action) {
          case ACTIONS.RECTANGLE:
            setRectangles((prevRectangles) => {
              const existingRect = prevRectangles.find((rect) => rect.id === shape.id);
              if (existingRect) {
                // Update the rectangle if it already exists
                return prevRectangles.map((rect) =>
                  rect.id === shape.id ? { ...rect, ...shape } : rect
                );
              } else {
                // Add new rectangle
                return [...prevRectangles, shape];
              }
            });
            break;
    
          case ACTIONS.CIRCLE:
            setCircle((prevCircles) => {
              const existingCircle = prevCircles.find((circle) => circle.id === shape.id);
              if (existingCircle) {
                // Update the circle if it already exists
                return prevCircles.map((circle) =>
                  circle.id === shape.id ? { ...circle, ...shape } : circle
                );
              } else {
                // Add new circle
                return [...prevCircles, shape];
              }
            });
            break;
    
          case ACTIONS.ARROWRIGHT:
            setArrow((prevArrows) => {
              const existingArrow = prevArrows.find((arrow) => arrow.id === shape.id);
              if (existingArrow) {
                // Update the arrow if it already exists
                return prevArrows.map((arrow) =>
                  arrow.id === shape.id ? { ...arrow, ...shape } : arrow
                );
              } else {
                // Add new arrow
                return [...prevArrows, shape];
              }
            });
            break;
    
          case ACTIONS.SCRIBBLE:
            setScribble((prevScribbles) => {
              const existingScribble = prevScribbles.find((scribble) => scribble.id === shape.id);
              if (existingScribble) {
                // Update the scribble if it already exists
                return prevScribbles.map((scribble) =>
                  scribble.id === shape.id ? { ...scribble, ...shape } : scribble
                );
              } else {
                // Add new scribble
                return [...prevScribbles, shape];
              }
            });
            break;
    
          default:
            break;
        }
      });
      window.addEventListener("mousemove", updateMousePosition);
      socket.on('mousePositionFromServer', (data: { id: string; x: number; y: number }) => {
        console.log(data)
        setClients((prevClients:any) => ({
          ...prevClients,
          [data.id]: { x: data.x, y: data.y ,color: prevClients[data.id]?.color || generateRandomColor() }
        }));
      });
    });
    
    socket.on("sessionError", (data) => {
      console.log(data.message); // Handle error (e.g., show an alert)
    });
   
  
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      socket.off("mousePositionFromServer")
      socket.off("draw-action");
      socket.emit("leaveSession",id)
    };
  }, []);

  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rect) => {
            if (rect.id === currentShapeId.current) {
              const updatedRect = { ...rect, width: x - rect.x, height: y - rect.y };
              socket.emit("draw", { action: ACTIONS.RECTANGLE, shape: updatedRect });
              return updatedRect;
            }
            return rect;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircle((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              const updatedCircle = { ...circle, radius: Math.sqrt((y - circle.y) ** 2 + (x - circle.x) ** 2) };
              socket.emit("draw", { action: ACTIONS.CIRCLE, shape: updatedCircle });
              return updatedCircle;
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROWRIGHT:
        setArrow((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              const updatedArrow = { ...arrow, points: [arrow.points[0], arrow.points[1], x, y] };
              socket.emit("draw", { action: ACTIONS.ARROWRIGHT, shape: updatedArrow });
              return updatedArrow;
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribble((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              const updatedScribble = { ...scribble, points: [...scribble.points, x, y] };
              socket.emit("draw", { action: ACTIONS.SCRIBBLE, shape: updatedScribble });
              return updatedScribble;
            }
            return scribble;
          })
        );
        break;
      default:
        break;
    }
  }

  function onPointerDown() {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const id = uuidv4();
    currentShapeId.current = id;
    isPainting.current = true;

    let shape;
    switch (action) {
      case ACTIONS.RECTANGLE:
        shape = { id, x, y, height: 20, width: 20, fillColor };
        setRectangles((rectangles) => [...rectangles, shape]);
        break;
      case ACTIONS.CIRCLE:
        shape = { id, x, y, radius: 20, fillColor };
        setCircle((circles) => [...circles, shape]);
        break;
      case ACTIONS.ARROWRIGHT:
        shape = { id, points: [x, y, x + 20, y + 20], fillColor };
        setArrow((arrows) => [...arrows, shape]);
        break;
      case ACTIONS.SCRIBBLE:
        shape = { id, points: [x, y], fillColor };
        setScribble((scribbles) => [...scribbles, shape]);
        break;
      default:
        break;
    }

    // Emit the new shape to the server
    socket.emit("draw", { action, shape });
  }

  function onPointerUp() {
    isPainting.current = false;
  }

  function onTransformEnd(e,_id) {
    const shapeNode = e.target;
    const id = _id;
    let actionType;

    if (shapeNode.className === "Rect") actionType = ACTIONS.RECTANGLE;
    if (shapeNode.className === "Circle") actionType = ACTIONS.CIRCLE;
    if (shapeNode.className === "Arrow") actionType = ACTIONS.ARROWRIGHT;
    if (shapeNode.className === "Line") actionType = ACTIONS.SCRIBBLE;

    const updatedShape = {
      id,
      x: shapeNode.x(),
      y: shapeNode.y(),
      width: shapeNode.width ? shapeNode.width() : undefined,
      height: shapeNode.height ? shapeNode.height() : undefined,
      radius: shapeNode.radius ? shapeNode.radius() : undefined,
      points: shapeNode.points ? shapeNode.points() : undefined,
    };
    socket.emit("draw", { action: actionType, shape: updatedShape });
  }

  function onClick(e) {
    if (action !== ACTIONS.SELECT) return;
    const target = e.currentTarget;
    transformerRef.current.nodes([target]);
  }
  function onDragMove() {
    if (action !== ACTIONS.HAND || !dragStartPos.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();
    const dx = x - dragStartPos.current.x;
    const dy = y - dragStartPos.current.y;

    // Update the stage position for panning
    const newPos = {
      x: stage.x() + dx,
      y: stage.y() + dy,
    };

    stage.position(newPos);
    stage.batchDraw();

    // Update the starting position for the next frame
    dragStartPos.current = { x, y };
  }

  return (
    <div className='w-full h-screen overflow-hidden'>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={onPointerDown}
        onPointerMove={action === ACTIONS.HAND ? onDragMove : onPointerMove}
        onPointerUp={onPointerUp}
        draggable={action === ACTIONS.HAND}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            height={window.innerHeight}
            width={window.innerWidth}
            fill="#fff"
            id="bg"
            onClick={() => transformerRef.current.nodes([])}
          />
          {rectangles.map((rect) => (
            <Rect
              key={rect.id}
              x={rect.x}
              y={rect.y}
              stroke={strokeColor}
              strokeWidth={0.5}
              fill={rect.fillColor}
              height={rect.height}
              width={rect.width}
              draggable={isDraggable}
              onClick={onClick}
              onDragEnd={(e)=>onTransformEnd(e,rect.id)}
              onTransformEnd={onTransformEnd}
            />
          ))}
          {circles.map((circle) => (
            <Circle
              key={circle.id}
              radius={circle.radius}
              x={circle.x}
              y={circle.y}
              stroke={strokeColor}
              strokeWidth={0.5}
              fill={circle.fillColor}
              draggable={isDraggable}
              onClick={onClick}
              onDragEnd={(e)=>onTransformEnd(e,circle.id)}
              onTransformEnd={onTransformEnd}
            />
          ))}
          {arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              points={arrow.points}
              stroke={strokeColor}
              strokeWidth={0.5}
              fill={arrow.fillColor}
              draggable={isDraggable}
              onClick={onClick}
              onDragEnd={(e)=>onTransformEnd(e,arrow.id)}
              onTransformEnd={onTransformEnd}
            />
          ))}
          {scribbles.map((scribble) => (
            <Line
              key={scribble.id}
              lineCap='round'
              lineJoin='round'
              points={scribble.points}
              stroke={strokeColor}
              strokeWidth={0.5}
              fill={scribble.fillColor}
              draggable={isDraggable}
              onClick={onClick}
              onDragEnd={(e)=>onTransformEnd(e,scribble.id)}
              onTransformEnd={onTransformEnd}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      {Object.keys(clients).map((id) => {
        console.log(clients[id])
        const { x, y, color } = clients[id];
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              pointerEvents: "none",
              transform: "translate(-50%, -50%)",
            }}
          >
            <BiSolidPointer size={24} style={{ color }} />
            <span style={{ color, fontSize: "10px" }}>{id}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Whiteboard;
