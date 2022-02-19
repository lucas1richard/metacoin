import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className, ...rest }) => (
  <input
    className={`border border-1 border-solid block sm:text-sm border-gray-600 rounded py-1 px-3 ${className}`}
    {...rest}
  />
);

Input.defaultProps = {
  className: '',
};

Input.propTypes = {
  className: PropTypes.string,
};

export default Input;
