var BaseApi = require('./base');

class UsersApi extends BaseApi {
    constructor() {
        super('users');
    }

    connect(app, db) {
        super.connect(app, db);

        app.post(this.url + '/session', (req, res) => {
            const ticket = req.body;
            const query = {login: ticket.login};
            db.collection(this.collection).findOne(query, (err, user) => {
                if (err) { 
                    res.send({ 'error': err }); 
                } else {
                    // TODO: add new session for user._id and return session._id
                    // res.send(session._id);
                }
            });
        });
    }
}

module.exports = UsersApi;