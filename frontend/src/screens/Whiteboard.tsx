import React, { useRef, useState } from 'react';
import { Rect, Stage, Layer, Circle, Arrow, Line, Transformer } from 'react-konva';
import { useActions } from '../hooks/useActions';
import { ACTIONS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

function Whiteboard() {
  const { action, setAction, isDraggable, stageRef } = useActions();

  const [fillColor, setFillColor] = useState('#fff000');
  const [rectangles, setRectangles] = useState([]);
  const [circles, setCircle] = useState([]);
  const [arrows, setArrow] = useState([]);
  const [scribbles, setScribble] = useState([]);

  const strokeColor = '#000';
  const isPainting = useRef(false);
  const currentShapeId = useRef(null);
  const transformerRef = useRef(null);

  // Ref to track the starting point of the drag for the panning action
  const dragStartPos = useRef(null);

  function onPointerMove() {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const { x, y } = stage.getPointerPosition();

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) =>
          rectangles.map((rect) => {
            if (rect.id === currentShapeId.current) {
              return {
                ...rect,
                width: x - rect.x,
                height: y - rect.y,
              };
            }
            return rect;
          })
        );
        break;
      case ACTIONS.CIRCLE:
        setCircle((circles) =>
          circles.map((circle) => {
            if (circle.id === currentShapeId.current) {
              return {
                ...circle,
                radius: ((y - circle.y) ** 2 + (x - circle.x) ** 2) ** 0.5,
              };
            }
            return circle;
          })
        );
        break;
      case ACTIONS.ARROWRIGHT:
        setArrow((arrows) =>
          arrows.map((arrow) => {
            if (arrow.id === currentShapeId.current) {
              return {
                ...arrow,
                points: [arrow.points[0], arrow.points[1], x, y],
              };
            }
            return arrow;
          })
        );
        break;
      case ACTIONS.SCRIBBLE:
        setScribble((scribbles) =>
          scribbles.map((scribble) => {
            if (scribble.id === currentShapeId.current) {
              return {
                ...scribble,
                points: [...scribble.points, x, y],
              };
            }
            return scribble;
          })
        );
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

    if (action === ACTIONS.HAND) {
      dragStartPos.current = { x, y };
      return;
    }

    switch (action) {
      case ACTIONS.RECTANGLE:
        setRectangles((rectangles) => [
          ...rectangles,
          {
            id,
            x,
            y,
            height: 20,
            width: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.CIRCLE:
        setCircle((circles) => [
          ...circles,
          {
            id,
            x,
            y,
            radius: 20,
            fillColor,
          },
        ]);
        break;
      case ACTIONS.ARROWRIGHT:
        setArrow((arrows) => [
          ...arrows,
          {
            id,
            points: [x, y, x + 20, y + 20],
            fillColor,
          },
        ]);
        break;
      case ACTIONS.SCRIBBLE:
        setScribble((scribbles) => [
          ...scribbles,
          {
            id,
            points: [x, y],
            fillColor,
          },
        ]);
        break;
    }
  }

  function onPointerUp() {
    isPainting.current = false;

    if (action === ACTIONS.HAND) {
      dragStartPos.current = null;
    }
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
    <div className="w-full h-screen overflow-hidden">
      {/* Canvas */}
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
            onClick={() => {
              transformerRef.current.nodes([]);
            }}
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
            />
          ))}
          {scribbles.map((scribble) => (
            <Line
              key={scribble.id}
              lineCap="round"
              lineJoin="round"
              points={scribble.points}
              stroke={strokeColor}
              strokeWidth={0.5}
              fill={scribble.fillColor}
              draggable={isDraggable}
              onClick={onClick}
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}

export default Whiteboard;
