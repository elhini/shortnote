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
                    let tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    let session = {userID: user._id, active: true, expireDate: tomorrow};
                    db.collection('sessions').insertOne(session, (err, result) => {
                        if (err) { 
                            res.send({ 'error': err }); 
                        } else {
                            session = result.ops[0]
                            res.send(session);
                        }
                    });
                }
            });
        });
    }
}

module.exports = UsersApi;