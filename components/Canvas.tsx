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

export default function Canvas() {
  const [elementsOnCanvas, setElementsOnCanvas] = useState<
    CanvasElementsProps[]
  >([]);
  const [previewElement, setpreviewElement] =
    useState<CanvasElementsProps | null>(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [selectedTool, setSelectedTool] = useState("ellipse");
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
  };

  const handleMouseUp = (_event: any) => {
    setIsDrawing(false);
    if (
      !previewElement ||
      (previewElement.width === 0 && previewElement.height === 0)
    ) {
      return;
    }
    setElementsOnCanvas((prevElements) => {
      const newElements = [...prevElements, previewElement];
      return newElements;
    });
    setpreviewElement(null);
    setselectedShapeId(previewElement.objectId);
  };

  const handleMouseMove = (event: any) => {
    if (!isDrawing) {
      return;
    }
    const { x, y } = event.target.getStage().getPointerPosition();
    if (previewElement) {
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
            // console.log(
            //   <CanvasElement
            //     key={element.objectId}
            //     {...element}
            //     setselectedShapeId={setselectedShapeId}
            //     selectedShapeId={selectedShapeId}
            //     elementsOnCanvas={elementsOnCanvas}
            //     setElementsOnCanvas={setElementsOnCanvas}
            //     transformerRef={transformerRef}
            //   />
            // );
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
