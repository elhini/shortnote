var BaseApi = require('./base');
var _SessionsApi = require('./_sessions');
var CryptUtils = require('../utils/CryptUtils');

class UsersApi extends BaseApi {
    constructor() {
        super('users');
        this.dontCheckSession = true;
        this._sessionsApi = new _SessionsApi();
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
                                        this._sessionsApi.createSession(db, res, user);
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
                                this._sessionsApi.createSession(db, res, user);
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
                res.cookie('sessionID', null, {expires: new Date()});
                this._sessionsApi.updateSession(db, req, res, {active: false});
            }
        };
    }
}

module.exports = UsersApi;