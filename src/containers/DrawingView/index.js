import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';

import useHistory from '../../hooks/useHistory';
import ToolBar from './ToolBar';
import { createElement, getElementByPosition } from './utils';
import {
  DRAW_LINE,
  SELECT,
  DRAWING,
  MOVING,
  NONE_ACTION,
} from './constants';
import './styles.css';

const DrawingView = () => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState(NONE_ACTION);
  const [tool, setTool] = useState(DRAW_LINE);
  const [selectedElement, setSelectedElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = document.getElementById("drawing-canvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const updateElement = (id, x1, y1, clientX, clientY, tool) => {
    const updatedElement = createElement(id, x1, y1, clientX, clientY, tool);

    const elementsCopy = [...elements];
    elementsCopy[id] = updatedElement;
    setElements(elementsCopy, true);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    if(tool === SELECT) {
      e.target.style.cursor = getElementByPosition(clientX, clientY, elements) ? 'move' : 'default';
    }

    if (action === DRAWING) {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === MOVING) {
      const { id, x1, x2, y1, y2, tool, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      updateElement(id, newX, newY, newX + width, newY + height, tool);
    }
  };

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    if (tool === SELECT) {
      const element = getElementByPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setElements(prevState => prevState);
        setAction(MOVING);
      }
    } else {
      setAction(DRAWING);
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool);
      setElements(prevState => [...prevState, element]);
    }
  };

  const handleMouseUp = () => {
    setAction(NONE_ACTION);
    setSelectedElement(null);
  };

  return (<div className="drawing-view-container">
    <ToolBar
      setTool={setTool}
      undo={undo}
      redo={redo}
      tool={tool}
    />
    <div className="drawing-screen">
      <canvas
        id="drawing-canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        My canvas
      </canvas>
    </div>
  </div>)
};

export default DrawingView;
