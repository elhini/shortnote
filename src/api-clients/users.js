import BaseApiClient from './base';
import AsyncUtils from '../utils/AsyncUtils';

export default class UsersApiClient extends BaseApiClient {
    constructor() {
        super('users');
    }

    login(login, password, cb) {
        var ticket = {login, password};
        AsyncUtils.sendJSON(this.url + '/login', 'POST', ticket, (res) => {
            this.handleRes(cb, res);
        });
    }

    // TODO: logout
} 