import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FakeApp from './App';

ReactDOM.render(
  <FakeApp authToken={'fake-dev-token'} />,
  document.getElementById('root'),
);
