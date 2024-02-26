import { Shape, Transformer } from "react-konva";
import roughCanvas from "@/lib/roughCanvas";
import React, { useEffect, useRef } from "react";
import Konva from "konva";

type RoughRectProps = {
    x: number
    y: number
    width: number
    height: number
    rotation: number
    fill: string
    stroke: string
    strokeWidth: number,
    fillWeight: number,
    hachureGap: number,
    hachureAngle: number,
    seed: number,
    objectId: string,
    isSelected: boolean,
    onSelect: () => void,
    onChange: (newProps: RoughRectProps) => void
    transformerRef: React.RefObject<Konva.Transformer | null>
}
const RoughRect = (props:RoughRectProps) => {
  const shapeRef = useRef<Konva.Shape | null>(null);
  useEffect(()=>{
    if(props.isSelected && props.transformerRef.current && shapeRef.current){
      props.transformerRef.current?.nodes([shapeRef.current]);
      props.transformerRef.current?.getLayer()?.batchDraw();
    }
  },[props.isSelected, props.transformerRef])
  return (
    <>
      <Shape
        onClick={props.onSelect}
        onTap={props.onSelect}
        ref={shapeRef}
        name={"roughrectangle"}
        x={props.x}
        y={props.y}
        width={props.width}
        height={props.height}
        rotation={props.rotation}
        stroke={"transparent"}
        strokeWidth={0}
        objectId={props.objectId}
        draggable={props.isSelected}
        rotationEnabled={props.isSelected}
        sceneFunc={(context, shape) => {
          roughCanvas._rect({
            context,
            shape,
            key: "roughRect",
            config: {
              width: shape.width(),
              height: shape.height(),
              fill: props.fill,
              stroke: props.stroke,
              hachureAngle: props.hachureAngle,
              hachureGap: props.hachureGap,
              fillWeight: props.fillWeight,
              strokeWidth: props.strokeWidth,
              roughness: 1.5,
              seed: props.seed
            },
          });
        }}
        onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => {
          props.onChange({
            ...props,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={(_e: Konva.KonvaEventObject<Event>) => {
          const node = shapeRef.current;
          const scaleX = node?.scaleX() || 1;
          const scaleY = node?.scaleY() || 1;
          node?.scaleX(1);
          node?.scaleY(1);
          props.onChange({
            ...props,
            x: node?.x() || props.x,
            y: node?.y() || props.y,
            width: (node?.width() || props.width) * scaleX,
            height: (node?.height() || props.height) * scaleY,
            rotation: node?.rotation() || props.rotation,
          });
        }}
      />
    </>
  );
}

export default RoughRect