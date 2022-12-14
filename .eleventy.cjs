const { join } = require("path");
const fg = require("fast-glob");
const htmlmin = require("html-minifier-terser");
const esbuild = require("esbuild");
const litPlugin = require("@lit-labs/eleventy-plugin-lit");

module.exports = (config) => {
  config.addWatchTarget("./src/lib/**/*.js");
  config.addWatchTarget('./src/lib');
  // HTML

  config.addTransform("html-minify", (content, path) => {
    if (path && path.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        includeAutoGeneratedTags: false,
        removeComments: true,
        sortAttributes: true,
        sortClassName: true,
      });
    }

    return content;
  });


  config.addTemplateFormats("css");
  // const styles = ["./src/site/styles/index.css"];
  // const postcssPlugins = [
  //   pimport,
  //   autoprefixer,
  //   csso,
  //   minmax,
  //   postcssHasPseudo,
  //   postcssCustomMedia,
  //   ptheme({
  //     darkSelector: '[data-theme="dark"]',
  //     lightSelector: '[data-theme="light"]',
  //   }),
  // ];

  // config.addExtension("css", {
  //   outputFileExtension: "css",
  //   compile: async (inputContent, inputPath) => {
  //     if (!styles.includes(inputPath)) {
  //       return;
  //     }

  //     return async () => {
  //       let output = await postcss(postcssPlugins).process(inputContent, {
  //         from: inputPath,
  //       });

  //       return output.css;
  //     };
  //   },
  // });

  // config.addNunjucksAsyncFilter("css", (path, callback) => {
  //   fs.readFile(path, "utf8", (error, content) => {
  //     console.log(content);
  //     postcss(postcssPlugins)
  //       .process(content, {
  //         from: path,
  //       })
  //       .then((output) => {
  //         callback(null, output.css);
  //       });
  //   });
  // });

  // JavaScript

  config.addTemplateFormats("js");

  const paths = ["./src/site/scripts/index.js", "./src/site/scripts/ssr.js"]
  config.addExtension("js", {
    outputFileExtension: "js",
    compile: async (content, path) => {
      if (!paths.includes(path)) {
        return;
      }

      return async () => {
        return esbuild.buildSync({
          entryPoints: [path],
          minify: true,
          bundle: true,
          write: false,
        }).outputFiles[0].text;
      };
    },
  });

  // Web components
  const componentsDir = "./src/lib/components/**/index.js";
  const entries = fg.sync(join(componentsDir));

  console.log({
    ['web-components']: entries
  })

  config.addPlugin(litPlugin, {
    mode: "worker",
    componentModules: entries,
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk"],
  };
};
