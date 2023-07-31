const fs = require('fs');
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const goroupMedia = require('gulp-group-css-media-queries');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs')) {
        return gulp.src('./docs', { read: false }).pipe(clean({ force: true }));
    }
    done();
});

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file',
};

const plumberNotify = tytle => {
    erroeHandler: notify.onError({
        title: tytle,
        message: 'Error <%= error message %>',
        sound: false,
    });
};

gulp.task('html:docs', function () {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSettings))
        .pipe(gulp.dest('./docs'));
});

gulp.task('sass:docs', function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(goroupMedia())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images:docs', function () {
    return gulp
        .src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(imagemin({ verbose: true }))
        .pipe(gulp.dest('./docs/img/'));
});

gulp.task('fonts:docs', function () {
    return gulp
        .src('./src/fonts/**/*')
        .pipe(changed('./docs/fonts/'))
        .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function () {
    return gulp
        .src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'));
});

gulp.task('js:docs', function () {
    return gulp
        .src('./src/js/*.js')
        .pipe(changed('./docs/js'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('../webpack.config')))
        .pipe(gulp.dest('./docs/js'));
});

const serverOptions = {
    livereload: true,
    open: true,
};

gulp.task('server:docs', function () {
    return gulp.src('./docs/').pipe(server(serverOptions));
});

gulp.task('watch:docs', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:docs'));
    gulp.watch('./src/**/*', gulp.parallel('images:docs'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:docs'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:docs'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'));
});
