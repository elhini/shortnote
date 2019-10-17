console.log('process.env.HOST', process.env.HOST);
if (!process.env.HOST){
    return;
}
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const cookieParser   = require("cookie-parser");
const cors           = require('cors');
const app            = express();
const port           = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "shortnote.elhini.now.sh" }));
const dbURL = process.env.HOST === 'localhost' ? require('./config/db').url : process.env.MONGODB_URI;
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