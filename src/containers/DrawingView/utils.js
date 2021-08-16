import rough from 'roughjs/bundled/rough.esm';

import {
  DRAW_LINE,
  DRAW_RECTANGLE
} from "./constants";

const generator = rough.generator();

export const createElement = (id, x1, y1, x2, y2, tool) => {
  const roughElement = tool === DRAW_LINE
    ? generator.line(x1, y1, x2, y2)
    : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { id, x1, y1, x2, y2, tool, roughElement }
};

const isWithinElement = (x, y, element) => {
  const { tool, x1, x2, y1, y2 } = element;
  if (tool === DRAW_RECTANGLE) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  }
  if (tool === DRAW_LINE) {
    const pointA = { x: x1, y: y1 };
    const pointB = { x: x2, y: y2 };
    const pointC = { x, y };
    const offset = distance(pointA, pointB) - (distance(pointA, pointC) + distance(pointB, pointC));
    return Math.abs(offset) < 1;
  }
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const getElementByPosition = (x, y, elements) => {
  return elements.find(ele => isWithinElement(x, y, ele));
};
