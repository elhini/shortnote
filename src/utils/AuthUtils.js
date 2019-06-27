import LocalStorage from "./LocalStorage";
    
export default class AuthUtils {
    static isLoggedIn() {
        return !!this.getSession();
    }
    
    static getSession() {
        return this.session || JSON.parse(LocalStorage.get('session'));
    }
    
    static setSession(session) {
        LocalStorage.set('session', JSON.stringify(session));
        this.session = session;
    }
};