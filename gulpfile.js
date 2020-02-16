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
var webp = require("gulp-webp");
var imageResize = require("gulp-image-resize");

// Development Tasks
// -----------------

// Watchers
gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("src/js/**/*.js", gulp.parallel("js"));
  gulp.watch(["src/*.html", "src/css/*"], gulp.parallel("useref"));
  gulp.watch(["dist/**/*"]).on("change", browserSync.reload);
});

//  Start browserSync server
gulp.task("browserSync", function() {
  browserSync.init({
    notify: false,
    open: false,
    injectChanges: false,
    server: {
      baseDir: "dist"
    }
  });
});

//  Parse and compress js
gulp.task("js", function() {
  return gulp
    .src("src/js/**/*.js")
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

//  Parse and compress scss
gulp.task("sass", function() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass({outputStyle: "compressed"}).on("error", sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({stream: true}));
});

//  Copy other files
gulp.task("copy", function() {
  return gulp.src("src/*.+(xml|json|ico)").pipe(gulp.dest("dist"));
});

//  Copy gifs (imagemin not working with restaurant gif)
gulp.task("gifs", function() {
  return gulp.src("src/images/gif/*.gif").pipe(gulp.dest("dist/images/gif"));
});

// Optimization Tasks
// ------------------

// Combine CSS || JS files into one
gulp.task("useref", function() {
  return gulp
    .src("src/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"));
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
              imagemin.mozjpeg({quality: 75, progressive: true}),
              imagemin.optipng({optimizationLevel: 4}),
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
      .pipe(gulp.dest("dist/images"))
  );
});

//  Crop images
gulp.task("crop", function() {
  return gulp
    .src("dist/images/*.png")
    .pipe(
      imageResize({
        width: 520,
        height: 419,
        crop: true,
        upscale: true
      })
    )
    .pipe(gulp.dest("dist/images"));
});

// Create webp images
gulp.task("webp", () =>
  gulp
    .src("dist/images/*.png")
    .pipe(webp({method: 6}))
    .pipe(gulp.dest("dist/images"))
);

//  Cleaning
//  ---------

gulp.task("clean", function() {
  return del("dist").then(function(cb) {
    return cache.clearAll(cb);
  });
});
gulp.task("clean:dist", function() {
  return del(["dist/**/*", "!dist/images", "!dist/images/**/*"]);
});

// Build Sequences
// ---------------

gulp.task(
  "default",
  gulp.parallel([gulp.series(["sass", "js", "watch"]), gulp.series(["browserSync"])])
);

gulp.task("build", async function(callback) {
  runSequence(
    "clean:dist",
    "copy",
    "sass",
    "js",
    "useref",
    "images",
    "crop",
    "webp",
    "gifs",
    callback
  );
});
