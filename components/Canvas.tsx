import { Stage, Layer, Transformer } from "react-konva";
import { useEffect, useRef, useState } from "react";
import CanvasElement from "./CanvasElement";
import rough from "roughjs";
import { v4 as uuidv4 } from "uuid";
import Konva from "konva";

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
};

export default function Canvas() {
  const [elementsOnCanvas, setElementsOnCanvas] = useState<
    (CanvasElementsProps | CanvasLineProps)[]
  >([]);
  const [previewElement, setpreviewElement] = useState<
    CanvasElementsProps | CanvasLineProps | null
  >(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [selectedTool, setSelectedTool] = useState("line");
  const [selectedShapeId, setselectedShapeId] = useState<string | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  useEffect(() => {
    if (!transformerRef.current) {
      return;
    }

    // Assuming `stageRef` is a ref to your `Stage` component
    const stage = stageRef.current;
    // Find the selected shape by its ID
    const selectedShape = stage?.findOne(`.${selectedShapeId}`);

    // If there is a selected shape, attach the transformer to it
    if (selectedShape) {
      transformerRef.current.nodes([selectedShape]);
    } else {
      // If no shape is selected, clear the transformer
      transformerRef.current.nodes([]);
    }

    // Re-draw the layer to update the transformer
    transformerRef?.current?.getLayer()?.batchDraw();
  }, [selectedShapeId]);

  const checkDeselect = (event: any) => {
    // deselect when clicked on empty area
    if (selectedShapeId === null) return;
    const clickedOnEmpty = event.target === event.target.getStage();
    if (clickedOnEmpty) {
      setselectedShapeId(null);
    }
  };

  const handleMouseDown = (event: any) => {
    checkDeselect(event);
    // setIsDrawing(true);
    const { x, y } = event.target.getStage().getPointerPosition();
    if (selectedTool === "line") {
      setpreviewElement({
        type: selectedTool,
        points: [{ x, y }],
        stroke: "black",
        strokeWidth: 2,
        seed: rough.newSeed(),
        objectId: uuidv4(),
      });
    } else {
      setpreviewElement({
        type: selectedTool,
        x,
        y,
        width: 0,
        height: 0,
        rotation: 0,
        fill: "red",
        stroke: "black",
        strokeWidth: 1,
        fillWeight: 3,
        hachureGap: 8,
        hachureAngle: 60,
        seed: rough.newSeed(),
        objectId: uuidv4(),
      });
    }
  };

  useEffect(() => {
    console.log(elementsOnCanvas);
  }, [elementsOnCanvas]);

  const handleMouseUp = (_event: any) => {
    setIsDrawing(false);
    if (!previewElement) {
      return;
    }

    if (
      previewElement.type !== "line" &&
      previewElement.width === 0 &&
      previewElement.height === 0
    ) {
      return;
    }

    if (previewElement.type === "line" && previewElement.points.length < 2) {
      // Exit if it's a line but doesn't have enough points
      return;
    }

    let elementToAdd = previewElement;

    if (previewElement.type === "line" && previewElement.points.length === 2) {
      // Modify previewElement to include a midpoint
      setpreviewElement((prevPreviewElement) => {
        if (!prevPreviewElement || prevPreviewElement.type !== "line") {
          return prevPreviewElement; // Just a safety check
        }

        const midpoint = {
          x:
            (prevPreviewElement.points[0].x + prevPreviewElement.points[1].x) /
            2,
          y:
            (prevPreviewElement.points[0].y + prevPreviewElement.points[1].y) /
            2,
        };

        const updatedPoints = [
          prevPreviewElement.points[0],
          midpoint,
          prevPreviewElement.points[1],
        ];

        const updatedPreviewElement = {
          ...prevPreviewElement,
          points: updatedPoints,
        };

        // Update elementToAdd for adding to elementsOnCanvas
        elementToAdd = updatedPreviewElement;

        // Return the updated state but don't add it here yet
        return updatedPreviewElement;
      });
    }

    // Now, add the elementToAdd to elementsOnCanvas
    // This setTimeout ensures that the state update above is processed before this update.
    setTimeout(() => {
      setElementsOnCanvas((prevElements) => [...prevElements, elementToAdd]);
      setselectedShapeId(elementToAdd.objectId);
    }, 0);

    // Reset previewElement
    setpreviewElement(null);
  };

  const handleMouseMove = (event: any) => {
    if (!isDrawing) {
      return;
    } else if (!previewElement) {
      return;
    }
    const { x, y } = event.target.getStage().getPointerPosition();
    if (previewElement?.type === "line") {
      setpreviewElement({
        ...previewElement,
        points: [previewElement.points[0], { x, y }],
      });
    } else {
      setpreviewElement({
        ...previewElement,
        width: x - previewElement.x,
        height: y - previewElement.y,
      });
    }
  };

  return (
    <main>
      <button onClick={() => setIsDrawing(true)}>Clicky</button>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {elementsOnCanvas.map((element, _index) => {
            return (
              <CanvasElement
                key={element.objectId}
                {...element}
                setselectedShapeId={setselectedShapeId}
                selectedShapeId={selectedShapeId}
                elementsOnCanvas={elementsOnCanvas}
                setElementsOnCanvas={setElementsOnCanvas}
                transformerRef={transformerRef}
              />
            );
          })}
          {isDrawing &&
            previewElement &&
            previewElement.width !== 0 &&
            previewElement.height !== 0 && (
              <CanvasElement
                {...previewElement}
                setselectedShapeId={setselectedShapeId}
                selectedShapeId={selectedShapeId}
                elementsOnCanvas={elementsOnCanvas}
                setElementsOnCanvas={setElementsOnCanvas}
                transformerRef={transformerRef}
              />
            )}
          <Transformer
            ref={transformerRef}
            flipEnabled={false}
            padding={10}
            borderStroke="#0611d4"
            anchorStroke="#0611d4"
            rotateLineVisible={false}
            rotateAnchorOffset={20}
            anchorSize={7}
            keepRatio={false}
            rotateAnchorCursor={"grab"}
            rotationSnaps={[0, 90, 180, 270]}
            rotationSnapTolerance={3}
            anchorStyleFunc={(anchor: any) => {
              if (anchor.getName().toString() === "rotater _anchor") {
                anchor.cornerRadius(10);
                return anchor;
              }
            }}
          />
        </Layer>
      </Stage>
    </main>
  );
}
