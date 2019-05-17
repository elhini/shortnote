import AsyncUtils from '../utils/AsyncUtils';

export default class NotesApiClient {
    static create(note, cb) {
        AsyncUtils.sendJSON('/api/notes', 'POST', note, (res) => {
            cb(res);
        });
    }
    static getAll(cb) {
        AsyncUtils.sendJSON('/api/notes', 'GET', null, (res) => {
            cb(res);
        });
    }
    static get(id, cb) {
        AsyncUtils.sendJSON('/api/notes/'+id, 'GET', null, (res) => {
            cb(res);
        });
    }
    static update(note, cb) {
        AsyncUtils.sendJSON('/api/notes/'+note._id, 'PUT', note, (res) => {
            cb(res);
        });
    }
    static remove(item, cb) {
        AsyncUtils.sendJSON('/api/notes/'+item._id, 'DELETE', null, (res) => {
            cb(res);
        });
    }
} 