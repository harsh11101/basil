import React, { use, useEffect } from "react";
import RoughDiamond from "./RoughDiamond";
import RoughEllipse from "./RoughEllipse";
import RoughRect from "./RoughRect";
import Konva from "konva";
import RoughLine from "./RoughLine";

type CanvasElementsProps = {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fillWeight: number;
  hachureGap: number;
  hachureAngle: number;
  seed: number;
  objectId: string;
};

type CanvasLineProps = {
  type: string;
  points: { x: number; y: number }[];
  stroke: string;
  strokeWidth: number;
  seed: number;
  objectId: string;
  setselectedShapeId: (id: string) => void;
  selectedShapeId: string | null;
  elementsOnCanvas: CanvasElementsProps[];
  setElementsOnCanvas: (elements: CanvasElementsProps[]) => void;
  transformerRef: React.RefObject<Konva.Transformer | null>;
};

type CanvasElementProps = {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fillWeight: number;
  hachureGap: number;
  hachureAngle: number;
  seed: number;
  objectId: string;
  setselectedShapeId: (id: string) => void;
  selectedShapeId: string | null;
  elementsOnCanvas: CanvasElementsProps[];
  setElementsOnCanvas: (elements: CanvasElementsProps[]) => void;
  transformerRef: React.RefObject<Konva.Transformer | null>;
};
const CanvasElement = (props: CanvasElementProps | CanvasLineProps) => {
  if (props.type === "rectangle") {
    return (
      <RoughRect
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        rotation={props.rotation}
        fill={props.fill}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        fillWeight={props.fillWeight}
        hachureGap={props.hachureGap}
        hachureAngle={props.hachureAngle}
        seed={props.seed}
        objectId={props.objectId}
        isSelected={props.selectedShapeId === props.objectId}
        onSelect={() => {
          props.setselectedShapeId(props.objectId);
        }}
        onChange={(changedAtrributes: {
          x?: number;
          y?: number;
          width?: number;
          height?: number;
        }) => {
          const elements = props.elementsOnCanvas.map((element) => {
            if (element.objectId === props.objectId) {
              return {
                ...element,
                ...changedAtrributes,
              };
            }
            return element;
          });
          props.setElementsOnCanvas(elements);
        }}
        transformerRef={props.transformerRef}
      />
    );
  } else if (props.type === "ellipse") {
    return (
      <RoughEllipse
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        rotation={props.rotation}
        fill={props.fill}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        fillWeight={props.fillWeight}
        hachureGap={props.hachureGap}
        hachureAngle={props.hachureAngle}
        seed={props.seed}
        objectId={props.objectId}
        isSelected={props.selectedShapeId === props.objectId}
        onSelect={() => {
          props.setselectedShapeId(props.objectId);
        }}
        onChange={(changedAtrributes: {
          x?: number;
          y?: number;
          width?: number;
          height?: number;
        }) => {
          const elements = props.elementsOnCanvas.map((element) => {
            if (element.objectId === props.objectId) {
              return {
                ...element,
                ...changedAtrributes,
              };
            }
            return element;
          });
          props.setElementsOnCanvas(elements);
        }}
        transformerRef={props.transformerRef}
      />
    );
  } else if (props.type === "diamond") {
    return (
      <RoughDiamond
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        rotation={props.rotation}
        fill={props.fill}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        fillWeight={props.fillWeight}
        hachureGap={props.hachureGap}
        hachureAngle={props.hachureAngle}
        seed={props.seed}
        objectId={props.objectId}
        isSelected={props.selectedShapeId === props.objectId}
        onSelect={() => {
          props.setselectedShapeId(props.objectId);
        }}
        onChange={(changedAtrributes: {
          x?: number;
          y?: number;
          width?: number;
          height?: number;
          rotation?: number;
        }) => {
          const elements = props.elementsOnCanvas.map((element) => {
            if (element.objectId === props.objectId) {
              return {
                ...element,
                ...changedAtrributes,
              };
            }
            return element;
          });
          props.setElementsOnCanvas(elements);
        }}
        transformerRef={props.transformerRef}
      />
    );
  } else if (props.type === "line") {
    return (
      <RoughLine
        points={props.points}
        stroke={props.stroke}
        strokeWidth={props.strokeWidth}
        seed={props.seed}
        objectId={props.objectId}
        isSelected={props.selectedShapeId === props.objectId}
        onPointMove={(newPoints) => {
          const elements = props.elementsOnCanvas.map((element) => {
            if (element.objectId === props.objectId) {
              return {
                ...element,
                points: newPoints,
              };
            }
            return element;
          });
          props.setElementsOnCanvas(elements);
        }}
        onSelect={() => {
          props.setselectedShapeId(props.objectId);
        }}
        onChange={(changedAtrributes: {
          points?: { x: number; y: number }[];
          rotation?: number;
        }) => {
          const elements = props.elementsOnCanvas.map((element) => {
            if (element.objectId === props.objectId) {
              return {
                ...element,
                ...changedAtrributes,
              };
            }
            return element;
          });
          props.setElementsOnCanvas(elements);
        }}
        transformerRef={props.transformerRef}
      />
    );
  }
};

export default CanvasElement;
