let config;
try { config = require('./config/server') } catch (e) { config = process.env }
if (!config.MONGODB_URI){
    return;
}
const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const cookieParser   = require("cookie-parser");
const cors           = require('cors');
const app            = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: config.ALLOWED_ORIGIN, credentials: true }));
MongoClient.connect(config.MONGODB_URI, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log(err);
    }
    var dbName = config.MONGODB_URI.split('/').pop();
    var db = client && client.db(dbName);
    require('./api')(app, db);
    var port = process.env.PORT || config.PORT; // Heroku dynamically assigns a port
    app.listen(port, () => {
        console.log('listening on ' + port);
    });
});