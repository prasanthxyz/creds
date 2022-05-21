import config from "./config";
import { authHeader } from "../_helpers";
import { userService } from "./user.service";

export const webService = {
  req,
  handleResponse,
};

export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
};

function req(method, url, data = {}) {
  const methodsWithData = [HttpMethod.POST, HttpMethod.PATCH];

  const headers = methodsWithData.includes(method)
    ? Object.assign({}, authHeader(), { "Content-Type": "application/json" })
    : authHeader();
  const requestOptions = {
    method: method,
    headers: headers,
  };
  if (methodsWithData.includes(method)) {
    requestOptions["body"] = JSON.stringify(data);
  }

  return fetch(`${config.apiUrl}${url}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
  if (response.status === 204) {
    return { message: "No content." };
  }
  return response.json().then((data) => {
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        userService.logout();
        location.reload(true);
      }

      if (data && data.non_field_errors) {
        return Promise.reject(data.non_field_errors[0]);
      } else if (data && data.username) {
        return Promise.reject(data.username[0]);
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
