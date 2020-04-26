import React from 'react';
import { BrowserRouter as Router, Route, Redirect, NavLink, withRouter } from "react-router-dom";
import UsersApiClient from './api-clients/users';
import AuthUtils from './utils/AuthUtils';
import Landing from './pages/Landing/Landing';
import Registration from './pages/Registration/Registration';
import Login from './pages/Login/Login';
import Notes from './pages/Notes/Notes';
import Admin from './pages/Admin/Admin';
import NoteStore from './stores/Notes';

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
    var noteStore = new NoteStore();
    return (
        <Route {...rest} render={props =>
            AuthUtils.isLoggedIn() ? (
                <Component {...props} store={noteStore} />
            ) : (
                <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
            )
        }/>
    );
}

class Head extends React.Component {
    state = { submitting: false };

    logout(e){
        e.preventDefault();
        (new UsersApiClient(this)).logout(() => {
            AuthUtils.setSession(null);
            this.props.history.push("/login");
        });
    }

    getNavLink(props){
        var isNotLoggedIn = props.private && !AuthUtils.isLoggedIn();
        var isNotAdmin = props.admin && !AuthUtils.isAdmin();
        if (isNotLoggedIn || isNotAdmin){
            return null;
        }
        return (
            <NavLink to={props.to} exact={props.exact} onClick={props.onClick} key={props.to}>{props.label}</NavLink>
        );
    }
    
    getAuthState(){
        var isLoggedIn = AuthUtils.isLoggedIn();
        var loggedAs = <span id="loggedAsCont" key="loggedAsCont">
            Logged in as <span id="loggedAs">{isLoggedIn && AuthUtils.getSession().loggedAs}</span>
        </span>;
        var logoutLabel = this.state.submitting ? 'Logging out...' : 'Log out';
        var logoutLink = this.getNavLink({label: logoutLabel, to: "/logout", onClick: e => this.logout(e)});
        var loginLabel = 'Log in';
        var loginLink = this.getNavLink({label: loginLabel, to: "/login"});
        return isLoggedIn ? [loggedAs, logoutLink] : loginLink;
    }

    render(){
        var navItems = [
            {label: "Home", to: "/", exact: true},
            {label: "Register", to: "/register"},
            {label: "Notes", to: "/notes", private: true},
            {label: "Admin", to: "/admin", admin: true},
        ];
        return (
            <div id="head">
                <h1>ShortNote</h1>
                <div id="nav">
                    {navItems.map(this.getNavLink)}
                    {this.getAuthState()}
                </div>
            </div>
        );
    }
}

export default class AppRouter extends React.Component {
    render(){
        var HeadWithRouter = withRouter(Head);
        return (
            <Router>
                <HeadWithRouter />
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