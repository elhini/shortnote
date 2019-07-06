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
        var AppLinkWithRouter = withRouter(AppLink);
        var AuthStateWithRouter = withRouter(AuthState);
        return (
            <Router>
                <div id="head">
                    <div id="head-inner-left">
                        <h1>ShortNote</h1>
                        <ul id="nav">
                            <li><NavLink to="/" exact>Home</NavLink></li>
                            <li><NavLink to="/register">Register</NavLink></li>
                            <AppLinkWithRouter />
                        </ul>
                        <AuthStateWithRouter />
                    </div>
                    <div id="head-inner-right"></div>
                </div>
                <div id="body">
                  <Route path="/" exact component={Landing} />
                  <Route path="/register" component={Registration} />
                  <Route path="/login" component={Login} />
                  <Route path="/note/public/:id" exact component={App} />
                  <PrivateRoute path={["/note", "/note/:id"]} exact component={App} />
                </div>
            </Router>
        );
    }
}

const AppLink = () => {
    return AuthUtils.isLoggedIn() && <li><NavLink to="/note">App</NavLink></li>;
}

class AuthState extends React.Component {
    state = { sumbitting: false };

    logout(e){
        e.preventDefault();
        this.setState({ sumbitting: true });
        (new UsersApiClient()).logout(() => {
            AuthUtils.setSession(null);
            this.setState({ sumbitting: false });
            this.props.history.push("/login");
        });
    }

    render() {
        var isLoggedIn = AuthUtils.isLoggedIn();
        var loggedAs = <span key="loggedAs">
            Logged in as <span id="loggedAs">{isLoggedIn && AuthUtils.getSession().loggedAs}</span>
        </span>;
        var logoutLink = <a href="/logout" id="logout" key="logout" onClick={e => this.logout(e)}>
            {this.state.sumbitting ? 'Logging out...' : 'Log out'}
        </a>;
        var loginLink = <NavLink to="/login">Log in</NavLink>;
        return <div id="authState">
            {isLoggedIn ? [loggedAs, logoutLink] : loginLink}
        </div>;
    }
}