import React from "react";
import { Redirect } from "react-router-dom";
import './Login.css';
import AuthUtils from '../../utils/AuthUtils';
import UsersApiClient from '../../api-clients/users';

export default class Login extends React.Component {
    state = { redirectToReferrer: false, login: '', password: '', error: ''};
  
    login = (e) => {
      e.preventDefault();
      (new UsersApiClient(this)).login(this.state.login, this.state.password, (session) => {
          session.loggedAs = this.state.login;
          AuthUtils.setSession(session);
          this.setState({ redirectToReferrer: true });
      });
    };

    onInputChange(field, e) {
      this.setState({[field]: e.target.value});
    }
  
    render() {
      let { from } = this.props.location.state || { from: { pathname: "/note" } };
      let { redirectToReferrer } = this.state;
  
      if (redirectToReferrer) return <Redirect to={from} />;

      var isLoginPage = this.props.location.pathname === '/login';
      var isLoggedIn = AuthUtils.isLoggedIn();

      return (
        isLoggedIn ? (
          'You are already logged in'
        ) : (
          <div>
            {isLoginPage ? '' : <p>You must log in to view the page at {from.pathname}</p>}
            <form id="loginForm">
              <h2>Log in to an existing account</h2>
              <div className="fieldBlock">
                <label>Login:</label>
                <input type="text" name="login" value={this.state.login} onChange={e => this.onInputChange('login', e)} />
              </div>
              <div className="fieldBlock">
                <label>Password:</label>
                <input type="password" name="password" value={this.state.password} onChange={e => this.onInputChange('password', e)} />
              </div>
              <button id="submitLoginForm" onClick={e => this.login(e)}>Log in</button>
              {this.state.error && <div className="alert error" id="loginError">{this.state.error}</div>}
            </form>
          </div>
        )
      );
    }
}