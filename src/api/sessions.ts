import { BaseApi } from './base';

export default class SessionsApi extends BaseApi {
    constructor() {
        super('sessions');
        this.userDependent = false;
        this.adminAccess = true;
    }
}