import { Request, Response, Application } from "express";
import { Db, ObjectID } from "mongodb";
import { Session } from '../types/index';
import _SessionsApi from './_sessions';

export class BaseApi {
    collection: string;
    url: string;
    _sessionsApi: _SessionsApi;
    userDependent: boolean;
    adminAccess: boolean;
    methods: {[method: string]: MethodHandler | MethodOptions};

    constructor(collection: string) {
        this.collection = collection;
        this.url = '/api/' + collection;
        this._sessionsApi = new _SessionsApi();
        this.userDependent = true;
        this.adminAccess = false;
        this.methods = {};
    }
    
    createObjectID(id: string){
        return new ObjectID(id);
    }

    init(db: Db) {
        this.methods = {
            'post': (req: Request, res: Response, userID?: string) => {
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
            'get': (req: Request, res: Response, userID?: string) => {
                const query: DBQuery = {}; // all
                userID && (query.userID = userID);
                db.collection(this.collection).find(query).toArray((err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        if (this.collection === 'users'){
                            result.forEach(u => delete u.password);
                        }
                        res.send(result);
                    }
                });
            },
            'get /:id': (req: Request, res: Response, userID?: string, cb?: (r: any) => void) => {
                const query: DBQuery = { '_id': this.createObjectID(req.params.id) };
                userID && (query.userID = userID);
                db.collection(this.collection).findOne(query, (err, result) => {
                    if (err) {
                        res.send({ 'error': err });
                    } else {
                        cb ? cb(result) : res.send(result);
                    }
                });
            },
            'put /:id': (req: Request, res: Response, userID?: string) => {
                const query: DBQuery = { '_id': this.createObjectID(req.params.id) };
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
            'delete /:id': (req: Request, res: Response, userID?: string) => {
                const query: DBQuery = { '_id': this.createObjectID(req.params.id) };
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

    getOptionValue(options: MethodOptions | undefined, key: 'dontCheckSession' | 'adminAccess'){
        return options && typeof options[key] !== 'undefined' ? options[key] : (this as any)[key];
    }

    connect(app: Application, db: Db){
        this.init(db);
        Object.keys(this.methods).forEach((methodAndPostfix) => {
            var handler = this.methods[methodAndPostfix] as MethodHandler;
            var options = this.methods[methodAndPostfix] as MethodOptions;
            if (typeof options === 'object'){
                handler = options.handler;
            }
            var mpArray = methodAndPostfix.split(' ');
            var method = mpArray[0] as MethodName;
            var postfix = mpArray[1] || '';
            app[method](this.url + postfix, (req: Request, res: Response) => {
                if (!db){
                    return res.send({ 'error': 'no database connection' });
                }
                if (this.getOptionValue(options, 'dontCheckSession')){
                    handler(req, res);
                }
                else {
                    this._sessionsApi.findSession(db, req, res, (session: Session) => {
                        var adminAccess = this.getOptionValue(options, 'adminAccess');
                        if (!session) {
                            res.send({ 'error': 'session not found' });
                        } else if (!session.active) {
                            res.send({ 'error': 'session is not active' });
                        } else if (session.expireDate < new Date().toISOString()) {
                            res.send({ 'error': 'session is expired' });
                            this._sessionsApi.updateSession(db, req, null, {active: false});
                        } else if (adminAccess && !session.isAdmin) {
                            res.send({ 'error': '"' + method + ' ' + this.collection + '" action needs admin session' });
                        } else {
                            var userID = this.userDependent ? session.userID.toString() : '';
                            handler(req, res, userID);
                            this._sessionsApi.updateSession(db, req, null, {expireDate: this._sessionsApi.getNewExpireDate()});
                        }
                    });
                }
            });
        });
    }
}

interface DBQuery {
    _id?: ObjectID;
    userID?: string;
}

export type MethodHandler = (req: Request, res: Response, userID?: string, cb?: HandlerCallback) => void;

type HandlerCallback = (result: any) => void;

interface MethodOptions {
    handler: MethodHandler;
    dontCheckSession?: boolean;
    adminAccess?: boolean;
}

type MethodName = 'post' | 'get' | 'put' | 'delete';