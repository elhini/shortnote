import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from './pages/App/App';

export default class AppRouter extends React.Component {
    render(){
        return (
            <Router>
                <Route path={`/note/:id`} component={App} />
                <Route path={`/`}   exact component={App} />
            </Router>
        );
    }
}