import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const Button = ({ text, onClick }) => {
  return (<div className="button-container" onClick={onClick}>
    {text}
  </div>)
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;