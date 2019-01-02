import { Alert, message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getUserProfile } from 'console/state/auth/selectors';
import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import { reverse } from 'console/urls';
import handleError from 'console/utils/handleError';
import ExtensionForm from 'console/workflows/extensions/components/ExtensionForm';
import { createExtension } from 'console/state/extensions/actions';

@connect(
  state => {
    return { userProfile: getUserProfile(state) };
  },
  {
    createExtension,
    push,
  },
)
@autobind
class CreateExtensionPage extends React.PureComponent {
  static propTypes = {
    createExtension: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    userProfile: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    userProfile: null,
  };

  onFormSuccess(extensionId) {
    message.success('Extension saved');
    this.props.push(reverse('extensions.edit', { extensionId }));
  }

  onFormFailure(err) {
    handleError('Extension cannot be saved.', err);
  }

  async formAction(values) {
    return this.props.createExtension(values);
  }

  render() {
    const { userProfile } = this.props;

    if (!userProfile) {
      return (
        <div className="content-wrapper">
          <Alert
            type="error"
            message="Not logged in"
            description="You must be logged in to create an extension."
          />
        </div>
      );
    }
    return (
      <div className="content-wrapper">
        <h2>Add New Extension</h2>
        <GenericFormContainer
          form={ExtensionForm}
          formAction={this.formAction}
          onSuccess={this.onFormSuccess}
          onFailure={this.onFormFailure}
        />
      </div>
    );
  }
}

export default CreateExtensionPage;
