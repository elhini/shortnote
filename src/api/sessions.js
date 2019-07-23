var BaseApi = require('./base');

class SessionsApi extends BaseApi {
    constructor() {
        super('sessions');
        this.userDependent = false;
    }
}

module.exports = SessionsApi;