var path = require("path");

function resolve (dir)
{
  return path.join(__dirname, "./", dir);
}

module.exports = {
  lintOnSave: true,
  chainWebpack: config =>
  {
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();

    config.plugin("define").tap(args =>
    {
      const v = JSON.stringify(require("./package.json").version);
      args[0]["process.env"].VERSION = v;
      return args;
    });

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
  }
};
