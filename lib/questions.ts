/*
 * @Author: zhangwc zhangwc@knownsec.com
 * @Date: 2023-05-07 14:56:40
 * @LastEditors: zhangwc zhangwc@knownsec.com
 * @LastEditTime: 2023-05-10 22:45:35
 * @FilePath: /WebWizard/EasyMVC/lib/questions.ts
 * @Description: Inquirer所需参数
 */
export const Questions = [
  {
    type: "input",
    name: "routerUrl",
    message: "你想生成的router url,列 /users/xxx?"
  },
  {
    type: "confirm",
    name: "isValidate",
    message: "是否需要类型校验?"
  },
  {
    type: "input",
    name: "comment",
    message: "关于当前路由的注释说明是?"
  },
  {
    type: "list",
    name: "method",
    choices: [
      {
        name: 'get',
        value: "get"
      },
      {
        name: 'post',
        value: "post"
      },
      {
        name: 'delete',
        value: "delete"
      },
      {
        name: 'put',
        value: "put"
      }
    ]
  }
];