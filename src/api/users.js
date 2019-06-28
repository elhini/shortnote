var BaseApi = require('./base');
var CryptUtils = require('../utils/CryptUtils');

class UsersApi extends BaseApi {
    constructor() {
        super('users');
    }

    connect(app, db) {
        // don't call super.connect for security reasons
            
        app.post(this.url + '/register', (req, res) => {
            const ticket = req.body;
            const query = {login: ticket.login};
            db.collection(this.collection).findOne(query, (err, user) => {
                if (err) { 
                    res.send({ 'error': err });
                } else if (user) {
                    res.send({ 'error': 'login already in use' });
                } else {
                    CryptUtils.cryptPassword(ticket.password, (err, hash) => {
                        if (err) { 
                            res.send({ 'error': err });
                        } else {
                            let user = {login: ticket.login, password: hash, registrationDate: new Date()};
                            db.collection(this.collection).insertOne(user, (err, result) => {
                                if (err) { 
                                    res.send({ 'error': err }); 
                                } else {
                                    user = result.ops[0];
                                    delete user.password;
                                    res.send(user);
                                }
                            });
                        }
                    });
                }
            });
        });

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
            const query = { '_id': null };
            try {
                query._id = this.createObjectID(sessionID);
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