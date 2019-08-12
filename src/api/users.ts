import { Db } from "mongodb";
import { BaseApi } from './base';
import CryptUtils from '../utils/CryptUtils';

export default class UsersApi extends BaseApi {
    constructor() {
        super('users');
        this.userDependent = false;
        this.adminAccess = true;
    }
    init(db: Db) {
        super.init(db);
        this.methods = {
            ...this.methods,
            'post /register': {
                handler: (req, res) => {
                    const ticket = req.body;
                    const query = {login: ticket.login};
                    db.collection(this.collection).findOne(query, (err, user) => {
                        if (err) { 
                            res.send({ 'error': err });
                        } else if (user) {
                            res.send({ 'error': 'login already in use' });
                        } else {
                            CryptUtils.cryptPassword(ticket.password, (err: Error, hash?: string) => {
                                if (err) { 
                                    res.send({ 'error': err });
                                } else {
                                    let user = {login: ticket.login, password: hash || '', registrationDate: new Date().toISOString()};
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
                dontCheckSession: true,
                adminAccess: false
            },
            'post /login': {
                handler: (req, res) => {
                    const ticket = req.body;
                    const query = {login: ticket.login};
                    const wrongCredentialsMsg = 'wrong login or password';
                    db.collection(this.collection).findOne(query, (err, user) => {
                        if (err) { 
                            res.send({ 'error': err });
                        } else if (user) {
                            CryptUtils.comparePassword(ticket.password, user.password, (err: Error, isPasswordMatch: boolean) => {
                                if (err) { 
                                    res.send({ 'error': err }); 
                                } else if (isPasswordMatch) {
                                    if (user.blocked){
                                        res.send({ 'error': 'user blocked' }); 
                                    }
                                    else {
                                        this._sessionsApi.createSession(db, res, user);
                                    }
                                } else {
                                    res.send({ 'error': wrongCredentialsMsg });
                                }
                            });
                        } else {
                            res.send({ 'error': wrongCredentialsMsg });
                        }
                    });
                },
                dontCheckSession: true,
                adminAccess: false
            },
            'post /logout': {
                handler: (req, res) => {
                    res.cookie('sessionID', null, {expires: new Date()});
                    this._sessionsApi.updateSession(db, req, res, {active: false});
                },
                dontCheckSession: true,
                adminAccess: false
            }
        };
    }
}