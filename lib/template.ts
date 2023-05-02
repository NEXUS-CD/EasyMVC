import { IpromptInfo } from "./data"
import { capitalize, toCamelCase } from "./utils"
const resTemplate = {
  "get": `this.ctx.success({
        data: res,
        msg: '查询成功',
      });`,
  "post": `
    this.ctx.success({
        msg: '添加成功',
      });
    `,
  "delete": `
    this.ctx.success({
        msg: '删除成功',
      })`,
  "put": `
    this.ctx.success({
        msg: '修改成功',
      })
    `,
}
const method = {
  "get": "find",
  "post": "create",
  "delete": "deleteOne",
  "put": "updateOne"
}
export default (info: IpromptInfo) => {
  const mod = info.routerUrl.split("/")[1]
  return {
    controller(is) {
      return `
   ${!is ? ` import { Controller } from 'egg';
   export default class ${capitalize(mod)}Controller extends Controller {` : ""}
        async  ${toCamelCase(info.routerUrl)}${capitalize(info.method)}(){
    const res = await this.service.${mod}.${toCamelCase(info.routerUrl)}${capitalize(info.method)}();
            ${resTemplate[info.method]}
        }
  ${!is ? "  }" : ""}
            `
    },
    service(is) {
      return `
          ${!is ? `  import { Service } from 'egg';
          export default class ${capitalize(mod)}Service extends Service {` : ""}
                async  ${toCamelCase(info.routerUrl)}${capitalize(info.method)}(){
                    const res = await this.ctx.model.${mod}.${method[info.method]}();
                    return res
                }
  ${!is ? "  }" : ""}
                    `
    },
    model() {
      return `
            export default (app) => {
                const mongoose = app.mongoose;
                const Schema = mongoose.Schema;
                const ${mod}Schema = new Schema(
                  {
                    username: String,
                    password: String
                  },
                );
                return mongoose.model('${mod}', ${mod}Schema)
              }
            `
    }
  }
}
