import config from './config';
import { authHeader } from '../_helpers';
import { userService } from './user.service';

export const webService = {
  handleResponse,
  get,
}

function get(url) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader()
  };

  return fetch(`${config.apiUrl}${url}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  return response.json().then(data => {
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        userService.logout();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
