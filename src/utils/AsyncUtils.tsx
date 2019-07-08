export default class AsyncUtils {
    static sendJSON(url: string, method: string, params: any, callback: (res: any) => any) {
        var body = params ? JSON.stringify(params) : null;
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: "same-origin", // to enable cookies: stackoverflow.com/questions/34558264
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