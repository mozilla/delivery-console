/* eslint import/prefer-default-export: "off" */

import { SERVICE_INFO_RECEIVE, USER_RECEIVE } from 'console/state/action-types';
import { makeApiRequest } from 'console/state/requests/actions';

export function fetchServiceInfo(accessToken) {
  return async dispatch => {
    const requestId = 'fetch-service-info';
    const serviceInfo = await dispatch(
      makeApiRequest(requestId, 'v2/service_info/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    dispatch({
      type: SERVICE_INFO_RECEIVE,
      serviceInfo,
    });

    if (!serviceInfo.user) {
      throw new Error('No user provided in service_info');
    }

    dispatch({
      type: USER_RECEIVE,
      user: serviceInfo.user,
    });
  };
}
