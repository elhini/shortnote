var ObjectID = require('mongodb').ObjectID;

class BaseApi {
    constructor(collection) {
        this.collection = collection;
        this.url = '/api/' + collection;
    }
    
    createObjectID(id){
        return new ObjectID(id);
    }

    connect(app, db) {
        app.post(this.url, (req, res) => {
            const item = req.body;
            delete item._id;
            db.collection(this.collection).insertOne(item, (err, result) => {
                if (err) { 
                    res.send({ 'error': err }); 
                } else {
                    res.send(result.ops[0]);
                }
            });
        });
        app.get(this.url, (req, res) => {
            const query = {}; // all
            db.collection(this.collection).find(query).toArray((err, result) => {
                if (err) {
                    res.send({ 'error': err });
                } else {
                    res.send(result);
                }
            });
        });
        app.get(this.url+'/:id', (req, res) => {
            const query = { '_id': new ObjectID(req.params.id) };
            db.collection(this.collection).findOne(query, (err, result) => {
                if (err) {
                    res.send({ 'error': err });
                } else {
                    res.send(result);
                }
            });
        });
        app.put(this.url+'/:id', (req, res) => {
            const query = { '_id': new ObjectID(req.params.id) };
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
        });
        app.delete(this.url+'/:id', (req, res) => {
            const query = { '_id': new ObjectID(req.params.id) };
            db.collection(this.collection).deleteOne(query, (err, result) => {
                if (err) {
                    res.send({ 'error': err });
                } else {
                    res.send({ 'deleted': true });
                }
            });
        });
    }
}

module.exports = BaseApi;