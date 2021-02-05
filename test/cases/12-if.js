import React from 'react';
export default ({x}) => {
return x ? (()=>{
console.log('hi');
return React.createElement(React.Fragment, {}, React.createElement('p', {}, `hi`), React.createElement('p', {}, `hello`));
})() : null;
};
