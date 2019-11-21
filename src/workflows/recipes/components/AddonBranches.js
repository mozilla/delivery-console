import { Button } from 'antd';
import autobind from 'autobind-decorator';
import { List, Map } from 'immutable';
import PropTypes from 'prop-types';
import React from 'react';

import AddonBranchFields from 'console/workflows/recipes/components/AddonBranchFields';
import { connectFormProps } from 'console/utils/forms';

/**
 * List of individual branches in the experiment.
 *
 * rc-form's implementation of nested data is buggy[1].  It only reliably
 * supports one level of nesting, but branches end up having deeply-nested
 * fields like arguments.branches[1].slug. As a workaround, ExperimentBranches
 * acts as an input for a single value, and manages the nesting internally,
 * sending it back to rc-form via the onChange prop.
 *
 * [1] https://github.com/ant-design/ant-design/issues/4711
 */
@connectFormProps
@autobind
class ExperimentBranches extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    branches: PropTypes.instanceOf(List).isRequired,
  };

  static defaultProps = {
    disabled: false,
  };

  handleClickDelete(index) {
    const { branches, onChange } = this.props;
    onChange(branches.delete(index));
  }

  handleClickAdd() {
    const { branches, onChange } = this.props;
    const branch = new Map({
      slug: '',
      extensionApiId: undefined,
      ratio: 1,
    });
    onChange(branches.push(branch));
  }

  handleChangeBranch(index, branch) {
    const { branches, onChange } = this.props;
    onChange(branches.set(index, branch));
  }

  render() {
    const { branches, disabled } = this.props;
    return (
      <div>
        <ul className="branch-list">
          {branches.map((branch, index) => (
            <li key={index} className="branch">
              <AddonBranchFields
                disabled={disabled}
                branch={branch}
                fieldName={`arguments.branches[${index}]`}
                index={index}
                onChange={this.handleChangeBranch}
                onClickDelete={this.handleClickDelete}
              />
            </li>
          ))}
        </ul>
        <Button
          disabled={disabled}
          type="default"
          icon="plus"
          onClick={this.handleClickAdd}
          id="add-branch"
        >
          Add Branch
        </Button>
      </div>
    );
  }
}

export default ExperimentBranches;
