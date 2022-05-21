import config from "./config";
import { webService } from "./web.service";

export const userService = {
  login,
  logout,
  signup,
};

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`${config.apiUrl}/api-token-auth/`, requestOptions)
    .then(webService.handleResponse)
    .then((data) => {
      // login successful if there's a user in the response
      if (data && data["token"]) {
        // store auth token in local storage
        localStorage.setItem("token", data["token"]);
      }
    });
}

function logout() {
  // remove token from local storage to log user out
  localStorage.removeItem("token");
}

function signup(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  };

  return fetch(`${config.apiUrl}/users/`, requestOptions).then(
    webService.handleResponse
  );
}
