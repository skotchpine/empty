import React from 'react';
export default ({x, y}) => {
return x ? (()=>{
console.log('hi');
React.createElement('p', {}, 'hi');
})() : (()=>{
y ? (()=>{
console.log('bye');
React.createElement('p', {}, 'bye');
})() : (()=>{
console.log('mt');
React.createElement('p', {}, 'mt');
})();
})();
};
