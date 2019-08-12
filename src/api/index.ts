import { Application } from "express";
import { Db } from "mongodb";
import NotesAPI from './notes';
import UsersAPI from './users';
import SessionsAPI from './sessions';
import SettingsAPI from './settings';

module.exports = function(app: Application, db: Db) {
    (new NotesAPI()).connect(app, db);
    (new UsersAPI()).connect(app, db);
    (new SessionsAPI()).connect(app, db);
    (new SettingsAPI()).connect(app, db);
};