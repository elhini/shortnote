var BaseApi = require('./base');
var CryptUtils = require('../utils/CryptUtils');

class UsersApi extends BaseApi {
    constructor() {
        super('users');
    }

    connect(app, db) {
        super.connect(app, db);
            
        // TODO: create user (register)
        // CryptUtils.cryptPassword(ticket.password, (err, hash) => console.log(err, hash));

        app.post(this.url + '/login', (req, res) => {
            const ticket = req.body;
            const query = {login: ticket.login};
            const wrongCredentialsMsg = 'wrong login or password';
            db.collection(this.collection).findOne(query, (err, user) => {
                if (err) { 
                    res.send({ 'error': err });
                } else if (user) {
                    CryptUtils.comparePassword(ticket.password, user.password, (err, isPasswordMatch) => {
                        if (err) { 
                            res.send({ 'error': err }); 
                        } else if (isPasswordMatch) {
                            let tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            let session = {userID: user._id, active: true, expireDate: tomorrow};
                            db.collection('sessions').insertOne(session, (err, result) => {
                                if (err) { 
                                    res.send({ 'error': err }); 
                                } else {
                                    session = result.ops[0];
                                    res.send(session);
                                }
                            });
                        } else {
                            res.send({ 'error': wrongCredentialsMsg });
                        }
                    });
                } else {
                    res.send({ 'error': wrongCredentialsMsg });
                }
            });
        });

        app.post(this.url + '/logout', (req, res) => {
            const sessionID = req.headers.sessionid; // lowercase!
            try {
                const query = { '_id': this.createObjectID(sessionID) };
            }
            catch (e) {
                res.send({ 'error': 'invalid session id' });
                return;
            }
            db.collection('sessions').updateOne(query, { $set: {active: false} }, (err, result) => {
                if (err) { 
                    res.send({ 'error': err }); 
                } else {
                    res.send({ 'loggedOut': true });
                }
            });
        });
    }
}

module.exports = UsersApi;