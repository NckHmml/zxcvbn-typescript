const config    = require("./config.js")
const dts       = require("dts-bundle").bundle;
const gulp      = require("gulp");
const replace   = require("gulp-replace");
const tslint    = require("gulp-tslint");
const ts        = require("gulp-typescript");
const webpack   = require("webpack");

const source    = "./src/**/*.ts";
const tsProject = ts.createProject("tsconfig.json", {
  declaration   : true,
});

gulp.task("tslint", () => {
  return gulp
    .src(source)
    .pipe(tslint())
    .pipe(tslint.report({
      summarizeFailureOutput: true
    }));
});

gulp.task("debug", () => {
  gulp.watch(source, ["tslint"]);

  return webpack(config.webpack_debug, (error, stats) => {
    if (error) {
      console.error(error);
    }
  });
})

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

gulp.task("types", () => {
  const result = gulp
    .src(source)
    .pipe(tsProject());

  return result.dts
    .pipe(replace(/~\//g, config.filename + "/"))
    .pipe(gulp.dest("./dist"))
    .on("end", () => {
      dts({
        baseDir: "./dist",
        name: config.filename,
        main: "./dist/index.d.ts",
        removeSource: true
      });
    });
})

gulp.task("build", ["tslint", "release", "external", "develop", "types"]);