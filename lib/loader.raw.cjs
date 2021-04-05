
const inspectLoader = require("./loader.cjs");

function rawInspectLoader(...args) {
    // eslint-disable-next-line @babel/no-invalid-this
    return inspectLoader.apply(this, args);
}

Object.assign(rawInspectLoader, {
    raw: true,
}, inspectLoader);

module.exports = rawInspectLoader;
