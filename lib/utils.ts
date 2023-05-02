// 转为小驼峰
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// /aa/bb转 aaBb 小驼峰
export function toCamelCase(str) {
    return str.split('/').filter(item => item).map((item, index) => index == 0 ? item : capitalize(item)).join("");
}