/// <vs SolutionOpened='default' />
// http://andy-carter.com/blog/a-beginners-guide-to-the-task-runner-gulp
// http://www.smashingmagazine.com/2014/06/11/building-with-gulp/

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch');

gulp.task('copy_m3', function () {
    gulp.src('../m3/public/dist/m3.*')
        .pipe(plumber())
        .pipe(gulp.dest('m3'));
});


gulp.task('watch', function () {
    gulp.watch('../m3/public/dist/m3.*', ['copy_m3']);
});

gulp.task('default', ['copy_m3', 'watch']);