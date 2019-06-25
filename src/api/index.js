const NotesAPI = require('./notes');
const UsersAPI = require('./users');

module.exports = function(app, db) {
    (new NotesAPI()).connect(app, db);
    (new UsersAPI()).connect(app, db);
};