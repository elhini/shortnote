import { BaseApi, MethodHandler } from './base';
import { Db } from "mongodb";

export default class NotesApi extends BaseApi {
    constructor() {
        super('notes');
    }
    init(db: Db) {
        super.init(db);
        this.methods = {
            ...this.methods,
            'get /public/:id': {
                handler: (req, res, userID) => {
                    var handler = this.methods['get /:id'] as MethodHandler;
                    handler(req, res, userID, (note: any) => {
                        res.send(note && note.publicAccess ? note : { 'error': 'note is private' });
                    });
                },
                dontCheckSession: true
            }
        };
    }
}