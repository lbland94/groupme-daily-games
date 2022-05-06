const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/scss/_globalIncludes.scss";
        `,
        sassOptions: {
          includePaths: ['./node_modules'],
        },
      },
    },
  },
  transpileDependencies: true,
});
