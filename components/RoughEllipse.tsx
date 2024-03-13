import { Shape } from "react-konva";
import roughCanvas from "@/lib/roughCanvas";
import Konva from "konva";
import { useEffect, useRef } from "react";

type RoughEllipseProps = {
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
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newProps: RoughEllipseProps) => void;
  transformerRef: React.RefObject<Konva.Transformer | null>;
};

const RoughEllipse = (props: RoughEllipseProps) => {
  const shapeRef = useRef<Konva.Shape | null>(null);
  useEffect(() => {
    if (props.isSelected && props.transformerRef.current && shapeRef.current) {
      props.transformerRef.current?.nodes([shapeRef.current]);
      props.transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [props.isSelected, props.transformerRef]);
  const isFillTransparent = (fill: string) => {
    return !fill || fill === "transparent";
  };
  return (
    <Shape
      onClick={(e) => {
        props.onSelect();
      }}
      onTap={props.onSelect}
      ref={shapeRef}
      name={"roughellipse"}
      hitFunc={(context, shape) => {
        const centerX = props.width / 2;
        const centerY = props.height / 2;
        const radiusX = Math.abs(props.width) / 2;
        const radiusY = Math.abs(props.height) / 2;
        const strokeAdjustment = props.strokeWidth / 2;

        if (isFillTransparent(props.fill)) {
          // For stroke-only, approximate the boundary. This will not be perfect but provides a basic approximation.
          context.beginPath();
          // Outer ellipse
          context.ellipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            0,
            0,
            Math.PI * 2
          );
          // Inner ellipse approximation (reduces the hit area slightly inside the actual stroke)
          context.ellipse(
            centerX,
            centerY,
            radiusX - strokeAdjustment,
            radiusY - strokeAdjustment,
            0,
            0,
            Math.PI * 2,
            true
          );
          context.closePath();
        } else {
          // For filled ellipses, use a standard ellipse hit region
          context.beginPath();
          context.ellipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            0,
            0,
            Math.PI * 2
          );
          context.closePath();
        }

        context.fillStrokeShape(shape);
      }}
      x={props.x}
      y={props.y}
      width={props.width}
      height={props.height}
      stroke={"transparent"}
      strokeWidth={0}
      fill={"transparent"}
      objectId={props.objectId}
      draggable={props.isSelected}
      sceneFunc={(context, shape) => {
        roughCanvas._ellipse({
          context,
          shape,
          key: "roughEllipse",
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
            seed: props.seed,
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
  );
};

export default RoughEllipse;
