import { resolve } from "path";
import { readFileSync } from "fs";
import test from "ava";
import webpack from "webpack";
import inspectLoader from "../lib/loader";
import compile from "./helpers/compile";

const entryContent = readFileSync(require.resolve("./fixtures/entry.js"), "utf8");

/**
 * Applies dummy properties that must be defined on the context.
 *
 * @param {Object} context
 * @returns {Object}
 */
function mockContext(context) {
    context.callback = context.callback || Function.prototype;

    return context;
}

test("should call the query callback synchronously", t => {
    let called = false;
    const context = mockContext({
        query: {
            callback() {
                called = true;
            }
        }
    });

    inspectLoader.call(context);

    t.true(called);
});

test("should call the loaderContext callback with the expected context and arguments", t => {
    const args = [1, 2, 3, 4, 5, 6];
    const context = mockContext({
        query: {
            callback() {}
        }
    });

    context.callback = function () {
        const actualArgs = Array.from(arguments);

        t.is(this, context);
        t.is(actualArgs[0], null);
        t.deepEqual(args, actualArgs.slice(1));
    };

    t.plan(3);

    inspectLoader.apply(context, args);
});

test("should callback the query callback with inspectable arguments", t => {
    const args = [1, 2, 3, 4, 5, 6];
    const options = {
        callback(inspect) {
            t.deepEqual(inspect.arguments, args);
            t.is(inspect.context, context);
            t.is(inspect.options, options);
        }
    };
    const context = mockContext({
        query: options
    });

    t.plan(3);

    inspectLoader.apply(context, args);
});

test("should also support string refs to previously registered callbacks", t => {
    const stringRef = "testCallback";
    const args = [1, 2, 3, 4, 5, 6];
    const options = {
        callback: stringRef
    };
    const context = mockContext({
        query: options
    });

    t.plan(3);

    inspectLoader.callbacks[stringRef] = (inspect) => {
        t.deepEqual(inspect.arguments, args);
        t.is(inspect.context, context);
        t.is(inspect.options, options);
    };

    inspectLoader.apply(context, args);
});

test("should throw a TypeError if there was no callback registered", t => {
    const context = mockContext({});

    const err = t.throws(() => {
        inspectLoader.apply(context);
    });

    t.true(err instanceof TypeError);
    t.is(err.message, 'Unexpected callback type. Expected "string" or "function", but saw "undefined".');
});

test("should throw a descriptive TypeError if an unknown callback string ref was given", t => {
    const stringRef = "notRegistered";
    const context = mockContext({
        query: {
            callback: "notRegistered"
        }
    });

    const err = t.throws(() => {
        inspectLoader.apply(context);
    });

    t.true(err instanceof TypeError);
    t.is(err.message, `Expected the registered callback "${ stringRef }" to be typeof "function", instead of "undefined".`);
});

test("should also work with webpack's loader context", t => {
    const options = {
        callback(i) {
            inspect = i;
        }
    };
    let inspect;

    t.plan(5);

    return compile(options)
        .then(() => {
            t.truthy(inspect.arguments);
            t.deepEqual(inspect.arguments, [entryContent]);

            t.truthy(inspect.context);
            t.truthy(inspect.context.resourcePath);

            t.is(inspect.options, options);
        });
});
