import React from 'react';
export default ({}) => {
return React.createElement(React.Fragment, {}, [1, 2, 3].map((x, i) => {
return React.createElement('p', {key: i}, x);
}));
};
