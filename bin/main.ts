#!/usr/bin/env node
import { program } from 'commander';
import { userPrompt } from '../lib/commands';
import { Questions } from '../lib/questions';
// 添加一个命令
program
  .version('1.0.0')
  // .addCommand(command1(questions1));//command 分离的写法 demo
  // .addOption(myOption(() => { }))//optin 分离写法 demo
  .action(async () => {//可以理解为立即执行的命令
    const d = await userPrompt(Questions)
  });

program.parse(process.argv);
