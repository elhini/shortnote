import AsyncUtils from '../utils/AsyncUtils';

function handleRes(cb, res){
    if (res.error){
        alert(res.error); // TODO: show error without blocking UI
        return;
    }
    cb(res);
}

export default class NotesApiClient {
    static create(note, cb) {
        AsyncUtils.sendJSON('/api/notes', 'POST', note, (res) => {
            handleRes(cb, res);
        });
    }
    static getAll(cb) {
        AsyncUtils.sendJSON('/api/notes', 'GET', null, (res) => {
            handleRes(cb, res);
        });
    }
    static get(id, cb) {
        AsyncUtils.sendJSON('/api/notes/'+id, 'GET', null, (res) => {
            handleRes(cb, res);
        });
    }
    static update(note, cb) {
        AsyncUtils.sendJSON('/api/notes/'+note._id, 'PUT', note, (res) => {
            handleRes(cb, res);
        });
    }
    static remove(item, cb) {
        AsyncUtils.sendJSON('/api/notes/'+item._id, 'DELETE', null, (res) => {
            handleRes(cb, res);
        });
    }
} 