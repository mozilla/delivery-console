/* eslint import/prefer-default-export: "off" */

export function getUser(state, id, defaultsTo = null) {
  return state.users.items.get(id, defaultsTo);
}
