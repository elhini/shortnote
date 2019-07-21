import React from "react";
import { Redirect } from "react-router-dom";
import './Registration.css';
import AuthUtils from '../../utils/AuthUtils';
import UsersApiClient from '../../api-clients/users';
import { Session } from '../../types/index';
import { RouteComponentProps } from "react-router-dom";

export default class Registration extends React.Component<RouteComponentProps, {}> {
    state = { redirectToReferrer: false, login: '', password: '', sumbitting: false, error: '' };
  
    register = (e: React.MouseEvent) => {
      e.preventDefault();
      (new UsersApiClient(this)).register(this.state.login, this.state.password, (session: Session) => {
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

      return (
        <form id="registerForm">
          <h2>Register a new account</h2>
          <div className="fieldBlock">
            <label>Login:</label>
            <input type="text" name="login" value={this.state.login} onChange={e => this.onInputChange('login', e)} />
          </div>
          <div className="fieldBlock">
            <label>Password:</label>
            <input type="password" name="password" value={this.state.password} onChange={e => this.onInputChange('password', e)} />
          </div>
          <button id="submitRegisterForm" onClick={e => this.register(e)} disabled={this.state.sumbitting}>
            {this.state.sumbitting ? 'Registering...' : 'Register'}
          </button><br />
          {this.state.error && <div className="alert error" id="registerError">{this.state.error}</div>}
        </form>
      );
    }
}