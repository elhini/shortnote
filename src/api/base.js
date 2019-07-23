var ObjectID = require('mongodb').ObjectID;
var _SessionsApi = require('./_sessions');

class BaseApi {
    constructor(collection) {
        this.collection = collection;
        this.url = '/api/' + collection;
        this._sessionsApi = new _SessionsApi();
        this.userDependent = true;
    }
    
    createObjectID(id){
        return new ObjectID(id);
    }

    init(db) {
        this.methods = {
            'post': (req, res, userID) => {
                const item = req.body;
                userID && (item.userID = userID);
                delete item._id;
                db.collection(this.collection).insertOne(item, (err, result) => {
                    if (err) { 
                        res.send({ 'error': err }); 
                    } else {
                        res.send(result.ops[0]);
                    }
                });
            },
            'get': (req, res, userID) => {
                const query = {}; // all
                userID && (query.userID = userID);
                db.collection(this.collection).find(query).toArray((err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        res.send(result);
                    }
                });
            },
            'get /:id': (req, res, userID, cb) => {
                const query = { '_id': this.createObjectID(req.params.id) };
                userID && (query.userID = userID);
                db.collection(this.collection).findOne(query, (err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        cb ? cb(result) : res.send(result);
                    }
                });
            },
            'put /:id': (req, res, userID) => {
                const query = { '_id': this.createObjectID(req.params.id) };
                userID && (query.userID = userID);
                const item = req.body;
                let _item = {...item};
                delete _item._id;
                db.collection(this.collection).updateOne(query, { $set: _item }, (err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        res.send(result.matchedCount ? item : { 'error': 'nothing was updated' });
                    }
                });
            },
            'delete /:id': (req, res, userID) => {
                const query = { '_id': this.createObjectID(req.params.id) };
                userID && (query.userID = userID);
                db.collection(this.collection).deleteOne(query, (err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        res.send({ 'deleted': true });
                    }
                });
            }
        };
    }

    connect(app, db){
        this.init(db);
        Object.keys(this.methods).forEach((methodAndPostfix) => {
            var handler = this.methods[methodAndPostfix];
            var options = {};
            if (typeof handler === 'object'){
                options = {...handler};
                handler = options.handler;
            }
            var mpArray = methodAndPostfix.split(' ');
            var method = mpArray[0];
            var postfix = mpArray[1] || '';
            app[method](this.url + postfix, (req, res) => {
                if (this.dontCheckSession || options.dontCheckSession){
                    handler(req, res);
                }
                else {
                    this._sessionsApi.findSession(db, req, res, (session) => {
                        if (!session) {
                            res.send({ 'error': 'session not found' });
                        } else if (!session.active) {
                            res.send({ 'error': 'session is not active' });
                        } else if (session.expireDate < new Date()) {
                            res.send({ 'error': 'session is expired' });
                            this._sessionsApi.updateSession(db, req, null, {active: false});
                        } else if ((this.adminAccess || options.adminAccess) && !session.isAdmin) {
                            res.send({ 'error': 'method needs admin session' });
                        } else {
                            var userID = this.userDependent && session.userID.toString();
                            handler(req, res, userID);
                            this._sessionsApi.updateSession(db, req, null, {expireDate: this._sessionsApi.getNewExpireDate()});
                        }
                    });
                }
            });
        });
    }
}

module.exports = BaseApi;