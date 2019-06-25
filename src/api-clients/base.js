import AsyncUtils from '../utils/AsyncUtils';

export default class BaseApiClient {
    constructor(collection) {
        this.collection = collection;
    }

    handleRes(cb, res){
        if (res.error){
            alert(JSON.stringify(res.error)); // TODO: show error without blocking UI
            return;
        }
        cb(res);
    }
    
    create(item, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection, 'POST', item, (res) => {
            this.handleRes(cb, res);
        });
    }
    getAll(cb) {
        AsyncUtils.sendJSON('/api/' + this.collection, 'GET', null, (res) => {
            this.handleRes(cb, res);
        });
    }
    get(id, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection + '/'+id, 'GET', null, (res) => {
            this.handleRes(cb, res);
        });
    }
    update(item, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection + '/'+item._id, 'PUT', item, (res) => {
            this.handleRes(cb, res);
        });
    }
    remove(item, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection + '/'+item._id, 'DELETE', null, (res) => {
            this.handleRes(cb, res);
        });
    }
} 