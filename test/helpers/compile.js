import * as path from "path";
import * as url from "url";
import webpack from "webpack";

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default function compile(loaderPipeline) {
    return new Promise((resolve, reject) => {
        webpack({
            mode: "none",
            entry: path.resolve(dirname, "../fixtures/entry.js"),
            output: {
                path: path.resolve(dirname, "..", "output"),
                filename: "bundle", // omitting js because we don't want to trigger ava in watch mode
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: loaderPipeline,
                    },
                ],
            },
        }, (error, stats) => {
            const problem = error || stats.compilation.errors[0] || stats.compilation.warnings[0];

            if (problem) {
                const error = problem.message ?
                    problem :
                    new Error(typeof problem === "string" ? problem : "Unexpected error");

                error.originalError = error;
                error.stats = stats;

                reject(error);

                return;
            }

            resolve(stats);
        });
    });
}
