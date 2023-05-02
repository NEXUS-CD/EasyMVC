# EasyMVC
.
|-- README.md                          // 项目的说明文档，对项目的介绍、使用方式、更新记录等进行说明
|-- bin                                // 存放可执行的二进制文件或脚本，可以通过命令行在此路径下运行
|   `-- main.ts                        // 一个类型脚本的二进制主函数，类似于包含所有计算机程序指令的“主程序”
|-- dist                               // 存放编译后生成的文件，通常是 JavaScript 文件或者 CSS 文件
|   |-- bundle.js                      // 编译后合并的 JavaScript 文件
|-- lib                                // 存放库、模块和插件等 JavaScript 源文件
|   |-- commands.ts                    // 命令行工具的处理逻辑
|   |-- constants.ts                   // 存放常量数据
|   |-- data.d.ts                      // 存放 TypeScript 的类型定义文件
|   |-- nodeUtils.ts                   // 提供操作文件、路径、模块等常用 Node.js API 的封装
|   |-- questions.ts                   // 存放与命令行交互的问题和答案
|   |-- template.ts                    // 存放已经写好的模板，例如项目模板、组件模板等
|   `-- utils.ts                       // 存放常用的工具函数
|-- node_modules                       // 存放当前项目中使用的所有依赖包
|-- package.json                      // 当前项目的包信息，包含所有的依赖包、脚本命令等
|-- pnpm-lock.yaml                    // 存储依赖关系图及每个依赖包的具体版本信息（即 `pnpm-shrinkwrap.json` 文件）
|-- tsconfig.json                     // TypeScript 的配置文件，包括编译选项、类型声明的处理方式、文件路径映射等
`-- webpack.config.js                 // Webpack 的配置文件，包含所有打包的相关信息，可以定制入口、出口、模块、插件等

# 使用说明
1.pnpm i
2.pnpm cs
1.输入mvc，根据交互输入对应的信息即可，注意支持的项目路径如下 （请在根目录使用,之后会使用配置时设置）
  1.router:app/router.ts
  2.controller:app/controller
  3.service:app/service
  4.model:app/model
# 调试说明
pnpm i
pnpm cs(打包+软连接)

