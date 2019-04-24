export default class LocalStorage {
    static key = 'elhini-shortnote-items';

    static set(value) {
        localStorage.setItem(this.key, JSON.stringify(value));
    }

    static get() {
        return JSON.parse(localStorage.getItem(this.key)) || []
    }
} 