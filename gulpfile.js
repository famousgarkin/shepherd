var gulp = require('gulp')
var jshint = require('gulp-jshint')

gulp.task('default', ['lint'])

gulp.task('lint', function() {
    gulp.src([
        './**/*.js',
        '!./bower_components/**/*',
        '!./node_modules/**/*'
    ])
    .pipe(jshint({
        "asi": true
    }))
    .pipe(jshint.reporter('default'))
})
