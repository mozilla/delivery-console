import { message } from 'antd';
import autobind from 'autobind-decorator';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import GenericFormContainer from 'console/workflows/recipes/components/GenericFormContainer';
import { reverse } from 'console/urls';
import handleError from 'console/utils/handleError';
import ExtensionForm from 'console/workflows/extensions/components/ExtensionForm';
import { createExtension } from 'console/state/extensions/actions';

@connect(
  null,
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
