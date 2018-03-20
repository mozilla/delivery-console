import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router';

export default class NormandyRouter extends React.Component {
  render() {
    const urlPrefix = this.props.urlPrefix || '';

    return (
      <Switch>
        <Route exact path={`${urlPrefix}/`} component={() => <div>normandy home</div>} />
        <Route exact path={`${urlPrefix}/nested/`} component={() => <div>nested</div>} />

        <Route component={({ location }) => (
          <div>
            <h2>404 - Page Not Found</h2>
            <p>No normandy match for <code>{location.pathname}</code></p>
          </div>
        )} />
      </Switch>
    );
  }
}
