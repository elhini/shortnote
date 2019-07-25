import React from 'react';
import { BrowserRouter as Router, Route, Redirect, NavLink, withRouter } from "react-router-dom";
import UsersApiClient from './api-clients/users';
import AuthUtils from './utils/AuthUtils';
import Landing from './pages/Landing/Landing';
import Registration from './pages/Registration/Registration';
import Login from './pages/Login/Login';
import Notes from './pages/Notes/Notes';
import Admin from './pages/Admin/Admin';

function AdminRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest} render={props =>
            AuthUtils.isAdmin() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/", state: { from: props.location } }} />
            )
        }/>
    );
}

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
        var PrivateLinksWithRouter = withRouter(PrivateLinks);
        var AdminLinksWithRouter = withRouter(AdminLinks);
        var AuthStateWithRouter = withRouter(AuthState);
        return (
            <Router>
                <div id="head">
                    <h1>ShortNote</h1>
                    <ul id="nav">
                        <li><NavLink to="/" exact>Home</NavLink></li>
                        <li><NavLink to="/register">Register</NavLink></li>
                        <PrivateLinksWithRouter />
                        <AdminLinksWithRouter />
                    </ul>
                    <AuthStateWithRouter />
                </div>
                <div id="body">
                  <Route path="/" exact component={Landing} />
                  <Route path="/register" component={Registration} />
                  <Route path="/login" component={Login} />
                  <Route path="/notes/public/:id" exact component={Notes} />
                  <PrivateRoute path={["/notes", "/notes/:id"]} exact component={Notes} />
                  <AdminRoute path={["/admin"]} exact component={Admin} />
                </div>
            </Router>
        );
    }
}

const PrivateLinks = () => {
    return AuthUtils.isLoggedIn() ? <>
        <li><NavLink to="/notes">Notes</NavLink></li>
    </> : null;
}

const AdminLinks = () => {
    return AuthUtils.isAdmin() ? <>
        <li><NavLink to="/admin">Admin</NavLink></li>
    </> : null;
}

class AuthState extends React.Component {
    state = { sumbitting: false };

    logout(e){
        e.preventDefault();
        (new UsersApiClient(this)).logout(() => {
            AuthUtils.setSession(null);
            this.props.history.push("/login");
        });
    }

    render() {
        var isLoggedIn = AuthUtils.isLoggedIn();
        var loggedAs = <>
            Logged in as <span id="loggedAs">{isLoggedIn && AuthUtils.getSession().loggedAs}</span>
        </>;
        var logoutLink = <a href="/logout" id="logout" onClick={e => this.logout(e)}>
            {this.state.sumbitting ? 'Logging out...' : 'Log out'}
        </a>;
        var loginLink = <NavLink to="/login">Log in</NavLink>;
        return <div id="authState">
            {isLoggedIn ? <>{loggedAs}{logoutLink}</> : loginLink}
        </div>;
    }
}