import BaseApiClient from './base';

export default class SessionsApiClient extends BaseApiClient {
    constructor(component) {
        super('sessions', component);
    }
} 