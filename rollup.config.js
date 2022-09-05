import { readdirSync, statSync } from "fs";
import { resolve, extname } from "path";
import { builtinModules } from "module";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";

const plugins = () => [
  json(),
  typescript({
    tsconfig: "./tsconfig.json",
  }),
  commonjs(),
  nodeResolve({
    preferBuiltins: true,
  }),
  terser(),
];

const external = [
  ...builtinModules
];

let dPathLength = (resolve() + "/").length;
let srcPath = resolve("src");

const flies = file(srcPath).map((e) =>
  e.substring(dPathLength + 4, e.length - 3)
);

function file(path) {
  let files = [];
  let dirArray = readdirSync(path);
  for (let d of dirArray) {
    let filePath = resolve(path, d);
    let stat = statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(file(filePath));
    }
    if (stat.isFile() && extname(filePath) === ".ts") {
      files.push(filePath);
    }
  }
  return files;
}
let config = [];
flies.forEach((path) => {
  config.push({
    input: `./src/${path}.ts`,
    output: [
      {
        file: `./dist/${path}.js`,
        exports: "auto",
        format: "commonjs",
        sourcemap: false,
      },
      {
        file: `./dist/${path}.mjs`,
        format: "esm",
        sourcemap: false,
      },
    ],
    external,
    plugins: plugins(),
  });
});
export default config