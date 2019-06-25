import BaseApiClient from './base';

export default class UsersApiClient extends BaseApiClient {
    constructor() {
        super('users');
    }

    login(login, password, cb) {
        var ticket = {login, password};
        // TODO: implement api handler
        AsyncUtils.sendJSON(this.url + '/session', 'POST', ticket, (res) => {
            this.handleRes(cb, res);
        });
    }
} 