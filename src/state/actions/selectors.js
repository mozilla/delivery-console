export function getAction(state, id, defaultsTo = null) {
  // Convert string IDs to integers, since the state is keyed by ints.
  let intId = id;
  if (!Number.isInteger(intId)) {
    intId = Number.parseInt(id, 10);
  }

  return state.getIn(['actions', 'items', intId], defaultsTo);
}

export function getActionByName(state, name, defaultsTo = null) {
  return state.getIn(['actions', 'items']).find(action => action.get('name') === name);
}

export function getAllActions(state) {
  return state.getIn(['actions', 'items']);
}
