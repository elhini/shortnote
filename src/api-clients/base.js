import AsyncUtils from '../utils/AsyncUtils';

export default class BaseApiClient {
    constructor(collection) {
        this.collection = collection;
        this.url = '/api/' + collection;
    }

    handleRes(cb, res){
        if (res.error){
            alert(JSON.stringify(res.error)); // TODO: show error without blocking UI
            return;
        }
        cb(res);
    }
    
    create(item, cb) {
        AsyncUtils.sendJSON(this.url, 'POST', item, (res) => {
            this.handleRes(cb, res);
        });
    }
    getAll(cb) {
        AsyncUtils.sendJSON(this.url, 'GET', null, (res) => {
            this.handleRes(cb, res);
        });
    }
    get(id, cb) {
        AsyncUtils.sendJSON(this.url + '/'+id, 'GET', null, (res) => {
            this.handleRes(cb, res);
        });
    }
    update(item, cb) {
        AsyncUtils.sendJSON(this.url + '/'+item._id, 'PUT', item, (res) => {
            this.handleRes(cb, res);
        });
    }
    remove(item, cb) {
        AsyncUtils.sendJSON(this.url + '/'+item._id, 'DELETE', null, (res) => {
            this.handleRes(cb, res);
        });
    }
} 