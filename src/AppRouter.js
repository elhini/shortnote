import React from 'react';
import { BrowserRouter as Router, Route, Redirect, NavLink, withRouter } from "react-router-dom";
import UsersApiClient from './api-clients/users';
import AuthUtils from './utils/AuthUtils';
import Landing from './pages/Landing/Landing';
import Registration from './pages/Registration/Registration';
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
                <div id="head">
                    <div id="head-inner-left">
                        <h1>ShortNote</h1>
                        <ul id="nav">
                            <li><NavLink to="/" exact>Home</NavLink></li>
                            <li><NavLink to="/register">Register</NavLink></li>
                            <AppLink />
                        </ul>
                        <AuthState />
                    </div>
                    <div id="head-inner-right"></div>
                </div>
                <div id="body">
                  <Route path="/" exact component={Landing} />
                  <Route path="/register" component={Registration} />
                  <Route path="/login" component={Login} />
                  <Route path="/note/public/:id" exact component={App} />
                  <PrivateRoute path="/note" exact component={App} />
                  <PrivateRoute path="/note/:id" exact component={App} />
                </div>
            </Router>
        );
    }
}

function logout(e, history){
    e.preventDefault(); 
    (new UsersApiClient()).logout(() => {
        AuthUtils.setSession(null);
        history.push("/login");
    });
}

const AppLink = withRouter(({ history }) => {
    return AuthUtils.isLoggedIn() && <li><NavLink to="/note">App</NavLink></li>;
})

const AuthState = withRouter(({ history }) => {
    var isLoggedIn = AuthUtils.isLoggedIn();
    var loggedAs = <span key="loggedAs">
        Logged in as <span id="loggedAs">{isLoggedIn && AuthUtils.getSession().loggedAs}</span>
    </span>;
    var logoutLink = <a href="/logout" id="logout" key="logout" onClick={e => logout(e, history)}>Log out</a>;
    return <div id="authState">
        {isLoggedIn ? [loggedAs, logoutLink] : <NavLink to="/login">Log in</NavLink>}
    </div>;
})