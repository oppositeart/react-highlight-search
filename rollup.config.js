import { env } from "process";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

import packageJson from "./package.json";

const devMode = env.NODE_ENV === "development";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",
                sourcemap: devMode,
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: devMode,
            },
        ],
        plugins: [
            peerDepsExternal(),
            nodeResolve(),
            commonjs(),
            typescript({
                tsconfig: "./tsconfig.json",
            }),
            terser({
                ecma: 2015,
                mangle: { toplevel: true },
                compress: {
                    module: true,
                    toplevel: true,
                    unsafe_arrows: true,
                    drop_console: !devMode,
                    drop_debugger: !devMode,
                },
            }),
            postcss({
                minimize: true,
            }),
        ],
        external: ["react", "react-dom"],
    },
    {
        input: "src/index.ts",
        output: [{ file: packageJson.types }],
        plugins: [dts.default()],
        external: [/\.css/],
    },
];
