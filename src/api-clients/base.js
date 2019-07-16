import AsyncUtils from '../utils/AsyncUtils';

export default class BaseApiClient {
    constructor(collection, component) {
        this.collection = collection;
        this.url = '/api/' + collection;
        this.component = component;
    }

    handleReq(method, urlPostfix, item, cb){
        if (this.component){ 
            this.component.setState({ error: '', sumbitting: true });
        }
        AsyncUtils.sendJSON(this.url + urlPostfix, method, item, (res) => {
            this.handleRes(cb, res);
        });
    }

    handleRes(cb, res){
        if (this.component){ 
            this.component.setState({ error: res.error || '', sumbitting: false });
        }
        else if (res.error) {
            alert(JSON.stringify(res.error));
        }
        if (res.error){
            return;
        }
        cb(res);
    }
    
    create(item, cb) {
        this.handleReq('POST', '', item, cb);
    }
    getAll(cb) {
        this.handleReq('GET', '', null, cb);
    }
    get(id, cb) {
        this.handleReq('GET', '/'+id, null, cb);
    }
    update(item, cb) {
        this.handleReq('PUT', '/'+item._id, item, cb);
    }
    remove(item, cb) {
        this.handleReq('DELETE', '/'+item._id, null, cb);
    }
} 