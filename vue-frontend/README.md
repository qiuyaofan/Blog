# AIPR Frontend

[🚧 开发环境][site-dev] | [📐 测试环境][site-stage]

[site-dev]: https://aiet-aicr-frontend.dev.dm-ai.com
[site-stage]: https://aiet-aicr-frontend.stage.dm-ai.com

## 浏览器兼容性要求

推荐使用 2020 年 12 月及之后发布版本的浏览器。

| Chrome | Edge | Safari | Firefox | 360  |
| ------ | ---- | ------ | ------- | ---- |
| 84     | 84   | 14.1   | 63      | 13.1 |

## 命名规范

本项目采用的命名方式：PascalCase（所有单词的首字母均为大写）、CamelCase（第一个单词首字母小写，其他单词首字母均为大写）、Hyphen（用连字符'-'来连接每个单词）、UpperCase（全部大写）。

1. 文件夹命名: Hyphen
2. 文件命名
   - 单组件文件 `.vue`：Hyphen
   - 类文件：Hyphen
   - 其他文件：Hyphen
3. 变量命名
   - 常量：UpperCase
   - 类：PascalCase
   - 属性：CamelCase
   - 变量：CamelCase

## 文件目录结构

```shell
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 静态资源文件
│   ├── components             // 全局UI组件，跨模块复用型；如Layout等
│   ├── constants              // 项目内常量，如中国行政区域划分等
│   ├── directives             // Vue 自定义指令
│   ├── plugins                // Vue 插件
│   ├── router                 // 路由配置
│   ├── services               // 对请求获取到的数据、发给后端的数据的适配层，用于隔离前后端接口，按模块分
│   ├── stores                 // 全局store管理
│   ├── types                  // 全局类型声明
│   ├── utils                  // 全局公用方法
│   ├── theme                  // 全局样式
│   ├── views                  // 模块化页面视图
│   ├── App.vue                // 应用
│   └── main.ts                // 入口 加载组件 初始化等
├── __tests__                  // 单元测试
├── .env.[mode]                // 环境变量
├── .eslintrc.js               // eslint 配置
├── .gitignore                 // git 忽略项
├── .prettierrc.js             // prettier 插件配置
├── .gitlab.ci.yml             // gitlab 自动化部署配置
├── runtime-structure.json     // 运行时配置，见 https://wiki.dm-ai.cn/pages/viewpage.action?pageId=243205285
├── package.json               // package.json
├── tsconfig.json              // ts 配置
├── index.html                 // vite Web App 的默认入口
└── vite.config.ts             // vite 开发构建工具配置
```
