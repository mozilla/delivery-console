import faker from 'faker';
import { Map } from 'immutable';

import { AutoIncrementField, Factory, Field } from 'console/tests/factory';

export const INITIAL_STATE = new Map({
  items: new Map(),
});

export class ActionFactory extends Factory {
  getFields() {
    return {
      id: new AutoIncrementField(),
      argument_schema: {},
      implementation_url: new Field(faker.internet.url),
      name: new Field(faker.lorem.slug),
    };
  }
}
