var ObjectID = require('mongodb').ObjectID;

class _SessionsApi {
    constructor(){
        this.collection = 'sessions';
    }
    
    createObjectID(id){
        return new ObjectID(id);
    }

    getSessionObjectID(req, res){
        try {
            return this.createObjectID(req.cookies.sessionID);
        }
        catch (e) {
            res.send({ 'error': 'invalid session id' });
        }
    }

    getLifeTime(){
        return 24 * 60 * 60 * 1000; // 1 day
    }

    getNewExpireDate(){
        let now = new Date();
        return new Date(now.getTime() + this.getLifeTime());
    }
    
    createSession(db, res, user){
        let expireDate = this.getNewExpireDate();
        let session = {userID: user._id, active: true, expireDate: expireDate };
        if (user.isAdmin){
            session.isAdmin = true;
        }
        db.collection(this.collection).insertOne(session, (err, result) => {
            if (err) { 
                res.send({ 'error': err });
            } else {
                session = result.ops[0];
                this.prolongSessionCookie(res, session._id, expireDate);
                res.send(session);
            }
        });
    }

    prolongSessionCookie(res, sessionID, expireDate){
        res.cookie('sessionID', sessionID.toString(), { expires: expireDate, httpOnly: true });
    }

    findSession(db, req, res, cb){
        const query = { '_id': this.getSessionObjectID(req, res) };
        if (!query._id){
            return;
        }
        db.collection(this.collection).findOne(query, (err, session) => {
            if (err) { 
                res.send({ 'error': err });
            } else {
                cb(session);
            }
        });
    }

    updateSession(db, req, res, set){
        const query = { '_id': this.getSessionObjectID(req, res) };
        if (!query._id){
            return;
        }
        db.collection(this.collection).updateOne(query, { $set: set }, (err, result) => {
            if (err) { 
                res ? res.send({ 'error': err }) : console.error(res);
            } else {
                if (res) {
                    set.expireDate && this.prolongSessionCookie(res, query._id, set.expireDate);
                    res.send({ 'updated': true, set });
                }
            }
        });
    }
}

module.exports = _SessionsApi;