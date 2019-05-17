export default class AsyncUtils {
    static sendJSON(url, method, params, callback) {
        var body = JSON.stringify(params);
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        })
        .then(res => res.json())
        .then(res => callback(res))
        .catch(error => console.error('Error:', error));
    }
} 