import React from "react";
import { Redirect } from "react-router-dom";
import './Login.css';
import AuthUtils from '../../utils/AuthUtils';
import UsersApiClient from '../../api-clients/users';
import Button from '@material-ui/core/Button';
import { Session } from '../../types/index';
import { RouteComponentProps } from "react-router-dom";

export default class Login extends React.Component<RouteComponentProps, {}> {
    state = { redirectToReferrer: false, login: '', password: '', submitting: false, error: '' };
  
    login = (e: React.MouseEvent) => {
      e.preventDefault();
      (new UsersApiClient(this)).login(this.state.login, this.state.password, (session: Session) => {
        session.loggedAs = this.state.login;
        AuthUtils.setSession(session);
        this.setState({ redirectToReferrer: true });
      });
    };

    onInputChange(field: string, e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({[field]: e.target.value});
    }
  
    render() {
      let { from } = this.props.location.state || { from: { pathname: "/notes" } };
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
              <Button variant="outlined" type="submit" id="submitLoginForm" onClick={e => this.login(e)} disabled={this.state.submitting}>
                {this.state.submitting ? 'Logging in...' : 'Log in'}
              </Button><br />
              {this.state.error && <div className="alert error" id="loginError">{this.state.error}</div>}
            </form>
          </div>
        )
      );
    }
}