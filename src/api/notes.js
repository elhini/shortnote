var BaseApi = require('./base');

class NotesApi extends BaseApi {
    constructor() {
        super('notes');
    }
    init(db) {
        super.init(db);
        this.methods = {
            ...this.methods,
            'get /public/:id': {
                handler: (req, res, userID) => {
                    this.methods['get /:id'](req, res, userID, note => {
                        res.send(note && note.publicAccess ? note : { 'error': 'note is private' });
                    });
                },
                dontCheckSession: true
            }
        };
    }
}

module.exports = NotesApi;