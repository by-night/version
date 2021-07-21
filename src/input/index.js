const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const program = require('commander');
const { package, init, rootPath } = require("../global")
const { writeVersion, runCommand } = require("../output");
const { RemarkEunm, envEnum, output } = init;

module.exports = () => {
    let newVList = [];
    let VContent = {};
    let scriptType = 'js';
    let showLast = false;
    const createTem = (env) => {
        return `{
    "name": "${package.name || ''}",
    "dev": "${env}",
    "lib": []
}`
    }

    const beforeInput = (envList) => {
        try {
            for (let info of envList) {
                const { env } = info;
                if (!env) continue;
                getVersion(env);
            }
        } catch (e) {
            console.log(e)
        }
    }

    // 返回版本信息
    const getVersion = (env) => {
        let _VList = [];
        const { list } = readVersion(env);
        if (!list) {
            _VList = new Array(3).fill(0).map((item, index) => {
                return {
                    sign: '1.0.0',
                    remark: RemarkEunm[index]
                }
            })
        } else {
            const _list = [[...list], [...list], [...list]];
            _VList = _list.map((item, index) => {
                item = item.map((child, CInd) => {
                    if (CInd > index) {
                        child = 0;
                    } else if (CInd === index) {
                        child = parseFloat(child) + 1;
                    }
                    return child;
                })

                return {
                    sign: item.join('.'),
                    remark: RemarkEunm[index]
                }
            })
        }

        if (newVList.length === 0) {
            newVList = _VList;
        } else {
            const cur = maxVersion(_VList).sign;
            const pre = maxVersion(newVList).sign;
            newVList = signToNum(cur) - signToNum(pre) >= 0 ? _VList : newVList;
        }
    }
    const maxVersion = (list) => {
        return list.sort((a, b) => signToNum(b.sign) - signToNum(a.sign))[0];
    }
    const signToNum = (sign) => {
        return parseFloat(sign.split('.').join(''));
    }
    // 读取版本日志
    const readVersion = (env) => {
        try {
            const url = output + `lib/${env}.json`;
            const template = createTem(env);
            createFile(url, template);

            const VPath = path.join(rootPath, url);
            const data = fs.readFileSync(VPath);
            let _data = JSON.parse(data.toString());
            // 储存每个环境当前版本信息
            VContent[env] = _data;
            const versionInfo = _data.lib.slice(-1)[0];
            if (!versionInfo) {
                return {};
            }
            return {
                data: _data,
                list: versionInfo.sign.split('.')
            };
        } catch (e) {
            console.log('读取文件失败：', e);
            return {};
        }
    }
    // 若地址不存在，则创建文件
    const createFile = (url, data = '') => {
        try {
            if (!url) return;
            const urlList = url.split('/');
            urlList.reduce((pre, cur, index) => {
                const parent = path.join(pre, cur);
                const curPath = path.join(rootPath, parent);
                const isExist = fs.existsSync(curPath);
                if (isExist) return parent;

                if (index === urlList.length - 1) {
                    fs.writeFileSync(curPath, data);
                } else {
                    fs.mkdirSync(curPath);
                }
                return parent;
            }, '')
        } catch (e) {
            throw new Error('文件写入失败：', e)
        }
    }
    const createTime = () => {
        const curTime = new Date();
        const year = curTime.getFullYear();
        const month = curTime.getMonth() + 1;
        const day = curTime.getDate();
        return year.toString().substring(2) +
            (month > 9 ? month : ('0' + month)) +
            (day > 9 ? day : '0' + day);
    }


    program
        .option('-t, --ts', 'download ts')
        .option('-l, --last', 'show only the last command')
        .action((name) => {
            const { ts, last } = name;
            ts && (scriptType = 'ts');
            showLast = !!last;
        })
        .parse(process.argv);
    inquirer.prompt([
        {
            type: 'checkbox',
            name: 'environment',
            message: '选择打包环境: ',
            choices: [
                ...envEnum.map((v, i) => {
                    if (i === 0) {
                        v.checked = true
                    }
                    return v;
                }),
                new inquirer.Separator(" "),
                new inquirer.Separator("----- 按【空格】选择环境，【回车】确定 -----"),
            ],
            filter: (val) => {
                if (val.length === 0) return [envEnum[0]];
                return envEnum.filter(envInfo => {
                    return val.includes(envInfo.name)
                });
            },
            validate: (val) => {
                if (!val || (val.length === 0)) {
                    return '请按【空格】选择环境，【回车】确定';
                }
                return true;
            }
        }, {
            type: "list",
            name: "version",
            message: "版本号：",
            choices: () => {
                return newVList.reverse().map(({ sign, remark }) => `V${sign}: ${remark}`)
            },
            when: ({ environment }) => {
                beforeInput(environment)
                return true;
            }
        }, {
            type: 'input',
            name: 'description',
            message: '版本说明：',
        }
    ]).then(answer => {
        const { environment, version, description } = answer;
        const sign = version.match(/V(\S*): /)[1];
        const time = createTime();

        environment.forEach((item, index) => {
            const { env } = item;
            const data = VContent[env];
            data.lib.push({
                sign,
                version: `${sign}.${time}_${env}`,
                description
            });
            writeVersion(data, env, output, scriptType);
            runCommand(env, !(showLast && (index !== environment.length - 1)));
        })
    });
}




