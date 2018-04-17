import { Map } from 'immutable';

import { Factory, SubFactory } from 'console/tests/factory';
import { UserFactory } from 'console/tests/state/users';

export const INITIAL_STATE = new Map();

export class ServiceInfoFactory extends Factory {
  getFields() {
    return {
      user: new SubFactory(UserFactory),
      peer_approval_enforced: true,
      logout_url: '/logout/',
    };
  }
}
