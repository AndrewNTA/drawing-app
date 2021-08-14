import React, { useRef, useLayoutEffect } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import Button from '../../components/Button';
import './styles.css';

const generator = rough.generator();

const DrawingView = () => {
  const menuBarRef = useRef(null);
  const menuBarHeight = menuBarRef.current && menuBarRef.current.clientHeight || 0;

  useLayoutEffect(() => {
    const canvas = document.getElementById("drawing-canvas");
    const context = canvas.getContext("2d");

    context.strokeRect(100, 100, 150, 100);

    const roughCanvas = rough.canvas(canvas);
    const rect = generator.rectangle(200, 200, 50, 90);
    roughCanvas.draw(rect);
  });

  return (<div className="drawing-view-container">
    <div className="drawing-menu-bar" ref={menuBarRef}>
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
        height={window.innerHeight - menuBarHeight}
      >
        Canvas
      </canvas>
    </div>
  </div>)
};

export default DrawingView;
