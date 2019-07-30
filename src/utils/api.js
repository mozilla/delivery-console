import { INSECURE_AUTH_ALLOWED } from 'console/settings';
import { request } from 'console/utils/request';

export default class APIClient {
  constructor(root, accessToken, insecure = false) {
    this.root = root;
    this.accessToken = accessToken;
    this.insecure = insecure;
  }

  fetch(url, options = {}) {
    const extraHeaders = {};

    if (this.accessToken) {
      if (INSECURE_AUTH_ALLOWED && this.insecure) {
        extraHeaders.Authorization = `Insecure ${this.accessToken}`;
      } else {
        extraHeaders.Authorization = `Bearer ${this.accessToken}`;
      }
    }

    return request(`${this.root}${url}`, options, extraHeaders);
  }
}
