var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var gulpIf = require("gulp-if");
var autoprefixer = require("gulp-autoprefixer");
var cssnano = require("gulp-cssnano");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache");
var del = require("del");
var babel = require("gulp-babel");
var runSequence = require("gulp4-run-sequence");

// Development Tasks
// -----------------

// Start browserSync server
gulp.task("browserSync", function() {
  browserSync.init({
    notify: false,
    open: false,
    injectChanges: false,
    server: {
      baseDir: "public"
    }
  });
});

// Parse and compress js
gulp.task("js", function() {
  return gulp
    .src("src/js/**/*.js")
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("public/js"));
});

// Parse and compress scss
gulp.task("sass", function() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({stream: true}));
});

// Watchers
gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("src/js/**/*.js", gulp.parallel("js"));
  gulp.watch(["src/*.html", "src/css/*"], gulp.parallel("useref"));
  gulp.watch(["public/**/*"]).on("change", browserSync.reload);
});

// Optimization Tasks
// ------------------

// Optimizing CSS and JavaScript
gulp.task("useref", function() {
  return gulp
    .src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("public"));
});

// Optimizing Images
gulp.task("images", function() {
  return (
    gulp
      .src("src/images/**/*.+(png|jpg|jpeg|svg)")
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin(
            [
              imagemin.mozjpeg({quality: 90, progressive: true}),
              imagemin.optipng({optimizationLevel: 5}),
              imagemin.svgo({
                plugins: [{removeViewBox: true}, {cleanupIDs: false}]
              })
            ],
            {
              verbose: true
            }
          )
        )
      )
      .pipe(gulp.dest("public/images"))
  );
});

// Copying files
gulp.task("copy", function() {
  return gulp.src("src/*.+(xml|json|ico)").pipe(gulp.dest("public"));
});

// Copying gifs
gulp.task("gifs", function() {
  return gulp.src("src/images/gif/*.gif").pipe(gulp.dest("public/images/gif"));
});

// Cleaning
gulp.task("clean", function() {
  return del("public").then(function(cb) {
    return cache.clearAll(cb);
  });
});
gulp.task("clean:public", function() {
  return del(["public/**/*", "!public/images", "!public/images/**/*"]);
});

// Build Sequences
// ---------------

gulp.task(
  "default",
  gulp.parallel([gulp.series(["sass", "js", "watch"]), gulp.series(["browserSync"])])
);

gulp.task("build", async function(callback) {
  runSequence("clean:public", "copy", "sass", "js", "useref", "images", "gifs", callback);
});
