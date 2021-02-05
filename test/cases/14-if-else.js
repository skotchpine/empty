import React from 'react';
export default ({x, y}) => {
return x ? (()=>{
console.log('hi');
return React.createElement('p', {}, `hi`);
})() : (()=>{
return y ? (()=>{
console.log('bye');
return React.createElement('p', {}, `bye`);
})() : (()=>{
console.log('mt');
return React.createElement('p', {}, `mt`);
})();
})();
};
