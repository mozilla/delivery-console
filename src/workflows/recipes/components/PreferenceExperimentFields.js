/* eslint-disable react/jsx-boolean-value */
import { Row, Col, Alert, Input, Select } from 'antd';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import DocumentUrlInput from 'console/components/forms/DocumentUrlInput';
import FormItem from 'console/components/forms/FormItem';
import SwitchBox from 'console/components/forms/SwitchBox';
import ExperimentBranches from 'console/workflows/recipes/components/ExperimentBranches';
import PreferenceBranchSelect from 'console/workflows/recipes/components/PreferenceBranchSelect';
import { connectFormProps } from 'console/utils/forms';

@connectFormProps
class PreferenceExperimentFields extends React.Component {
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
        <p className="action-info">Run a feature experiment activated by a preference.</p>
        <Col sm={24} md={11}>
          <FormItem
            label="Experiment Name"
            name="arguments.slug"
            initialValue={recipeArguments.get('slug', '')}
          >
            <Input disabled={disabled} />
          </FormItem>

          <FormItem
            label="Experiment Document URL"
            name="arguments.experimentDocumentUrl"
            initialValue={recipeArguments.get('experimentDocumentUrl', '')}
          >
            <DocumentUrlInput disabled={disabled} />
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
            label="Preference Name"
            name="arguments.preferenceName"
            initialValue={recipeArguments.get('preferenceName', '')}
            trimWhitespace
          >
            <Input disabled={disabled} />
          </FormItem>

          <Col sm={24}>
            <Col xs={24} sm={11}>
              <FormItem
                label="Preference Type"
                name="arguments.preferenceType"
                initialValue={recipeArguments.get('preferenceType', 'boolean')}
              >
                <Select disabled={disabled}>
                  <Select.Option value="boolean">Boolean</Select.Option>
                  <Select.Option value="integer">Integer</Select.Option>
                  <Select.Option value="string">String</Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} sm={{ span: 12, offset: 1 }}>
              <FormItem
                label="Preference Branch Type"
                name="arguments.preferenceBranchType"
                initialValue={recipeArguments.get('preferenceBranchType', 'default')}
              >
                <PreferenceBranchSelect disabled={disabled} />
              </FormItem>
            </Col>
            {isUserBranchSelected && (
              <Col xs={24}>
                <Alert
                  message="User Preference Branch"
                  description={
                    <span>
                      Setting user preferences instead of default ones is not recommended.
                      <br />
                      Do not choose this unless you know what you are doing.
                    </span>
                  }
                  type="warning"
                  showIcon
                />
              </Col>
            )}
          </Col>
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
            <ExperimentBranches disabled={disabled} />
          </FormItem>
        </Col>
      </Row>
    );
  }
}

export default PreferenceExperimentFields;
