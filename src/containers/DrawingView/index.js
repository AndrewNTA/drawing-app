import React, { useLayoutEffect, useState } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import Button from '../../components/Button';
import './styles.css';

const generator = rough.generator();

const createLineElement = (x1, y1, x2, y2) => {
  const roughElement = generator.line(x1, y1, x2, y2);
  return { x1, y1, x2, y2, roughElement }
};

const DrawingView = () => {
  const [elements, setElements] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useLayoutEffect(() => {
    const canvas = document.getElementById("drawing-canvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const handleMouseMove = (e) => {
    if(!isDrawing) {
      return;
    }

    const { clientX, clientY } = e;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createLineElement(x1, y1, clientX, clientY);

    const newElements = [...elements];
    newElements[index] = updatedElement;
    setElements(newElements);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);

    const { clientX, clientY } = e;
    const element = createLineElement(clientX, clientY, clientX, clientY);
    setElements(prevState => [...prevState, element]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (<div className="drawing-view-container">
    <div className="drawing-menu-bar">
      <Button
        onClick={() => {}}
        text={'Selection'}
        title={'Select an element and move'}
      />
      <Button
        onClick={() => {}}
        text={'Line'}
        title={'Draw a line element, you can resize this element'}
      />
      <Button
        onClick={() => {}}
        text={'Rectangle'}
        title={'Draw a rectangle element, you can resize this element'}
      />
      <Button onClick={() => {}} text={'Undo'}/>
      <Button onClick={() => {}} text={'Re-undo'}/>
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
