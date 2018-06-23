import { WINDOW_OPEN } from 'console/state/action-types';

export function openNewWindow(url) {
  return dispatch => {
    window.open(url);

    return dispatch({
      type: WINDOW_OPEN,
      url,
    });
  };
}
