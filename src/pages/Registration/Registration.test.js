import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Registration from './Registration';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const location = {}; // mock location object
  ReactDOM.render(<Router><Registration location={location} /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
