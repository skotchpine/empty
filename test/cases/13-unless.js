import React from 'react';
export default ({x}) => {
return !(x) ? (()=>{
console.log('hi');
React.createElement('p', {}, 'hi');
})() : null;
};
