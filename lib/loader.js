"use strict";

const loaderUtils = require("loader-utils");

function getInspectCallback(callback) {
    const type = typeof callback;

    switch (type) {
        case "function":
            return callback;
        case "string": {
            const callbackName = callback;

            callback = inspectLoader.callbacks[callbackName];
            if (typeof callback !== "function") {
                throw new TypeError(`Expected the registered callback "${ callbackName }" to be typeof "function", instead of "${ typeof callback }".`);
            }
            return callback;
        }
        default:
            throw new TypeError(`Unexpected callback type. Expected "string" or "function", but saw "${ type }".`);
    }
}

function inspectLoader() {
    const context = this; // eslint-disable-line no-invalid-this
    const options = loaderUtils.getOptions(context) || {};
    const inspectCallback = getInspectCallback(options.callback);
    const args = Array.from(arguments);

    inspectCallback({
        arguments: args,
        context,
        options
    });

    // Just pass the all the arguments to the next loader because we want this loader to be as unobtrusive as possible
    context.callback.apply(context, [null].concat(args));
}

inspectLoader.callbacks = Object.create(null);

module.exports = inspectLoader;
