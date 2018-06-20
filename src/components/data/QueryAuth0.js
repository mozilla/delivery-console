import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { userProfileReceived, loginFailed, logUserIn } from 'console/state/auth/actions';
import { getAccessToken } from 'console/state/auth/selectors';
import { finishAuthenticationFlow } from 'console/utils/auth0';

@connect(
  (state, props) => ({
    accessToken: getAccessToken(state),
  }),
  {
    userProfileReceived,
    loginFailed,
    logUserIn,
  },
)
@withRouter
export default class QueryAuth0 extends React.PureComponent {
  static propTypes = {
    accessToken: PropTypes.string,
    userProfileReceived: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    loginFailed: PropTypes.func.isRequired,
    logUserIn: PropTypes.func.isRequired,
  };

  // The motivation for using componentWILLMount instead of the more regular componentDidMount
  // is because we don't worry about server-side rendering React AND there's a chance we
  // can synchronously read from localStorage and update state such that we have the user
  // profile *before* the AuthButton component is mounted. Thus, the the AuthButton might
  // not have to render the "Log in" button at all since this method will dispatch the
  // user profile before it renders.
  async componentWillMount() {
    const { userProfileReceived, history, loginFailed, logUserIn } = this.props;
    let authResult;
    let userProfileSub;

    const localAuthResult = JSON.parse(localStorage.getItem('authResult'));

    if (localAuthResult && localAuthResult.idTokenPayload) {
      // The user profile was stored in localStorage! Update the store right away with this
      // right now.
      userProfileReceived(localAuthResult.idTokenPayload);
      // Remember with which "sub" we updated the state of the user profile.
      // The reason it's valuable is because you might have old localStorage state
      // stuck in your browser, but arriving here with an window.location.hash (from the
      // implicit grant) that ultimately points to a new/different user.
      userProfileSub = localAuthResult.idTokenPayload.sub;
    }

    try {
      authResult = await finishAuthenticationFlow();
    } catch (err) {
      loginFailed(err);
    }

    if (!authResult) {
      // It if was null from finishAuthenticationFlow() it means it didn't pick anything
      // up from the window.location.hash so we can potentially use what was stored in
      // localStorage.
      authResult = localAuthResult;
    }

    if (authResult) {
      const { state } = authResult;
      logUserIn(authResult);
      // Since we include 'id_token' for the 'responseType' in auth0.WebAuth
      // the authresult will contain the user profile as .idTokenPayload
      // included with the accessToken. Use this now to update the state so that we
      // can display the name and avatar you logged in as.
      if (!userProfileSub || userProfileSub !== authResult.idTokenPayload.sub) {
        // Only dispatch if we haven't already do so with this profile.
        userProfileReceived(authResult.idTokenPayload);
      }

      if (state) {
        history.push(state);
      }
    }
  }

  render() {
    return null;
  }
}
