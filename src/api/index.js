const notesAPI = require('./notes');
module.exports = function(app, db) {
    notesAPI(app, db);
};