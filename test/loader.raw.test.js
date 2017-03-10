import test from "ava";
import compile from "./helpers/compile";
import rawInspectLoader from "../raw";
import inspectLoader from "../lib/loader";

test("should work the same as the inspect-loader just for buffers", t => {
    let inspect;
    const options = {
        callback(i) {
            inspect = i;
        }
    };

    t.plan(1);

    return compile([{
        loader: require.resolve("../raw"),
        options
    }])
        .then(() => {
            t.true(inspect.arguments[0] instanceof Buffer);
        });
});

test("should also expose the same callbacks object", t => {
    t.is(inspectLoader.callbacks, rawInspectLoader.callbacks);
});
