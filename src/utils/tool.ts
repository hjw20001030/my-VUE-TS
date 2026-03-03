//格式化时间
export function formatDate(date: Date | string, fmt?: string) {
    if (!fmt) {
        fmt = "yyyy-MM-dd hh:mm:ss";
    }
    if (typeof date === 'string') {
        date = new Date(date.replace(/-/g, '/'));
    }
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? ((o as any)[k]) : (("00" + (o as any)[k]).substr(("" + (o as any)[k]).length)))
        }
    }
    return fmt;
}
// 将十六进制颜色转换为 rgba 格式
export function hexToRgba(hex: string, alpha: number) { 
    // 去掉 "#" 符号，如果有的话
    hex = hex.replace('#', '');

    // 获取 RGB 值
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // 返回 rgba 格式的颜色值
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const rootValue = 192;
export function toTitleFontPx(weight: number, px: number, family: string){
    const fontSize = document.documentElement.style.fontSize?.split('px')?.[0];
    if (fontSize) {
        const rem = px / rootValue;
        px = rem * Number(fontSize);
    }
    return (weight + ' ' + px + 'px ' + family).toString();
}
export function toPx(px: number,unit?:string){
    const fontSize = document.documentElement.style.fontSize?.split('px')?.[0];
    if (fontSize) {
        const rem = px / rootValue;
        px= rem * Number(fontSize);
    }
    if(unit){
        return px + unit;
    }
    return px;
}

export function displaySex(sex:string){
  if(sex == "-" || !sex ) return "-";
  return sex =='M'|| sex=='男' ?'男':'女';
}
//患者年龄显示脱敏
export function displayAge(age:string){
  if (!age) return '-';
  let newage = age.toString();
  if(newage.indexOf("岁") != -1){
    let val = newage.slice(0,newage.indexOf("岁"));
    if(val.length === 1){
      return  '<10岁';
    } else if(val.length > 1){
      let str = val.substr(0, 1);
      for (let i = 0; i < val.length - 1; i++) {
        str += '*';
      }
      return str+'岁';
    }
  } else {
    if(newage.length === 1 && newage != '-'){
      return  '<10';
    } else if(newage.length > 1){
      let str = newage.substr(0, 1);
      for (let i = 0; i < newage.length - 1; i++) {
        str += '*';
      }
      return str;
    }else {
      return newage;
    }
  }
}


export function fillDisplay(d: number | string): string | number {
        if (d !== undefined && d !== "" && d !== null) {
            return d
        } else {
            return "-";
        }
    }
export function fillBedDisplay(d: string) {
        if (d !== undefined && d !== "" && d !== null) {
            if (d[d.length - 1] !== "床") {
                d += "床"
            }
            return d
        } else {
            return "-";
        }
    }