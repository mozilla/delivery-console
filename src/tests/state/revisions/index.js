import faker from 'faker';
import { Map } from 'immutable';

import { AutoIncrementField, DateField, Factory, Field, SubFactory } from 'console/tests/factory';
import { ActionFactory } from 'console/tests/state/actions';
import { UserFactory } from 'console/tests/state/users';
import { SimpleRecipeFactory } from 'console/tests/state/recipes';

export const INITIAL_STATE = new Map({
  items: new Map(),
});

export class RevisionFactory extends Factory {
  getFields() {
    return {
      id: new AutoIncrementField(),
      action: new SubFactory(ActionFactory),
      approval_request: null,
      comment: new Field(faker.lorem.sentence),
      date_created: new DateField(),
      recipe: new SubFactory(SimpleRecipeFactory),
      user: new SubFactory(UserFactory),
    };
  }
}
