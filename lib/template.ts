/*
 * @Author: zhangwc zhangwc@knownsec.com
 * @Date: 2023-05-07 14:56:40
 * @LastEditors: zhangwc zhangwc@knownsec.com
 * @LastEditTime: 2023-05-11 23:33:17
 * @FilePath: /WebWizard/EasyMVC/lib/template.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IpromptInfo } from "./data"
import { capitalize, toCamelCase } from "./utils"
const resTemplate = {
  "get": {
    res: `
    this.ctx.success({
          data: res,
          msg: '查询成功',
        });
        `,
    req: "this.ctx.params",
    validateRes: ``,
    validate: {
      validate: `new Validate(
        object({
          userName: string(),
          passWord: string(),
        })
      );`,
      controller: ` if (! await AAGetSchema.triggerValidation(this.ctx, this.ctx.params)) return`
    },

  },
  "post": {
    res: `
    this.ctx.success({
        msg: '添加成功',
        data:res
      });
    `,
    req: "this.ctx.request.body",
    validateRes: ``,
    validate: {
      validate: `new Validate(
        object({
          userName: string().required(),
          passWord: string().required(),
        })
      );`,
      controller: `if (! await AAGetSchema.triggerValidation(this.ctx, this.ctx.request.body)) return`
    },

  },
  "delete": {
    res: `
    this.ctx.success({
        msg: '删除成功',
        data:res
      });
    `,
    req: "this.ctx.request.body",
    validateRes: `
    if (!res) {
      this.ctx.status = 404;
      this.ctx.body = 'User not found';
      return;
    }
    `,
    validate: {
      validate: `new Validate(
        object({
          _id: string().required(),
        })
      );`,
      controller: `if (! await AAGetSchema.triggerValidation(this.ctx, this.ctx.request.body)) return`
    },

  },
  "put": {
    res: `
    this.ctx.success({
        msg: '修改成功',
        data:res
      });
    `,
    req: "this.ctx.request.body",
    validateRes: `
    if (!res) {
      this.ctx.status = 404;
      this.ctx.body = 'User not found';
      return;
    }
    `,
    validate: {
      validate: `new Validate(
        object({
          _id: string().required(),
          userName: string().required(),
          passWord: string().required(),
        })
      );`,
      controller: `if (! await AAGetSchema.triggerValidation(this.ctx, this.ctx.request.body)) return`
    },

  },
}
const method = {
  "get": "find",
  "post": "create",
  "delete": "findByIdAndRemove",
  "put": "findByIdAndUpdate"
}
export default (info: IpromptInfo) => {
  const url = info.routerUrl.split("/")
  const mod = url[1]
  // url转大驼峰
  const urlToBigHump = url.map(item => capitalize(item)).join("")
  return {
    controller(is, isValidate) {
      const validateName = `${urlToBigHump}${capitalize(info.method)}Schema`
      return `
   ${!is ? ` import { Controller } from 'egg';
   ${!is&&isValidate?`import * as validators from "../validators/${mod}"`:""}
   export default class ${capitalize(mod)}Controller extends Controller {` : ""}
        async  ${toCamelCase(info.routerUrl)}${capitalize(info.method)}(){
         ${isValidate ? ` if(! await validators.${validateName}.triggerValidation(this.ctx,${resTemplate[info.method].req})) return` : ""}
    const res = await this.service.${mod}.${toCamelCase(info.routerUrl)}${capitalize(info.method)}(${resTemplate[info.method].req});
            ${resTemplate[info.method].validateRes}
    ${resTemplate[info.method].res}
        }
  ${!is ? "  }" : ""}
            `
    },
    service(is) {
      return `
          ${!is ? `  import { Service } from 'egg';
          export default class ${capitalize(mod)}Service extends Service {` : ""}
                async  ${toCamelCase(info.routerUrl)}${capitalize(info.method)}(req){
                  return  await this.ctx.model.${mod}.${method[info.method]}(req);
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
    },
    validate(is) {
      return `  ${!is ? `
      import { string, object } from 'yup';
      import Validate from './index';
      `: ""}
export const ${urlToBigHump}${capitalize(info.method)}Schema = ${resTemplate[info.method].validate.validate}

      `
    }
  }
}
