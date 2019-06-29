var ObjectID = require('mongodb').ObjectID;

class BaseApi {
    constructor(collection) {
        this.collection = collection;
        this.url = '/api/' + collection;
    }
    
    createObjectID(id){
        return new ObjectID(id);
    }

    getSessionObjectID(req){
        // TODO: get from cookies
        const sessionID = req.headers.sessionid; // lowercase!
        try {
            return this.createObjectID(sessionID);
        }
        catch (e) {
            res.send({ 'error': 'invalid session id' });
        }
    }

    init(db) {
        this.methods = {
            'post': (req, res, userID) => {
                const item = req.body;
                item.userID = userID;
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
                const query = { userID }; // all by user
                db.collection(this.collection).find(query).toArray((err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        res.send(result);
                    }
                });
            },
            'get /:id': (req, res, userID) => {
                const query = { '_id': new ObjectID(req.params.id), userID };
                db.collection(this.collection).findOne(query, (err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        res.send(result);
                    }
                });
            },
            'put /:id': (req, res, userID) => {
                const query = { '_id': new ObjectID(req.params.id), userID };
                const item = req.body;
                let _item = Object.assign({}, item);
                delete _item._id;
                db.collection(this.collection).updateOne(query, { $set: _item }, (err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        res.send(item);
                    }
                });
            },
            'delete /:id': (req, res, userID) => {
                const query = { '_id': new ObjectID(req.params.id), userID };
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
            var mpArray = methodAndPostfix.split(' ');
            var method = mpArray[0];
            var postfix = mpArray[1] || '';
            app[method](this.url + postfix, (req, res) => {
                if (this.dontCheckSession){
                    handler(req, res);
                }
                else {
                    const query = { '_id': this.getSessionObjectID(req) };
                    db.collection('sessions').findOne(query, (err, session) => {
                        if (err) {
                            res.send({ 'error': err });
                        } else if (!session) {
                            res.send({ 'error': 'session not found' });
                        } else if (!session.active) {
                            res.send({ 'error': 'session is not active' });
                        } else if (session.expireDate < new Date()) {
                            // TODO: deactivate session
                            res.send({ 'error': 'session is expired' });
                        } else {
                            handler(req, res, session.userID.toString());
                        }
                    });
                }
            });
        });
    }
}

module.exports = BaseApi;