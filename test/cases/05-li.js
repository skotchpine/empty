import React from 'react';
export default () => React.createElement(React.Fragment, {}, [1, 2, 3].map((x, i) => React.createElement('p', {key: i}, x)));