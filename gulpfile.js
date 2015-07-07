var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver');

var coffeeSources = [
  'components/coffee/*.coffee'
];

var sassSources = [
  'components/sass/*.scss'
];

var htmlSources = ['*.html', 'views/*.html'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true})
      .on('error', gutil.log))
    .pipe(gulp.dest('js'))
});

gulp.task('sass', function() {
  sass('components/sass/main.scss', {
    style: 'expanded', 
    lineNumbers: true
  }).on('error', gutil.log)
    .pipe(concat('style.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('html', function() {
  gulp.src(htmlSources)
});

gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(htmlSources, ['html']);
});

gulp.task('webserver', function() {
  gulp.src('')
    .pipe(webserver({
      livereload: true,
      open: true,
      fallback: 'index.html'
    }));
});

gulp.task('default', ['watch', 'html', 'coffee', 'sass', 'webserver']);
