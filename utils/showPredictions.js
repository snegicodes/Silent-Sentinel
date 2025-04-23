import {throttle} from "lodash";

export const showPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Save the current context state
  ctx.save();
  
  // Mirror the context horizontally
  ctx.scale(-1, 1);
  ctx.translate(-ctx.canvas.width, 0);

  // Fonts
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];

    const isPerson = prediction.class === "person";

    // bounding box
    ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // fill the color
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`; // Set the fill color to red
    ctx.fillRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    // For text, we need to flip it back so it's readable
    ctx.scale(-1, 1);
    ctx.translate(-x * 2 - textWidth - 4, 0);
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
    ctx.translate(x * 2 + textWidth + 4, 0);
    ctx.scale(-1, 1);
  });

  // Restore the context state
  ctx.restore();
};