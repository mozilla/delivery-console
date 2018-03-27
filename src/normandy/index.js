import React from 'react';
import ReactDOM from 'react-dom';
import Root from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.querySelector('#root'),
);
