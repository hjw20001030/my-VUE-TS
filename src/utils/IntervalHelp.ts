
interface KEYOB {
    [propName: string]: any
}
let keyOb: KEYOB = {};

let callbackOb: KEYOB = {};
export function startInterval(key: string, callback: Function, time: number): void {
    callback();
    if (keyOb[key]) {
        clearInterval(keyOb[key]);
    }
    keyOb[key] = setInterval(callback, time);
    callbackOb[key] = callback;
}
export function endInterval(key: string) {
    clearInterval(keyOb[key]);
    delete keyOb[key];
    delete callbackOb[key]
}
export function runImmediate(key: string) {
    if (callbackOb[key] !== undefined) {
        callbackOb[key]();
    } else {
        // eslint-disable-next-line
        console.warn("runImmediate-> 不存在callback");
    }
}
export function isExistKey(key: string) {
    return keyOb[key];
}
export function endAll() {
    for (let [key, id] of Object.entries(keyOb)) {
        clearInterval(id);
    }
    keyOb = {};
}