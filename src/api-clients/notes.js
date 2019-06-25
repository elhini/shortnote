import BaseApiClient from './base';

export default class NotesApiClient extends BaseApiClient {
    constructor() {
        super();
        this.collection = 'notes';
    }
} 