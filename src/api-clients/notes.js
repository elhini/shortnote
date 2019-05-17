import AsyncUtils from '../utils/AsyncUtils';

export default class NotesApiClient {
    static create(note, cb) {
        AsyncUtils.sendJSON('/api/notes', 'POST', note, (res) => {
            cb(res);
        });
    }
    static update(note, cb) {
        AsyncUtils.sendJSON('/api/notes/'+note._id, 'PUT', note, (res) => {
            cb(res);
        });
    }
} 