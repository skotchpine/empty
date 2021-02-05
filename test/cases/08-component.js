import React from 'react';
export default ({title, href}) => {
return React.createElement('a', {href: href}, title);
};
