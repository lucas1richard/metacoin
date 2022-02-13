import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, type, ...rest }) => {
  let borderColor = 'border-gray-600';
  let bgColor = 'bg-white';
  let textColor = 'text-gray-900;'
  if (type === 'primary') {
    borderColor = 'border-blue-700';
    bgColor = 'bg-blue-600';
    textColor = 'text-white';
  }
  return (
    <button
      className={`border border-1 border-solid ${borderColor} rounded py-1 px-2 ${bgColor} ${textColor}`}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
};

export default Button;
