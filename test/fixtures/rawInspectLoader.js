const inspectLoader = require("../../lib/loader");

function rawInspectLoader() {
    return inspectLoader.apply(this, arguments); // eslint-disable-line no-invalid-this
}

rawInspectLoader.raw = true;

module.exports = rawInspectLoader;
