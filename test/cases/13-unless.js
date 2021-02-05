import React from 'react';
export default ({x}) => {
return !(x) ? (()=>{
console.log('hi');
return React.createElement('p', {}, `hi`);
})() : null;
};
