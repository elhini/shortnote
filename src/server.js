console.log('process.env.HOST', process.env.HOST);
if (!process.env.HOST){
    return;
}
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const cookieParser   = require("cookie-parser");
const app            = express();
const port           = 8000;
app.use(bodyParser.json());
app.use(cookieParser());
const dbURL = process.env.HOST === 'localhost' ? require('./config/db').url : process.env.MONGODB_URI;
console.log('dbURL', dbURL);
if (!dbURL){
    return;
}
MongoClient.connect(dbURL, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log(err);
    }
    var db = client && client.db('shortnote');
    require('./api')(app, db);
    app.listen(port, () => {
        console.log('listening on ' + port);
    });
});