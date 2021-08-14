import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const Button = ({ text, onClick, title, isSelected }) => {
  return (<div
    className={`button-container ${isSelected && 'button-selected'}`}
    onClick={onClick}
    title={title}
  >
    {text}
  </div>)
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  isSelected: PropTypes.bool,
};

Button.defaultProps = {
  title: '',
  isSelected: false,
};

export default Button;