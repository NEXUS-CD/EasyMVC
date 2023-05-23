#!/usr/bin/env node
import { program } from 'commander';
import { userPrompt } from '../lib/commands';
import { Questions } from '../lib/questions';
import { appendToFile, calculateUrls, createNewFile, createRouterContent, currentPath, findSmallerThan, isFileExists, joinPath, readFileContent, urlToPath, writeFile, writeRouterFile } from '../lib/nodeUtils';
import { SOURCE_FILE_URL, controllerUrl, modelUrl, routerUrl, serviceUrl, validatorslUrl } from '../lib/constants';
import template from "../lib/template"
import { exec } from 'child_process'
// 添加一个命令
program
  .version('1.0.0')
  // .addCommand(command1(questions1));//command 分离的写法 demo
  // .addOption(myOption(() => { }))//optin 分离写法 demo
  .action(async () => {//可以理解为立即执行的命令
    const info = await userPrompt(Questions)
    // 拼接路由文件地址
    const router = joinPath(urlToPath(currentPath), SOURCE_FILE_URL[routerUrl])
    if (!isFileExists(router)) {
      throw `${router} 文件不存在`
    }
    const routerContent = readFileContent(router)
    const { routerSrcNumberArr, routerUrlNumber } = calculateUrls(routerContent, info.routerUrl)
    console.log("写入路由中...");
    if (!routerSrcNumberArr?.length) {//代表router中无类似路由
      // 拼接到最后
      console.log("无匹配路由，新建路由中");
      writeFile(router, routerContent.replace("};", `
      ${createRouterContent(info)}
  };
    `))
    } else {
      // 获取当前大于这个数的最小一个数 的路由内容
      const successor = findSmallerThan(routerSrcNumberArr as Array<[string, string, number]>, routerUrlNumber)
      writeRouterFile(router, info, routerContent, successor,)
    }
    const { controller: tController, service: tService, model: tModel, validate: tvalidate } = template(info)
    console.log("写入路由成功");
    if (info.isValidate) console.log("写入默认校验规则中")
    const validate = joinPath(urlToPath(currentPath), SOURCE_FILE_URL[validatorslUrl], info.routerUrl.split('/')[1] + ".ts")
    if (info.isValidate) {
      if (isFileExists(validate)) {
        console.log("validatorsr文件存在，尾部添加内容中...");
        const validateContent = readFileContent(validate)
        writeFile(
          validate,
          validateContent + "\n" + tvalidate(true)
        )
      } else {
        console.log("validators文件不存在，新增文件，添加内容中...");
        createNewFile(validate, tvalidate(false))
      }
    }
    if (info.isValidate) console.log("写入默认校验规则完成")
    console.log("写入controller中...")
    // 拼接controller文件地址
    const controller = joinPath(urlToPath(currentPath), SOURCE_FILE_URL[controllerUrl], info.routerUrl.split('/')[1] + ".ts")
    if (isFileExists(controller)) {
      console.log("controller文件存在，尾部添加内容中...");
      const controllerContent = readFileContent(controller)
      writeFile(
        controller,
        appendToFile((info.isValidate && !controllerContent.includes("../validators/") ? `import * as validators from "../validators/${info.routerUrl.split('/')[1]}" \n` : "") + controllerContent, tController(true, info.isValidate))
      )
    } else {
      console.log("controller文件不存在，新增文件，添加内容中...");
      createNewFile(controller, tController(false, info.isValidate))
    }
    console.log("controller文件生成成功");
    // 拼接service文件地址
    const service = joinPath(urlToPath(currentPath), SOURCE_FILE_URL[serviceUrl], info.routerUrl.split('/')[1] + ".ts")
    if (isFileExists(service)) {
      console.log("service文件存在，尾部添加内容中...");
      const serviceContent = readFileContent(service)
      writeFile(
        service,
        appendToFile(serviceContent, tService(true))
      )
    } else {
      console.log("service文件不存在，新增文件，添加内容中...");
      createNewFile(service, tService(false))
    }
    console.log("service文件生成成功");
    const model = joinPath(urlToPath(currentPath), SOURCE_FILE_URL[modelUrl], info.routerUrl.split('/')[1] + ".ts")
    if (!isFileExists(model)) {//模块文件不存在-创建。
      console.log("创建model文件中...");
      createNewFile(model, tModel())
      console.log("创建model成功");
    }
    console.log("文件创建完毕");
    exec(' pnpm lint-staged', (err, stdout, stderr) => {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log("代码格式化完毕");
    });

  });

program.parse(process.argv);

