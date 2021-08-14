import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import Button from '../../components/Button';
import './styles.css';

const generator = rough.generator();

const DRAW_LINE = 'DRAW_LINE';
const DRAW_RECTANGLE = 'DRAW_RECTANGLE';
const SELECT = 'SELECT';

const NONE_ACTION = 'NONE_ACTION';
const DRAWING = 'DRAWING';
const MOVING = 'MOVING';

const createElement = (id, x1, y1, x2, y2, tool) => {
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

const getElementByPosition = (x, y, elements) => {
  return elements.find(ele => isWithinElement(x, y, ele));
};

const useHistory = initialState => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === 'function' ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevState => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex(prevState => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex(prevState => prevState + 1);
  return [history[index], setState, undo, redo];
};

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
    <div className="drawing-menu-bar">
      <Button
        onClick={() => {setTool(SELECT)}}
        text={'Select'}
        title={'Select an element and move'}
        isSelected={tool === SELECT}
      />
      <Button
        onClick={() => {setTool(DRAW_LINE)}}
        text={'Line'}
        title={'Draw a line element, you can resize this element'}
        isSelected={tool === DRAW_LINE}
      />
      <Button
        onClick={() => {setTool(DRAW_RECTANGLE)}}
        text={'Rectangle'}
        title={'Draw a rectangle element, you can resize this element'}
        isSelected={tool === DRAW_RECTANGLE}
      />
      <Button onClick={undo} text={'Undo'}/>
      <Button onClick={redo} text={'Redo'}/>
    </div>
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
