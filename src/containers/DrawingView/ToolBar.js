import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../components/Button';
import { DRAW_LINE, DRAW_RECTANGLE, SELECT } from './constants';

const ToolBar = ({ tool, setTool, undo, redo }) => {
  return (
    <div className="drawing-tool-bar">
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
  )
};

ToolBar.propTypes = {
  tool: PropTypes.string.isRequired,
  setTool: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
};

export default ToolBar;
