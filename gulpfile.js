//plug-in
var gulp = require("gulp");
var browserify = require("browserify");
var browserSync = require("browser-sync").create();
var source = require("vinyl-source-stream");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var sassGlob = require("gulp-sass-glob");
var notify = require("gulp-notify");
var autoprefixer = require("gulp-autoprefixer");
// Dart Sass使用
sass.compiler = require("sass");

// sassコンパイル
gulp.task("sass", function () {
  gulp
    .src("./src/scss/**/*.scss")
    // plumber
    .pipe(plumber(notify.onError("Error: <%= error.message %>")))
    // glob有効
    .pipe(sassGlob())
    // コンパイル処理
    .pipe(sass())
    //ベンダープレフィックス付与
    .pipe(autoprefixer())
    // 書き出し
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("build", function () {
  browserify({
    entries: ["src/js/app.js"], // ビルド元のファイルを指定
  })
    .bundle()
    .pipe(source("bundle.js")) // 出力ファイル名を指定
    .pipe(gulp.dest("dist/js")); // 出力ディレクトリを指定
});
gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "./", // 対象ディレクトリ
      index: "index.html", //indexファイル名
    },
  });
});
gulp.task("bs-reload", function () {
  browserSync.reload();
});

// Gulpを使ったファイルの監視
gulp.task("default", ["build", "browser-sync"], function () {
  gulp.watch("./src/*.js", ["build"]);
  gulp.watch("./*.html", ["bs-reload"]);
  gulp.watch("./dist/*.+(js|css)", ["bs-reload"]);
});
