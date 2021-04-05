import * as path from "path";
import * as url from "url";
import test from "ava";
import compile from "./helpers/compile.js";
import rawInspectLoader from "../raw.cjs";
import inspectLoader from "../lib/loader.cjs";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

test("should work the same as the inspect-loader just for buffers", t => {
    let inspect;
    const options = {
        callback(i) {
            inspect = i;
        },
    };

    t.plan(1);

    return compile([
        {
            loader: path.resolve(dirname, "../raw.cjs"),
            options,
        },
    ])
        .then(() => {
            t.true(inspect.arguments[0] instanceof Buffer);
        });
});

test("should also expose the same callbacks object", t => {
    t.is(inspectLoader.callbacks, rawInspectLoader.callbacks);
});
