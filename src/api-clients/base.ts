import AsyncUtils from '../utils/AsyncUtils';

type Callback = (res: any) => void;

export default class BaseApiClient {
    private url: string;

    constructor(public collection: string, public component: React.Component) {
        var isPublicHost = window.location.hostname.split('.')[0] === 'shortnote';
        var apiHost = isPublicHost ? 'https://elhini.herokuapp.com' : ''; // TODO: move to config / env. variable
        this.url = apiHost + '/api/' + collection;
    }

    getWaitingStateField(method: string): string {
        return method === 'GET' ? 'loading' : 'submitting';
    }

    handleReq(method: string, urlPostfix: string, item: any, cb: Callback){
        if (this.component){ 
            var field = this.getWaitingStateField(method);
            this.component.setState({ error: '', [field]: true });
        }
        AsyncUtils.sendJSON(this.url + urlPostfix, method, item, (res) => {
            this.handleRes(cb, res, method);
        });
    }

    handleRes(cb: Callback, res: any, method: string){
        if (this.component){ 
            var field = this.getWaitingStateField(method);
            this.component.setState({ error: res.error || '', [field]: false });
        }
        else if (res.error) {
            alert(JSON.stringify(res.error));
        }
        if (res.error){
            return;
        }
        cb(res);
    }
    
    create(item: any, cb: Callback) {
        this.handleReq('POST', '', item, cb);
    }
    getAll(cb: Callback) {
        this.handleReq('GET', '', null, cb);
    }
    get(id: string, cb: Callback) {
        this.handleReq('GET', '/'+id, null, cb);
    }
    update(item: any, cb: Callback) {
        this.handleReq('PUT', '/'+item._id, item, cb);
    }
    remove(item: any, cb: Callback) {
        this.handleReq('DELETE', '/'+item._id, null, cb);
    }
} 