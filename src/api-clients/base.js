import AsyncUtils from '../utils/AsyncUtils';

export default class BaseApiClient {
    constructor(collection, component) {
        this.collection = collection;
        this.url = '/api/' + collection;
        this.component = component;
    }

    handleRes(cb, res){
        if (res.error){
            this.component ? 
                this.component.setState({ error: res.error }) : 
                alert(JSON.stringify(res.error));
            return;
        }
        this.component && this.component.setState({ error: res.error });
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