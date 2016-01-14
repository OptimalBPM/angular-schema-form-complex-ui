/* global require */

var gulp = require('gulp');

var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-minify-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');
var jscs = require('gulp-jscs');
var tsc = require('gulp-tsc');

gulp.task('build', function () {
    var stream = streamqueue({objectMode: true});
    stream.queue(
        gulp.src('./src/*.html')
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(templateCache({
                module: 'schemaForm',
                root: 'directives/decorators/bootstrap/complex-ui/'
            }))
    );

    stream.queue(
        gulp.src(['src/**/*.ts'])
            .pipe(tsc())
    );


    stream.done()
        .pipe(concat('angular-schema-form-complex-ui.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('minify', function () {
    var stream = streamqueue({objectMode: true});
    stream.queue(gulp.src('angular-schema-form-complex-ui.js'));
    stream.done()
        .pipe(uglify())
        .pipe(concat('angular-schema-form-complex-ui.min.js'))
        .pipe(gulp.dest('.'))
});

gulp.task('default', [
    'build',
    'minify'
]);

gulp.task('watch', function () {
    gulp.watch('./src/**/*', ['default']);
});
