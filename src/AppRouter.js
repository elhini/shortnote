import React from 'react';
import { BrowserRouter as Router, Route, Redirect, NavLink, withRouter } from "react-router-dom";
import UsersApiClient from './api-clients/users';
import AuthUtils from './utils/AuthUtils';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import App from './pages/App/App';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props =>
            AuthUtils.isLoggedIn() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            )
        }/>
    );
}

export default class AppRouter extends React.Component {
    render(){
        return (
            <Router>
                <div id="header">
                    <AuthState />
                    <ul id="nav">
                        <li><NavLink to="/">Landing</NavLink></li>
                        <li><NavLink to="/note">App</NavLink></li>
                        <li><NavLink to="/login">Login</NavLink></li>
                    </ul>
                </div>
                <div id="page">
                  <Route path={`/`} exact component={Landing} />
                  <Route path={`/login`}  component={Login} />
                  <PrivateRoute path="/note" exact component={App} />
                  <PrivateRoute path="/note/:id" component={App} />
                </div>
            </Router>
        );
    }
}

function logout(e, history){
    e.preventDefault(); 
    (new UsersApiClient()).logout(() => {
        AuthUtils.setSession(null);
        history.push("/");
    });
}

const AuthState = withRouter(
    ({ history }) =>
        AuthUtils.isLoggedIn() ? (
            <span id="state" className="logged-in">
                Logged in as <span id="loggedAs">{AuthUtils.getSession().loggedAs}</span>
                <a href="/logout" id="logout" onClick={e => logout(e, history)}>Log out</a>
            </span>
        ) : (
            <span id="state" className="logged-out">
                Logged out
            </span>
        )
);