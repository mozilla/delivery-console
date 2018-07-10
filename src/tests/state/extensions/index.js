import faker from 'faker';
import { Map } from 'immutable';

import { AutoIncrementField, Factory, Field } from 'console/tests/factory';

export const INITIAL_STATE = new Map({
  items: new Map(),
  listing: new Map(),
});

export class ExtensionFactory extends Factory {
  getFields() {
    return {
      id: new AutoIncrementField(),
      name: new Field(faker.lorem.slug),
      xpi: new Field(faker.internet.url),
    };
  }
}
