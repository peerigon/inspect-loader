const loaderUtils = require("loader-utils");

function defaultLogger(inspect) {
    // Using console.error as default as we want to print to stderr
    console.error(inspect.arguments);
}

function getInspectCallback(callback = defaultLogger) {
    const type = typeof callback;

    switch (type) {
        case "function":
            return callback;
        case "string": {
            const callbackName = callback;

            callback = inspectLoader.callbacks[callbackName];
            if (typeof callback !== "function") {
                throw new TypeError(
                    `Expected the registered callback "${callbackName}" to be typeof "function", instead of "${typeof callback}".`
                );
            }

            return callback;
        }
        default:
            throw new TypeError(
                `Unexpected callback type. Expected "string" or "function", but saw "${type}".`
            );
    }
}

function inspectLoader(...args) {
    // eslint-disable-next-line @babel/no-invalid-this
    const context = this;
    const options = loaderUtils.getOptions(context) || {};
    const inspectCallback = getInspectCallback(options.callback);

    inspectCallback({
        arguments: args,
        context,
        options,
    });

    // Just pass the all the arguments to the next loader because we want this loader to be as unobtrusive as possible
    context.callback(null, ...args);
}

inspectLoader.callbacks = Object.create(null);

module.exports = inspectLoader;
