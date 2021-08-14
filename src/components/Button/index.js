import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

const Button = ({ text, onClick, title }) => {
  return (<div className="button-container" onClick={onClick} title={title}>
    {text}
  </div>)
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

Button.defaultProps = {
  title: ''
};

export default Button;