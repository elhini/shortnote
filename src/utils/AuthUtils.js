import LocalStorage from "./LocalStorage";
    
export default class AuthUtils {
    static isLoggedIn() {
        var session = this.getSession();
        return session && session.expireDate > new Date().toISOString();
    }
    
    static getSession() {
        return this.session || JSON.parse(LocalStorage.get('session'));
    }
    
    static setSession(session) {
        LocalStorage.set('session', JSON.stringify(session));
        this.session = session;
    }
};