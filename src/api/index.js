const NotesAPI = require('./notes');
const UsersAPI = require('./users');
const SessionsAPI = require('./sessions');
const SettingsAPI = require('./settings');

module.exports = function(app, db) {
    (new NotesAPI()).connect(app, db);
    (new UsersAPI()).connect(app, db);
    (new SessionsAPI()).connect(app, db);
    (new SettingsAPI()).connect(app, db);
};