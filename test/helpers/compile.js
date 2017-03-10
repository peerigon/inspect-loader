import { resolve } from "path";
import webpack from "webpack";

export default function compile(loaderOptions) {
    return new Promise((res, rej) => {
        webpack({
            entry: require.resolve("../fixtures/entry.js"),
            output: {
                path: resolve(__dirname, "..", "output"),
                filename: "bundle" // omitting js because we don't want to trigger ava in watch mode
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            {
                                loader: require.resolve("../../lib/loader.js"),
                                options: loaderOptions
                            }
                        ]
                    }
                ]
            }
        }, (err, stats) => {
            const problem = err || stats.compilation.errors[0] || stats.compilation.warnings[0];

            if (problem) {
                const error = problem.message ?
                    problem :
                    new Error(typeof problem === "string" ? problem : "Unexpected error");

                error.originalError = err;
                error.stats = stats;

                rej(error);

                return;
            }

            res(stats);
        });
    });
}
