const fs = require("fs");
const path = require("path");
const execa = require('execa');
const {rootPath, init} = require("../global");
const { envEnum } = init;

// 写入新版本
const writeVersion = (data, env, output, scriptType) => {
    try {
        const VPath = path.join(rootPath, output + `lib/${env}.json`);
        let str = JSON.stringify(data, null, 4);
        // 写入文件
        fs.writeFileSync(VPath, str);

        // 写入版本输出文件
        const rootFile = path.join(rootPath, output + (scriptType === 'ts' ? 'index.ts' : 'index.js'));
        if (!fs.existsSync(rootFile)) {
            const temPath = scriptType === 'ts' ? 'template/index.ts' : 'template/index.js';
            fs.createReadStream(path.join(path.join(__dirname, '../'), temPath))
            .pipe(fs.createWriteStream(path.join(rootFile)));
        }
    } catch (e) {
        console.log('写入失败：', e)
    }
}

// 执行打包命令
const runCommand = (env) => {
    const envInfo = envEnum.find(item => item.env === env);
    if (!envInfo) return;
    try {
        let {command} = envInfo;
        if (!command) return;
        execa(command, {
            cwd: rootPath,
            stdio: [2, 2, 2]
        });
    } catch (e) {
        console.log(`${envInfo.name}打包失败，原因是：`, e);
    }
}
module.exports = {
    writeVersion,
    runCommand
}