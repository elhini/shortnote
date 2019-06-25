import AsyncUtils from '../utils/AsyncUtils';

function handleRes(cb, res){
    if (res.error){
        alert(JSON.stringify(res.error)); // TODO: show error without blocking UI
        return;
    }
    cb(res);
}

export default class BaseApiClient {
    constructor() {
        this.collection = '';
    }
    
    create(item, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection, 'POST', item, (res) => {
            handleRes(cb, res);
        });
    }
    getAll(cb) {
        AsyncUtils.sendJSON('/api/' + this.collection, 'GET', null, (res) => {
            handleRes(cb, res);
        });
    }
    get(id, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection + '/'+id, 'GET', null, (res) => {
            handleRes(cb, res);
        });
    }
    update(item, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection + '/'+item._id, 'PUT', item, (res) => {
            handleRes(cb, res);
        });
    }
    remove(item, cb) {
        AsyncUtils.sendJSON('/api/' + this.collection + '/'+item._id, 'DELETE', null, (res) => {
            handleRes(cb, res);
        });
    }
} 