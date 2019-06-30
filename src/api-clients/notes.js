import BaseApiClient from './base';

export default class NotesApiClient extends BaseApiClient {
    constructor(component) {
        super('notes', component);
    }
} 