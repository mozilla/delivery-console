import { message } from 'antd';
import autobind from 'autobind-decorator';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import GenericFormContainer from 'console/components/recipes/GenericFormContainer';
import handleError from 'console/utils/handleError';
import LoadingOverlay from 'console/components/common/LoadingOverlay';
import QueryExtension from 'console/components/data/QueryExtension';
import ExtensionForm from 'console/components/extensions/ExtensionForm';
import { updateExtension as updateExtensionAction } from 'console/state/extensions/actions';
import { getExtension } from 'console/state/extensions/selectors';
import { getUrlParamAsInt } from 'console/state/router/selectors';

@connect(
  (state, props) => {
    const extensionId = getUrlParamAsInt(props, 'extensionId');
    const extension = getExtension(state, extensionId, new Map());
    return {
      extension,
      extensionId,
    };
  },
  {
    updateExtension: updateExtensionAction,
  },
)
@autobind
export default class EditExtensionPage extends React.PureComponent {
  static propTypes = {
    extension: PropTypes.instanceOf(Map).isRequired,
    extensionId: PropTypes.number.isRequired,
    updateExtension: PropTypes.func.isRequired,
  };

  onFormSuccess() {
    message.success('Extension updated!');
  }

  onFormFailure(err) {
    handleError('Extension cannot be updated.', err);
  }

  async formAction(values) {
    const { updateExtension, extensionId } = this.props;
    return updateExtension(extensionId, values);
  }

  render() {
    const { extensionId, extension } = this.props;
    return (
      <div className="content-wrapper">
        <QueryExtension pk={extensionId} />
        <h2>Edit Extension</h2>

        <LoadingOverlay requestIds={`fetch-extension-${extensionId}`}>
          <GenericFormContainer
            form={ExtensionForm}
            formAction={this.formAction}
            onSuccess={this.onFormSuccess}
            onFailure={this.onFormFailure}
            formProps={{ extension }}
          />
        </LoadingOverlay>
      </div>
    );
  }
}
