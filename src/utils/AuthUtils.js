import LocalStorage from "./LocalStorage";
import UsersApiClient from '../api-clients/users';
    
export default class AuthUtils {
    static isLoggedIn() {
        return !!this.getSession();
    }
    
    static getSession() {
        return this.session || JSON.parse(LocalStorage.get('session'));
    }

    static login(login, password, cb) {
        (new UsersApiClient()).login(login, password, (session) => {
            session.loggedAs = login;
            this.setSession(session);
            cb(session);
        });
    }

    static logout(cb) {
        (new UsersApiClient()).logout(() => {
            this.setSession(null);
            cb();
        });
    }
    
    static setSession(session) {
        LocalStorage.set('session', JSON.stringify(session));
        this.session = session;
    }
};