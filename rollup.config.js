const { readdirSync, statSync } = require("fs")
const { resolve, extname } = require("path")
const { builtinModules } = require("module")
const terser = require("@rollup/plugin-terser")
const commonjs = require("@rollup/plugin-commonjs")
const nodeResolve = require("@rollup/plugin-node-resolve")
const json = require("@rollup/plugin-json")
const typescript = require("rollup-plugin-swc3").default
const dts = require("rollup-plugin-dts").default

const plugins = () => [
  json(),
  typescript({
    tsconfig: "./tsconfig.json",
    
  }),
  commonjs(),
  nodeResolve({
    preferBuiltins: true,
  }),
  terser()
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
    output: [{ file: `./dist/${path}.d.ts`, format: "es" }],
    plugins: [dts()],
  })
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
      }
    ],
    external,
    plugins: plugins(),
  });
});

exports.default = config