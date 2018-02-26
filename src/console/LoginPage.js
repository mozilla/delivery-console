/* @flow */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

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
      <div className="LoginPage" onSubmit={this.onSubmit}>
        <form>
          <input type="text" name="user" placeholder="User" />
          <input type="password" name="password" placeholder="Password" />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default withRouter(LoginPage);
