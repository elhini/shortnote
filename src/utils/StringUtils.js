export default class StringUtils {
    static isContains(text, string){
        return text.toLowerCase().indexOf(string.toLowerCase()) >= 0;
    }
} 