import faker from 'faker';
import { Map } from 'immutable';

import { AutoIncrementField, Factory, Field } from 'console/tests/factory';
import { RevisionFactory } from 'console/tests/state/revisions';

export const INITIAL_STATE = new Map({
  experiments: new Map(),
  filters: new Map(),
  history: new Map(),
  items: new Map(),
  listing: new Map(),
});

export const FILTERS = {
  status: [
    {
      key: 'enabled',
      value: 'Enabled',
    },
    {
      key: 'disabled',
      value: 'Disabled',
    },
  ],
};

export class BaseRecipeFactory extends Factory {
  getFields() {
    return {
      id: new AutoIncrementField(),
      signature: null,
    };
  }

  postGeneration() {
    const { isApproved, isEnabled } = this.options;

    this.data.is_approved = !!(isEnabled || isApproved);
    this.data.enabled = !!isEnabled;
  }
}

export class SimpleRecipeFactory extends BaseRecipeFactory {
  getFields() {
    return {
      ...super.getFields(),
      approved_revision_id: null,
      latest_revision_id: new Field(faker.random.number),
    };
  }

  postGeneration() {
    super.postGeneration();

    const { isApproved, isEnabled } = this.options;

    if (isEnabled || isApproved) {
      if (this.data.approved_revision_id === null) {
        this.data.approved_revision_id = this.data.latest_revision_id;
      }
    }
  }
}

export class RecipeFactory extends BaseRecipeFactory {
  getFields() {
    return {
      ...super.getFields(),
      approved_revision: null,
      latest_revision: null,
    };
  }

  postGeneration() {
    super.postGeneration();

    const { isApproved, isEnabled } = this.options;

    if (isEnabled || isApproved) {
      if (this.data.approved_revision === null) {
        this.data.approved_revision = RevisionFactory.build({
          recipe: BaseRecipeFactory.build(this.data),
        });
      }

      if (this.data.latest_revision === null) {
        this.data.latest_revision = RevisionFactory.build(this.data.approved_revision);
      }
    }

    if (this.data.latest_revision === null) {
      this.data.latest_revision = RevisionFactory.build({
        recipe: BaseRecipeFactory.build(this.data),
      });
    }
  }
}
