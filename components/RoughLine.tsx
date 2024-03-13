import React, { useRef, useEffect } from "react";
import { Circle, Shape } from "react-konva";
import roughCanvas from "@/lib/roughCanvas";
import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

type RoughLineProps = {
  points: { x: number; y: number }[];
  stroke: string;
  strokeWidth: number;
  seed: number;
  objectId: string;
  isSelected: boolean;
  onPointMove: (points: { x: number; y: number }[]) => void;
  onSelect: () => void;
  transformerRef: React.RefObject<Konva.Transformer | null>;
  onChange: (newProps: RoughLineProps) => void;
};

const RoughLine = (props: RoughLineProps) => {
  const shapeRef = useRef<Konva.Shape | null>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);
  const handlePointMove = (
    index: number,
    event: KonvaEventObject<DragEvent>
  ) => {
    const newPoints = [...props.points];
    newPoints[index] = { x: event.target.x(), y: event.target.y() };
    props.onPointMove(newPoints);
  };

  const handleDragMove = (event: KonvaEventObject<DragEvent>) => {
    // Use dx and dy from the event for the delta
    const deltaX = event.evt.movementX;
    const deltaY = event.evt.movementY;

    // console.log("delta", deltaX, deltaY);

    // Update all points based on delta
    const newPoints = props.points.map((point) => ({
      x: point.x + deltaX,
      y: point.y + deltaY,
    }));

    // Invoke callback with new points
    props.onPointMove(newPoints);
    const shape = shapeRef.current;
    shape?.draw();
  };

  // console.log("RoughLine props", props.points, props.points.map(({x,y}) => [x,y]));

  return (
    <>
      <Shape
        ref={shapeRef}
        onMouseEnter={() => {
          // console.log("mouse enter");
        }}
        stroke="black"
        strokeWidth={2}
        onClick={props.onSelect}
        onTap={props.onSelect}
        draggable={props.isSelected}
        onDragMove={(e) => {
          handleDragMove(e);
        }}
        sceneFunc={(context, shape) => {
          roughCanvas._line({
            context,
            shape,
            config: {
              points: props.points.map(({ x, y }) => [x, y]),
              stroke: props.stroke,
              strokeWidth: props.strokeWidth,
              roughness: 1.5,
              seed: props.seed,
            },
          });
          context.fillStrokeShape(shape);
        }}
        hitFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(props.points[0].x, props.points[0].y);
          props.points.forEach((point) => {
            context.lineTo(point.x, point.y);
          });
          context.closePath();
          context.fillStrokeShape(shape);
        }}
      />
      {props.points.map((point, index) => (
        <Circle
          key={index}
          x={point.x}
          y={point.y}
          radius={5}
          fill="red"
          selected={false}
          visible={props.isSelected}
          draggable={true}
          onDragMove={(e) => handlePointMove(index, e)}
        />
      ))}
    </>
  );
};

export default RoughLine;
