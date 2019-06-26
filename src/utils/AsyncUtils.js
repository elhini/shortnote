import AuthUtils from './AuthUtils';

export default class AsyncUtils {
    static sendJSON(url, method, params, callback) {
        var body = params ? JSON.stringify(params) : null;
        var sessionID = AuthUtils.isLoggedIn() ? AuthUtils.getSession()._id : null;
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'sessionID': sessionID
            },
            body: body
        })
        .then(res => {
            var errorStr = 
                'status: ' + res.status + ', ' + 
                'statusText: ' + res.statusText + ', ' + 
                'url: ' + res.url;
            return res.status === 200 ? res.json() : {error: errorStr};
        })
        .then(res => callback(res))
        .catch(error => console.error('Error:', error));
    }
} 