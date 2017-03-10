"use strict";

const inspectLoader = require("./loader");

function rawInspectLoader() {
    return inspectLoader.apply(this, arguments); // eslint-disable-line no-invalid-this
}

Object.assign(rawInspectLoader, {
    raw: true
}, inspectLoader);

module.exports = rawInspectLoader;
