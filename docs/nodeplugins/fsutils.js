var fs = require("fs");
let readline = require('readline');

/**
 * 替换所有字符串
 * @param {*} str 
 * @param {*} reg 
 * @param {*} resStr 
 * @returns 
 */
function replaceAll(str, reg, resStr) {
    if (!str) {
        return str;
    }
    let result = str.replace(reg, resStr);
    if (result.indexOf(reg) !== -1) {
        result = replaceAll(result, reg, resStr);
    }
    return result;
}

/**
 * 按行读取文件内容
 */
function readFileToArr(fReadName, callback) {
    let fRead = fs.createReadStream(fReadName);
    let objReadline = readline.createInterface({
        input: fRead
    });
    let arr = new Array();
    objReadline.on('line', line => {
        arr.push(line);
    });
    objReadline.on('close', () => {
        callback(arr);
    });
}

/**
 * 读取文件内容为字符串
 */
function readString(path) {
    fs.readFile(path, function (err, data) {
        if (err) {
            console.error(err);
            return '';
        }
        return data.toString();
    });
}

// 暴露接口
module.exports = {
    "readString": readString,
    "readFileToArr": readFileToArr,
    "replaceAll": replaceAll,
}