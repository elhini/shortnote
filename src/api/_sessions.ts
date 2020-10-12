import { Request, Response } from "express";
import { Db, ObjectID } from "mongodb";
import { User, Session } from '../types/index';

export default class _SessionsApi {
    collection: string;

    constructor(){
        this.collection = 'sessions';
    }
    
    createObjectID(id: string){
        return new ObjectID(id);
    }

    getSessionObjectID(req: Request, res: Response | null){
        try {
            return this.createObjectID(req.cookies.sessionID);
        }
        catch (e) {
            console.error(e);
            res && res.send({ 'error': 'invalid session id' });
            return null;
        }
    }

    getLifeTime(){
        return 24 * 60 * 60 * 1000; // 1 day
    }

    getNewExpireDate(){
        let now = new Date();
        return new Date(now.getTime() + this.getLifeTime());
    }
    
    createSession(db: Db, res: Response, user: User){
        let expireDate = this.getNewExpireDate();
        let session: Session = {userID: user._id || '', active: true, expireDate: expireDate.toISOString() };
        if (user.isAdmin){
            session.isAdmin = true;
        }
        db.collection(this.collection).insertOne(session, (err, result) => {
            if (err) { 
                res.send({ 'error': err });
            } else {
                var newSession: {_id: ObjectID} = result.ops[0];
                this.prolongSessionCookie(res, newSession._id, expireDate);
                res.send(session);
            }
        });
    }

    prolongSessionCookie(res: Response, sessionID: ObjectID | null, expireDate: Date){
        sessionID && res.cookie('sessionID', sessionID.toString(), { expires: expireDate, httpOnly: true, secure: true, sameSite: 'none' });
    }

    findSession(db: Db, req: Request, res: Response, cb: (s: Session) => void){
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

    updateSession(db: Db, req: Request, res: Response | null, set: SessionDiff){
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

interface SessionDiff {
    active?: boolean;
    expireDate?: Date;
}