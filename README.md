## 1. 使用说明：  
* 在  `package.json` 中 添加
`"build": "night-version"`
* 定义打包命令, 示例如下
```
    "build:dev": "react-app-rewired build",
    "build:beta": "dotenv -e .env.dev react-app-rewired build",
    "build:pro": "dotenv -e .env.pro react-app-rewired build",
```
* 打包时，执行 `npm run build` 即可

## 2. 自定义配置（非必须）
* 默认下，导出路径为根路径下的 `src/assets/version`  
*`lib` 为 版本文件*   
*`index.js` 为 导出当前环境的版本信息*  

* 可在 package.json 中添加 vpath，指定配置文件地址， 默认为  
`"vpath": "src/assets/version/config.json"`  

* 默认配置文件 `config.json` 为  
```
{  
    // 版本说明  
  "remark": ["新增模块", "功能添加", "bug修复"],
    // 环境配置
  "env": [
    {
        "env": "alpha",
        "name": "开发环境",
        "command": "npm run build:dev"
    },
    {
        "env": "beta",
        "name": "测试环境",
        "command": "npm run build:beta"
    },
    {
        "env": "release",
        "name": "生产环境",
        "command": "npm run build:pro"
    }
  ],
    // 版本文件输出地址  
  "output": "src/assets/version/"
}
``` 

* (4) 可在 配置文件 config.json 中 自定义 
`env, remark, output` 参数
