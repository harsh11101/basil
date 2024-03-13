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

  _line(options: any) {
    const { context, shape, config } = options;
    // Ensure the roughCanvas and generator are initialized
    if (!this.roughCanvas || !this.generator) {
      this.roughCanvas = rough.canvas(context.canvas);
      this.generator = this.roughCanvas.generator;
    }
    // Assuming config.points is an array of [x, y] pairs
    if (config.points.length > 1) {
      let pathString = `M ${config.points[0][0]} ${config.points[0][1]}`;
      for (let i = 1; i < config.points.length; i++) {
        pathString += ` L ${config.points[i][0]} ${config.points[i][1]}`;
      }

      // Use the path method of roughjs to draw the path
      const path = this.generator.path(pathString, {
        stroke: config.stroke,
        strokeWidth: config.strokeWidth,
        roughness: config.roughness,
        seed: config.seed,
      });

      // Draw the path on the canvas
      this.roughCanvas.draw(path);
    } else {
      
    }
    // Draw the line on the canvas
    // this.roughCanvas.draw(line);
  }
}

export default new RoughCanvas();
