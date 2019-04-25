export default class DateUtils {
    static toStr(date) {
        var dateStr = date instanceof Date ? date.toISOString() : date || '';
        return dateStr.replace('T', ' ').substr(0, 19);
    }
} 