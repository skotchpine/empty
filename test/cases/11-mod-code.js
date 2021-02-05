import React from 'react';
console.log('outside');
export default ({}) => {
console.log('inside');
return React.createElement(React.Fragment, {}, null);
};
