var ObjectID = require('mongodb').ObjectID;
var url = '/api/notes';
module.exports = function(app, db) {
    app.post(url, (req, res) => {
        const note = req.body;
        db.collection('notes').insertOne(note, (err, result) => {
            if (err) { 
                res.send({ 'error': err }); 
            } else {
                res.send(result.ops[0]);
            }
        });
    });
    app.get(url, (req, res) => {
        const query = {}; // all
        db.collection('notes').find(query).toArray((err, result) => {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send(result);
            }
        });
    });
    app.get(url+'/:id', (req, res) => {
        const query = { '_id': new ObjectID(req.params.id) };
        db.collection('notes').findOne(query, (err, result) => {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send(result);
            }
        });
    });
    app.put(url+'/:id', (req, res) => {
        const query = { '_id': new ObjectID(req.params.id) };
        const note = req.body;
        _note = Object.assign({}, note);
        delete _note._id;
        db.collection('notes').updateOne(query, { $set: _note }, (err, result) => {
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send(note);
            }
        });
    });
    app.delete(url+'/:id', (req, res) => {
        const query = { '_id': new ObjectID(req.params.id) };
        db.collection('notes').deleteOne(query, (err, result) => {
            console.log(err);
            if (err) {
                res.send({ 'error': err });
            } else {
                res.send({ 'deleted': true });
            }
        });
    });
};