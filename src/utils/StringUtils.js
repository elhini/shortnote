export default class StringUtils {
    static isContains(text, string){
        return text.toLowerCase().includes(string.toLowerCase());
    }
} 