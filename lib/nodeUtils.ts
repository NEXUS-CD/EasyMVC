import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { IpromptInfo } from './data';
import { capitalize, toCamelCase } from './utils';
// 创建文件 接受文件路径，文件内容
export const currentPath = process.cwd();

// 判断正则是否存在utf-8
function decodeIfUtf8(url) {
    const decodedUrl = decodeURIComponent(url);
    const isUtf8 = /utf-8/i.test(decodedUrl);
    return isUtf8 ? decodeURIComponent(decodedUrl) : decodedUrl;
}
// 新增文件
export function createNewFile(fileName, fileContent, options = {}) {
    fs.writeFile(fileName, fileContent, options, err => {
        if (err) throw err;
        console.log(`New file ${fileName} created.`);
    });
}
export const readFileContent = (url: string) => {
    try {
        const content = fs.readFileSync(url, 'utf-8');
        return content;
    } catch (error) {
        console.error(`读取文件 ${url} 失败：${error}`);
        return '';
    }
}
// 获取执行路径
// 接受字符串，判断对应文件是否存在
export function isFileExists(path: string): boolean {
    try {
        return fs.statSync(path).isFile();
    } catch (error) {
        return false;
    }
}
// 拼接路径
export function joinPath(...paths: string[]) {
    return path.join(...paths);
}
//对路径进行处理并返回
export function urlToPath(urlPath: string) {
    try {
        urlPath = decodeURIComponent(urlPath);
        if (/^file:\/\//.test(urlPath)) {
            // fileURLToPath只支持 file:///C:/path/。其他路径会报错
            urlPath = fileURLToPath(urlPath);
        }
        return path.resolve(urlPath);
    } catch (err) {
        throw err
    }
}

export function getAppRootDir(urlPath: string) {
    return urlToPath(urlPath)
}

//根据用户输入的url，匹配router文件中所有的字符。并进行计算，决定routerUrl插入在哪 
export function calculateUrls(routerContent: string, routerUrl: string) {
    const moduleName = routerUrl.split("/")[1]
    // console.log(moduleName, "moduleName");

    // const regexString = `^\\s*router\\.(post|get|put|delete)\\(\\s*['\"]\\/api\\/${moduleName}(\\S+)['\"],?\\s*(auth,)?\\s*controller\\.\\w+\\.\\w+\\);?\\s*$`;
    //匹配注释 +路由信息    
    // const regexString = `^\\s*\\/\\/\\s*(\\S.*)?\n?\\s*router\\.(post|get|put|delete)\\(\\s*['\"]\\/api\\/${moduleName}\S+)['\"],?\\s*(auth,)?\\s*controller\\.\\w+\\.\\w+\\);?\\s*$`;
    const regexString = `^\\s*\\/\\/\\s*(\\S.*)?\n?\\s*router\\.(post|get|put|delete)\\(\\s*['\"]\\/api\\/(?:(?:${moduleName})\\/\\S*|(?:${moduleName})['\"])\\s*(?:,\\s*auth)?\\s*,\\s*controller\\.\\w+\\.\\w+\\);?\\s*$`
    const regex = new RegExp(regexString, "gm");
    //    /users/xxx 那就查找 路由文件中 所有users的路由
    const routes = [];
    let match;
    while ((match = regex.exec(routerContent))) {
        const [, , , path] = match;
        // console.log(match, "match");
        routes.push([match[0], `/${moduleName}${path}`]);
    }
    // 对路由进行比分计算 /api/user=1+字母开头0.1~0.26 /api/user/xxx=2+字母开头0.1~0.26
    // 接受字符串 /xx/xxx
    function calculateRouteScore(url: string) {
        const urlArr = url?.split("/").filter(item => item)
        return urlArr.reduce((reviousValue: number, currentValue: string, index: number) => {
            const A = 'A'.charCodeAt(0); // 起始字母的 ASCII 码
            return reviousValue + + (currentValue[0].toUpperCase().charCodeAt(0) - A + 1) / 100; // 转成大写字母并转为数字
        }, urlArr.length)
    }
    return {
        routerSrcNumberArr: routes.map((item: [string, string, number]) => ([...item, calculateRouteScore(item[1])])),
        routerUrlNumber: calculateRouteScore(routerUrl)
    }
}
// number加入arr，进行排序。
// 返回参数说明[] 前三个元素是arr。 第四个是number应该插入的顺序，-1代表 之前，1代表之后
export function findSmallerThan(arr: Array<[string, string, number]>, number: number) {
    arr = (JSON.parse(JSON.stringify(arr)) as Array<any>)
    arr.sort(([, , a], [, , b]) => {
        return a - b
    });
    let i = arr.findIndex((item: [string, string, number]) => item.includes(number))
    if (arr.length === 1 && i != -1) {//当搜索出来的 路由只有一个相同时
        return [...arr[i], 1]
    }
    if (i === -1) {
        arr = arr.concat([["", "", number]])
        arr.sort(([, , a], [, , b]) => {
            return a - b
        });
        i = arr.findIndex((item: [string, string, number]) => item.includes(number))
    }
    // console.log(i, "src i", arr);

    if (i == 0) {//当前在排序中是最小的，
        return [...arr[i + 1], -1]
    } else if (i === arr.length - 1) {//当前在排序中是最大的，
        return [...arr[i - 1], 1]
    }
    return [...arr[i + 1], 1]
    // return arr.findIndex((item: [string, string, number]) => item.includes(number))
}
// 接受文件路径和字符串作为参数，将字符串写入文件中
export function writeFile(filepath, str) {
    // 将字符串转换为 Buffer 形式
    const buffer = Buffer.from(str);
    // 调用 fs.writeFile 方法写入文件
    fs.writeFileSync(filepath, buffer);
}
export function createRouterContent(info: IpromptInfo) {
    const mod = info.routerUrl.split("/")[1]
    return `
    // ${info.comment}
    router.${info.method}('/api${info.routerUrl}',controller.${mod}.${toCamelCase(info.routerUrl)}${capitalize(info.method)})`
}
export function writeRouterFile(filepath, info: IpromptInfo, routerContent, successor,) {
    if (!isFileExists(filepath)) throw filepath + "路径不对"
    const str = routerContent.replace(successor[0], `
    ${successor[3] === 1 ? successor[0] : ""}
  ${createRouterContent(info)}
    ${successor[3] === -1 ? successor[0] : ""}
    `)
    writeFile(filepath, str)
}

