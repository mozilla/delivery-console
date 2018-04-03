/* @flow */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import type { RouterHistory, Location } from 'react-router-dom';
import { login } from './auth0';

import { Button, Form } from 'antd';
import 'console/login.less';

const FormItem = Form.Item;

type Props = {
  onAuth: Function,
  history: RouterHistory,
  location: Location,
};
type State = {};

class LoginPage extends Component<Props, State> {
  state = {};

  onLogin = evt => {
    evt.preventDefault();
    login();
  };

  render() {
    return (
      <div id="login-page">
        <Form className="login-form" onSubmit={this.onLogin}>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in with Auth0
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default withRouter(LoginPage);
