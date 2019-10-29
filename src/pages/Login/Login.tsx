import React from "react";
import { Redirect } from "react-router-dom";
import { BaseForm, BaseFormFieldValues } from '../../components/BaseForm/BaseForm';
import AuthUtils from '../../utils/AuthUtils';
import UsersApiClient from '../../api-clients/users';
import { Session } from '../../types/index';
import { RouteComponentProps } from "react-router-dom";

export default class Login extends React.Component<RouteComponentProps, {}> {
    state = { redirectToReferrer: false };

    onSubmit(form: BaseForm, values: BaseFormFieldValues) {
      (new UsersApiClient(form)).login(values.login, values.password, (session: Session) => {
        session.loggedAs = values.login;
        AuthUtils.setSession(session);
        this.setState({ redirectToReferrer: true });
      });
    };
  
    render() {
      let { from } = this.props.location.state || { from: { pathname: "/notes" } };
      let { redirectToReferrer } = this.state;
  
      if (redirectToReferrer) return <Redirect to={from} />;

      var fields = [{
        label: 'Login',
        name: 'login',
        required: true
      }, {
        label: 'Password',
        type: 'password',
        name: 'password',
        required: true
      }];

      var form = <BaseForm
        title='Log in to an existing account'
        fields={fields}
        submittingText='Logging in...'
        submitText='Log in' 
        onSubmit={(f, v) => this.onSubmit(f, v)}
      />;

      return AuthUtils.isLoggedIn() ? 'You are already logged in' : form;
    }
}