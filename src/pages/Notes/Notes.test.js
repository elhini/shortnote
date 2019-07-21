import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Notes from './Notes';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const match = {params: {id: '5d0410c06255883d9f90f172'}};
  const history = {listen: () => function(){}, push: () => {}}; // mock history object
  ReactDOM.render(<Router><Notes match={match} history={history} /></Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
