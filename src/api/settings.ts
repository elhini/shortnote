import { BaseApi, MethodHandler } from './base';
import { Db } from "mongodb";

export default class SettingsApi extends BaseApi {
    constructor() {
        super('settings');
        this.userDependent = false;
        this.adminAccess = true;
    }
    init(db: Db) {
        super.init(db);
        this.methods = {
            ...this.methods,
            'get': {
                handler: this.methods.get as MethodHandler,
                adminAccess: false
            }
        };
    }
}