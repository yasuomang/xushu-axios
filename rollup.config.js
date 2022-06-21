import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";
export default {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs.js",
    },
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].esm.js",
    },
    {
      dir: "dist",
      format: "umd",
      entryFileNames: "[name].umd.js",
      name: "bundleName",
    },
  ],
  external: [...Object.keys(pkg.peerDependencies)],
  plugins: [resolve(), commonjs(), typescript(), terser()],
};
