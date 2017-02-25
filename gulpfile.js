var gulp = require('gulp');
var uglify = require('gulp-uglify');
// var concat = require('gulp-concat');
// var copy = require('gulp-copy');
var useref = require('gulp-useref');
var replace = require('gulp-replace');
// var fs = require('fs');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-clean-css');
// var path = require("path");

var buildDir = './build';

gulp.task('copy-index', function () {
    return gulp.src(['./index.html'])
        .pipe(gulp.dest(buildDir));
});

gulp.task('copy-app', function () {
    return gulp.src(['./dist/app-builded.js'])
        .pipe(gulp.dest(buildDir));
});

gulp.task('useref', ['copy-index', 'copy-app'], function () {
    return gulp.src(buildDir + '/index.html')
        .pipe(useref({
            searchPath: './'
        }))
        .pipe(gulpif('*.js', uglify({
            preserveComments: false
        })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build', ['useref'], function () {
    return gulp.src(buildDir + '/index.html')
        .pipe(replace('<script src="bundle.js"></script>', '<script src="bundle.js"></script><script src="app-builded.js"></script>'))
        .pipe(gulp.dest(buildDir));
});