import { Col, Row, Input } from 'antd';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import SwitchBox from 'console/components/forms/SwitchBox';
import FormItem from 'console/components/forms/FormItem';
import AddonBranches from 'console/workflows/recipes/components/AddonBranches';

import { connectFormProps } from 'console/utils/forms';

@connectFormProps
class BranchedAddonStudyFields extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    recipeArguments: PropTypes.instanceOf(Map).isRequired,
  };

  static defaultProps = {
    disabled: false,
    recipeArguments: new Map(),
  };

  render() {
    const { recipeArguments, disabled } = this.props;
    return (
      <Row>
        <p className="action-info">
          Enroll the user in a study which they can remove themselves from.
        </p>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <FormItem
              label="Slug"
              name="arguments.slug"
              initialValue={recipeArguments.get('slug', '')}
            >
              <Input disabled={disabled} />
            </FormItem>
            <FormItem
              label="User Facing Description"
              name="arguments.userFacingDescription"
              initialValue={recipeArguments.get('userFacingDescription', '')}
            >
              <Input disabled={disabled} />
            </FormItem>
          </Col>

          <Col xs={24} md={12}>
            <FormItem
              label="User Facing Name"
              name="arguments.userFacingName"
              initialValue={recipeArguments.get('userFacingName', '')}
            >
              <Input disabled={disabled} />
            </FormItem>

            <FormItem
              label="Prevent New Enrollment"
              name="arguments.isEnrollmentPaused"
              initialValue={recipeArguments.get('isEnrollmentPaused', false)}
            >
              <SwitchBox disabled={disabled}>
                Prevents new users from joining this study&nbsp;cohort. <br /> Existing users will
                remain in&nbsp;the&nbsp;study.
              </SwitchBox>
            </FormItem>
          </Col>

          <Col sm={24}>
            <FormItem
              label="Study Branches"
              name="arguments.branches"
              initialValue={recipeArguments.get('branches', new List())}
              config={{ valuePropName: 'branches' }}
            >
              <AddonBranches disabled={disabled} />
            </FormItem>
          </Col>
        </Row>
      </Row>
    );
  }
}

export default BranchedAddonStudyFields;
