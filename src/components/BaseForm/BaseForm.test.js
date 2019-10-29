import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import BaseForm from './BaseForm';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const location = {}; // mock location object
  ReactDOM.render(<Router><BaseForm location={location} /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
