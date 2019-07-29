import BaseApiClient from './base';

export default class SettingsApiClient extends BaseApiClient {
    constructor() {
        super('settings');
    }
} 