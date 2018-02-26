/* @flow */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Input, Icon } from 'antd';
import './login.less';

const FormItem = Form.Item;

type Props = {
  onAuth: Function,
  history: ReactRouterHistory,
  location: any,
};
type State = {};

class LoginPage extends Component<Props, State> {
  state = {};

  onSubmit = evt => {
    evt.preventDefault();
    const form = evt.target;

    let data = {};
    let i = form.length - 1;
    let input;
    while (i >= 0) {
      input = form[i];
      if (input.name) {
        data[input.name] = input.value;
      }
      i -= 1;
    }

    this.props.onAuth(
      data.user,
      Math.random()
        .toString(36)
        .slice(2),
    );

    // Route may have a `next` query param. If so, redirect to that page.
    let query = this.props.location.search || '/';
    query = query.replace('?next=', '');

    this.props.history.push(query);
  };

  render() {
    return (
      <div id="login-page">
        <Form className="login-form" onSubmit={this.onSubmit}>
        <FormItem>
          <h1>Log In</h1>
        </FormItem>
          <FormItem>
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" name="user" />
          </FormItem>

          <FormItem>
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" name="password" />
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default withRouter(LoginPage);
