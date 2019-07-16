import BaseApiClient from './base';

export default class UsersApiClient extends BaseApiClient {
    constructor(component) {
        super('users', component);
    }

    register(login, password, cb) {
        var ticket = {login, password};
        this.handleReq('POST', '/register', ticket, cb);
    }

    login(login, password, cb) {
        var ticket = {login, password};
        this.handleReq('POST', '/login', ticket, cb);
    }

    logout(cb) {
        this.handleReq('POST', '/logout', null, cb);
    }
} 