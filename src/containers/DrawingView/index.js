import React from 'react';
import Button from '../../components/Button';
import './styles.css';

const DrawingView = () => {
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
  </div>)
};

export default DrawingView;
