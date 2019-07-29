var BaseApi = require('./base');

class SettingsApi extends BaseApi {
    constructor() {
        super('settings');
        this.userDependent = false;
        this.adminAccess = true;
    }
    init(db) {
        super.init(db);
        this.methods = {
            ...this.methods,
            'get': {
                handler: this.methods.get,
                adminAccess: false
            }
        };
    }
}

module.exports = SettingsApi;