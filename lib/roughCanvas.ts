import rough from "roughjs";

class RoughCanvas {
  private roughCanvas: any;
  private generator: any;
  constructor() {}
  _rect(options: any) {
    const { context, shape, key, config } = options;
    context.fillStyle = "transparent";
    context.rect(0, 0, shape.width(), shape.height());
    context.fillStrokeShape(shape);

    this.roughCanvas = rough.canvas(context.canvas);
    this.generator = this.roughCanvas.generator;
    const rect = this.generator.rectangle(0, 0, config.width, config.height, {
      fill: config.fill,
      stroke: config.stroke,
      hachureAngle: config.hachureAngle,
      hachureGap: config.hachureGap,
      fillWeight: config.fillWeight,
      strokeWidth: config.strokeWidth,
      roughness: config.roughness,
      seed: config.seed,
    });
    this.roughCanvas.draw(rect);
  }
  _ellipse(options: any) {
    const { context, shape, config } = options;
    context.fillStyle = "transparent";
    context.fillStrokeShape(shape);
    
    const width = config.width;
    const height = config.height;
    this.roughCanvas = rough.canvas(context.canvas);
    this.generator = this.roughCanvas.generator;
    const ellipse = this.generator.ellipse(
      width / 2,
      height / 2,
      config.width,
      config.height,
      {
        fill: config.fill,
        stroke: config.stroke,
        hachureAngle: config.hachureAngle,
        hachureGap: config.hachureGap,
        fillWeight: config.fillWeight,
        strokeWidth: config.strokeWidth,
        roughness: config.roughness,
        seed: config.seed,
      }
    );
    this.roughCanvas.draw(ellipse);
  }
  _diamond(options: any) {
    const { context, shape, key, config } = options;
    context.fillStyle = "transparent";
    context.beginPath();
    context.moveTo(0, shape.height() / 2);
    context.lineTo(shape.width() / 2, 0);
    context.lineTo(shape.width(), shape.height() / 2);
    context.lineTo(shape.width() / 2, shape.height());
    context.closePath();
    context.fillStrokeShape(shape);

    this.roughCanvas = rough.canvas(context.canvas);
    this.generator = this.roughCanvas.generator;
    const diamond = this.generator.polygon(
      [
        [0, shape.height() / 2],
        [shape.width() / 2, 0],
        [shape.width(), shape.height() / 2],
        [shape.width() / 2, shape.height()],
      ],
      {
        fill: config.fill,
        stroke: config.stroke,
        hachureAngle: config.hachureAngle,
        hachureGap: config.hachureGap,
        fillWeight: config.fillWeight,
        strokeWidth: config.strokeWidth,
        roughness: config.roughness,
        seed: config.seed,
      }
    );
    this.roughCanvas.draw(diamond);
  }
}

export default new RoughCanvas();
