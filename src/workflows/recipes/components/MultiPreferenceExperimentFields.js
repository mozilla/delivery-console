/* eslint-disable react/jsx-boolean-value */
import { Row, Col, Input } from 'antd';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import DocumentUrlInput from 'console/components/forms/DocumentUrlInput';
import FormItem from 'console/components/forms/FormItem';
import SwitchBox from 'console/components/forms/SwitchBox';
import MultiPreferenceExperimentBranches from 'console/workflows/recipes/components/MultiPreferenceExperimentBranches';
import { connectFormProps } from 'console/utils/forms';

@connectFormProps
class MultiPreferenceExperimentFields extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    form: PropTypes.object.isRequired,
    recipeArguments: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    disabled: false,
    recipeArguments: new Map(),
  };

  render() {
    const { disabled, form, recipeArguments } = this.props;

    const isUserBranchSelected = form.getFieldValue('arguments.preferenceBranchType') === 'user';

    return (
      <Row>
        <p className="action-info">Run a feature experiment activated by multiple preference.</p>
        <Col sm={24} md={11}>
          <FormItem
            label="Experiment Name"
            name="arguments.slug"
            initialValue={recipeArguments.get('slug', '')}
          >
            <Input disabled={disabled} />
          </FormItem>

          <FormItem
            label="User Facing Name"
            name="arguments.userFacingName"
            initialValue={recipeArguments.get('userFacingName', '')}
          >
            <Input disabled={disabled} />
          </FormItem>

          <FormItem
            label="High volume recipe"
            name="arguments.isHighVolume"
            initialValue={recipeArguments.get('isHighVolume', false)}
          >
            <SwitchBox disabled={disabled}>
              Affects the experiment type reported to telemetry, and can be used to filter recipe
              data in analysis. This should be set to true on recipes that affect a significant
              percentage of release.
            </SwitchBox>
          </FormItem>
        </Col>

        <Col sm={24} md={{ span: 12, offset: 1 }}>
          <FormItem
            label="Experiment Document URL"
            name="arguments.experimentDocumentUrl"
            initialValue={recipeArguments.get('experimentDocumentUrl', '')}
          >
            <DocumentUrlInput disabled={disabled} />
          </FormItem>

          <FormItem
            label="User Facing Description"
            name="arguments.userFacingDescription"
            initialValue={recipeArguments.get('userFacingDescription', '')}
          >
            <Input disabled={disabled} />
          </FormItem>
        </Col>

        <Col
          sm={24}
          md={{
            span: isUserBranchSelected ? 11 : 12,
            offset: isUserBranchSelected ? 0 : 1,
          }}
        >
          <FormItem
            label="Prevent New Enrollment"
            name="arguments.isEnrollmentPaused"
            initialValue={recipeArguments.get('isEnrollmentPaused', false)}
          >
            <SwitchBox disabled={disabled}>
              Prevents new users from joining this experiment&nbsp;cohort. <br /> Existing users
              will remain in&nbsp;the&nbsp;experiment.
            </SwitchBox>
          </FormItem>
        </Col>

        <Col sm={24}>
          <FormItem
            label="Experiment Branches"
            name="arguments.branches"
            initialValue={recipeArguments.get('branches', new List())}
            config={{ valuePropName: 'branches' }}
          >
            <MultiPreferenceExperimentBranches disabled={disabled} />
          </FormItem>
        </Col>
      </Row>
    );
  }
}

export default MultiPreferenceExperimentFields;
