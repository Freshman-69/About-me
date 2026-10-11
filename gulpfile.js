'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const fileInclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const { deleteSync } = require('del');

const paths = {
  html: 'src/*.html',
  templates: 'src/templates/**/*.html',
  scss: 'src/scss/style.scss',
  javascript: 'src/js/**/*.js',
  assets: 'src/assets/**/*',
  output: 'dist',
};

/** Remove the generated output before a clean build. */
function clean() {
  deleteSync([paths.output]);
  return Promise.resolve();
}

/** Expand reusable HTML templates into regular HTML files. */
function html() {
  return gulp
    .src(paths.html)
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    .pipe(gulp.dest(paths.output));
}

/** Compile readable SCSS with source maps for local development. */
function stylesDev() {
  // Log Sass errors with the actual file and line instead of a generic
  // Gulp message. The handler lets the watch process stay alive so you can
  // fix the SCSS and save again without restarting the development server.
  const compiler = sass({ style: 'expanded' });
  compiler.on('error', sass.logError);

  return gulp
    .src(paths.scss, { sourcemaps: true })
    .pipe(compiler)
    .pipe(autoprefixer())
    .pipe(gulp.dest(`${paths.output}/css`, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

/** Compile and minify CSS for the production output. */
function stylesBuild() {
  return gulp
    .src(paths.scss)
    .pipe(sass({ style: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(`${paths.output}/css`));
}

/** Copy project JavaScript as-is; no unsafe text replacement or legacy minifier. */
function scripts() {
  return gulp.src(paths.javascript, { allowEmpty: true }).pipe(gulp.dest(`${paths.output}/js`));
}

/** Copy images, icons, fonts and other static assets without text encoding. */
function assets() {
  return gulp
    .src(paths.assets, { base: 'src/assets', encoding: false, allowEmpty: true })
    .pipe(gulp.dest(`${paths.output}/assets`));
}

const build = gulp.series(clean, html, stylesBuild, scripts, assets);
const develop = gulp.series(clean, gulp.parallel(html, stylesDev, scripts, assets), serve);

/** Start BrowserSync and rebuild only the changed part of the site. */
function serve() {
  browserSync.init({
    server: { baseDir: paths.output },
    port: 3000,
    open: true,
    notify: false,
  });

  gulp.watch(paths.html, gulp.series(html, browserSync.reload));
  gulp.watch(paths.templates, gulp.series(html, browserSync.reload));
  gulp.watch('src/scss/**/*.scss', stylesDev);
  gulp.watch(paths.javascript, gulp.series(scripts, browserSync.reload));
  gulp.watch(paths.assets, gulp.series(assets, browserSync.reload));
}

exports.clean = clean;
exports.build = build;
exports.default = develop;
