const fs = require("fs");
const path = require("path");
const { RemarkEunm, envEnum, VPATH, OUT_PATH } = require('./config');

// const rootPath = path.join(__dirname, './');
const rootPath = process.cwd();

// 读取包名
const readPackage = () => {
    try {
        const url = path.join(rootPath, 'package.json');
        const data = fs.readFileSync(url);
        const _data = JSON.parse(data.toString());
        return _data;
    } catch (e) {
        return {};
    }
}
// 获取配置项
const getConfig = () => {
    try {
        const configUrl = path.join(rootPath, package.vpath || VPATH);
        if (fs.existsSync(configUrl)) {
            const data = fs.readFileSync(configUrl);
            const { remark = RemarkEunm, env = envEnum, output = OUT_PATH } = JSON.parse(data.toString());
            return {
                output,
                envEnum: env,
                RemarkEunm: remark,
            }
        }
    } catch (e) {

    }
    return { RemarkEunm, envEnum, output: OUT_PATH}
}

// 立即执行
const package = readPackage();
const init = getConfig();

module.exports = {
    init,
    package,
    rootPath,
}