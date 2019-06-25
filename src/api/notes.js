var BaseApi = require('./base');

class NotesApi extends BaseApi {
    constructor() {
        super('notes');
    }
}

module.exports = NotesApi;