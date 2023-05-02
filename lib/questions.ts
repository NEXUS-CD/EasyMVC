export const Questions = [
  {
    type: "input",
    name: "routerUrl",
    message: "你想生成的router url,列 /users/xxx?"
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
        value:"get"
      },
      {
        name: 'post',
        value:"post"
      },
      {
        name: 'delete',
        value:"delete"
      },
      {
        name: 'put',
        value:"put"
      }
    ]
  }
];