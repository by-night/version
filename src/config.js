const VPATH = 'src/assets/version/config.json';
const OUT_PATH = 'src/assets/version/';


const RemarkEunm = ["新增模块", "功能添加", "bug修复"];
const envEnum = [
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
]

module.exports = {
    VPATH,
    OUT_PATH,
    envEnum,
    RemarkEunm
}