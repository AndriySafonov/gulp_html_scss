const gulp = require("gulp");

gulp.task("hello", function (done) {
  console.log("Hello Gulp");
  done();
});

gulp.task("default", gulp.series("hello"));
