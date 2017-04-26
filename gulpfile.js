const config  = require("./config.js")
const gulp    = require("gulp");
const tslint  = require("gulp-tslint");
const webpack = require("webpack");

gulp.task("tslint", () => {
  return gulp
    .src(["./src/**/*.ts", "!./src/**/*.d.ts"])
    .pipe(tslint())
    .pipe(tslint.report({
      summarizeFailureOutput: true
    }));
});

gulp.task("release", (callback) => {  
  return webpack(config.webpack_release, (error, stats) => {
    if (error) {
      console.error(error);
    }
    callback();
  });
});

gulp.task("external", (callback) => {  
  return webpack(config.webpack_external, (error, stats) => {
    if (error) {
      console.error(error);
    }
    callback();
  });
});

gulp.task("develop", (callback) => {  
  return webpack(config.webpack_develop, (error, stats) => {
    if (error) {
      console.error(error);
    }
    callback();
  });
});

gulp.task("build", ["tslint", "release", "external", "develop"]);