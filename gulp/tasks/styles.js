import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import del from 'del';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import postCss from 'gulp-postcss';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import stylelint from 'gulp-stylelint';
import wait from 'gulp-wait';

import config from '../config';

export const lintStyles = () =>
  gulp
    .src(config.paths.styles.lint, { since: gulp.lastRun(lintStyles) })
    .pipe(stylelint(config.plugins.stylelint));

export const buildStyles = () =>
  gulp
    .src(config.paths.styles.src)
    .pipe(plumber())
    .pipe(wait(500)) // Error Workaround
    .pipe(sourcemaps.init())
    .pipe(sass.sync(config.plugins.sass))
    .pipe(
      postCss(config.run.cssnano ? [autoprefixer, cssnano] : [autoprefixer])
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.styles.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );

export const styles = gulp.series(lintStyles, buildStyles);

export const watchStyles = () =>
  gulp.watch(config.paths.styles.watch, gulp.series(styles));

export const cleanStyles = () => del(config.paths.styles.clean);
