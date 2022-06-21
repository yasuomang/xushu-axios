import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
export default {
  input: "src/index.ts",
  plugins: [resolve(), typescript(), commonjs(), terser()],
  external: ["axios", "js-cookie"],
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
};
