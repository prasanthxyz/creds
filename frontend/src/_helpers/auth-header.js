/**
 * Returns authorization header with Token
 * Gets the token from localStorage
 * Returns empty object if no token found
 * @returns {Object} header with 'Authorization' or empty object
 */
export function authHeader() {
    // return authorization header with basic auth credentials
    let token = localStorage.getItem('token');

    if (token) {
        return { 'Authorization': 'Token ' + token };
    } else {
        return {};
    }
}
