import { message } from 'antd';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { push as pushAction } from 'redux-little-router';

import GenericFormContainer from 'normandy/components/recipes/GenericFormContainer';
import handleError from 'normandy/utils/handleError';
import ExtensionForm from 'normandy/components/extensions/ExtensionForm';
import { createExtension as createExtensionAction } from 'normandy/state/app/extensions/actions';

@connect(null, {
  createExtension: createExtensionAction,
  push: pushAction,
})
@autobind
export default class CreateExtensionPage extends React.PureComponent {
  static propTypes = {
    createExtension: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  onFormSuccess(extensionId) {
    const { push } = this.props;
    message.success('Extension saved');
    push(`/extension/${extensionId}/`);
  }

  onFormFailure(err) {
    handleError('Extension cannot be saved.', err);
  }

  async formAction(values) {
    const { createExtension } = this.props;
    return createExtension(values);
  }

  render() {
    return (
      <div>
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
