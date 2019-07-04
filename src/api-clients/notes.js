import BaseApiClient from './base';
import AsyncUtils from '../utils/AsyncUtils';

export default class NotesApiClient extends BaseApiClient {
    constructor(component) {
        super('notes', component);
    }
    getPublic(id, cb) {
        AsyncUtils.sendJSON(this.url + '/public/'+id, 'GET', null, (res) => {
            this.handleRes(cb, res);
        });
    }
} 