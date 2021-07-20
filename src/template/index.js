const env = process.env.REACT_APP_VERSION;

const req = require;
const context = req.context('./lib', false);
const modules = context(`./${env}.json`);


const lib = modules.lib;
const VInfo = lib.pop() || {
    version: '',
    number: '',
    description: ''
};
export default VInfo;

