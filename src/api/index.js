const NotesAPI = require('./notes');

module.exports = function(app, db) {
    (new NotesAPI()).connect(app, db);
};