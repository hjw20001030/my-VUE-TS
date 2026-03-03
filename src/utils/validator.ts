export function isHexColor(color: any) {
    if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color)) {
        return true;
    } else {
        return false;
    }
}

export function isString(o: any) {
    return Object.prototype.toString.call(o) === "[object String]"
}

export function isNumber(o: any) {
    return Object.prototype.toString.call(o) === '[object Number]';
}

export function isArray(o: any) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

export function isFunction(o: any) {
    return Object.prototype.toString.call(o) === "[object Function]";
}

export function isDate(o: any) {
    return Object.prototype.toString.call(o) === "[object Date]";
}

export function CheckDateTime(str: string) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = parseInt(r[2]) - 1 + '';
    var d = new Date(parseInt(r[1]), parseInt(r[2]), parseInt(r[3]), parseInt(r[4]), parseInt(r[5]), parseInt(r[6]));
    if (d.getFullYear() != parseInt(r[1])) return false;
    if (d.getMonth() != parseInt(r[2])) return false;
    if (d.getDate() != parseInt(r[3])) return false;
    if (d.getHours() != parseInt(r[4])) return false;
    if (d.getMinutes() != parseInt(r[5])) return false;
    if (d.getSeconds() != parseInt(r[6])) return false;
    return true;
}