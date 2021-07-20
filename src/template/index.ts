const env = process.env.REACT_APP_VERSION;

const req: any = require;
const context = req.context('./lib', false);
const modules = context(`./${env}.json`);

interface VInfo {
    version: string,
    number: string,
    description: string
}

const lib: VInfo[] = modules.lib;
const VInfo: VInfo = lib.pop() || {
    version: '',
    number: '',
    description: ''
};
export default VInfo;

