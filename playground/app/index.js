import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Foo from './components/Foo';

ReactDOM.render(<Foo />, document.getElementById('app'));

module.hot.accept();
