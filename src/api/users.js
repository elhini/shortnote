var BaseApi = require('./base');
var CryptUtils = require('../utils/CryptUtils');

class UsersApi extends BaseApi {
    constructor() {
        super('users');
        this.dontCheckSession = true;
    }
    
    // TODO: move to api/session.js
    createSession(db, res, user){
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
    }

    // TODO: move to api/session.js
    deactivateSession(db, req, res){
        const query = { '_id': this.getSessionObjectID(req) };
        db.collection('sessions').updateOne(query, { $set: {active: false} }, (err, result) => {
            if (err) { 
                res.send({ 'error': err }); 
            } else {
                res.send({ 'loggedOut': true });
            }
        });
    }

    init(db) {
        // don't call super.init for security reasons
            
        this.methods = {
            'post /register': (req, res) => {
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
                                        this.createSession(db, res, user);
                                    }
                                });
                            }
                        });
                    }
                });
            },
            'post /login': (req, res) => {
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
                                this.createSession(db, res, user);
                            } else {
                                res.send({ 'error': wrongCredentialsMsg });
                            }
                        });
                    } else {
                        res.send({ 'error': wrongCredentialsMsg });
                    }
                });
            },
            'post /logout': (req, res) => {
                this.deactivateSession(db, req, res);
            }
        };
    }
}

module.exports = UsersApi;