const { join } = require("path");
const fg = require("fast-glob");

// A Rollup plugin to minify generated ES bundles. Uses terser under the hood.
const { terser } = require("rollup-plugin-terser");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const del = require("rollup-plugin-delete");
const brotli = require("rollup-plugin-brotli");

const commonjs = require("@rollup/plugin-commonjs");

const pagesDir = "./src/lib/pages/**.js";


const ssrDir = "./src/lib/ssr/**.js";
const pages = fg.sync([join(pagesDir), join(ssrDir)], {
  onlyFiles: true,
  ignore: [],
  unique: true,
});

console.log(pages)


const plugins = [nodeResolve(), commonjs()];

const devConfig = {
  input: ["./src/lib/app.js", ...pages],
  output: {
    dir: "dist/js",
    format: "esm",
  },
  watch: {
    // By default rollup clears the console on every build. This disables that.
    clearScreen: false,
  },
  plugins: [...plugins, del({ targets: "dist/js" })],
};

const productionConfig = {
  input: ["./src/lib/app.js", ...pages],
  output: {
    dir: "dist/js",
    format: "esm",
  },
  plugins: [
    ...plugins,
    brotli(),
    terser({
      format: {
        // Remove all comments, including @license comments,
        // otherwise LHCI complains at us.
        comments: false,
      },
    }),
  ],
};

export default () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return productionConfig;
    default:
      return devConfig;
  }
};
