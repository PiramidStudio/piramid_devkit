var gulp = require('gulp');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var jsInheritance = require('gulp-js-inheritance');
var gulpImports = require('gulp-imports');
var gutil = require('gulp-util');
var cached = require('gulp-cached');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var data = require('gulp-data');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var path = require('path');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var pug = require('gulp-pug');
var emitty = require('emitty').setup('views', 'pug');
var stylus = require('gulp-stylus');
var koutoSwiss = require( "kouto-swiss" );
var sourcemaps = require('gulp-sourcemaps');
var flatten = require('gulp-flatten');
var gulpFilter = require('gulp-filter');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var web = require("browser-sync").create();
var pkg = require('./package.json');
var info = {};

info.web = pkg.config.web;
info.js = pkg.config.js;
info.stylus = pkg.config.stylus;
info.pug = pkg.config.pug;
info.pugpartials = pkg.config.pugpartials;
info.watch = pkg.config.watch;
info.jshint = pkg.jshintConfig;
info.dest_path = './production';

var _onError = function(err, errorType) {
    gutil.beep();
    notify.onError({
        title: errorType + ' Error',
        message: err.message,
        sound: false
    })(err);

};


//////////////////////////////
// Moving Files
//////////////////////////////

gulp.task('movefiles', function(done) {
  console.log("Moving all files in styles folder");
  gulp.src("./assets/fonts/*")
    .pipe(gulp.dest('./production/fonts'));
  gulp.src("./assets/img/**/*")
    .pipe(gulp.dest('./production/img'));
  gulp.src("./assets/data/**/*")
    .pipe(gulp.dest('./production/data'));
  done();
});


//////////////////////////////
// Bower require components
//////////////////////////////

gulp.task('bower-components', function(done) {

  var jsFilter = gulpFilter('*.js', {restore: true});
  var cssFilter = gulpFilter('*.css', {restore: true});
  var fontFilter = gulpFilter(['*.eot', '*.woff', '*.svg', '*.ttf']);
  return gulp.src(mainBowerFiles({debugging: true}))
  // grab vendor js files from bower_components, minify and push in /public
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(jsFilter)
  // .pipe(gulp.dest(info.dest_path + '/js/'))

  .pipe(concat('vendors.js'))
  // .pipe(uglify())
  // .pipe(rename({
  //     suffix: ".min"
  // }))
  .pipe(gulp.dest(info.dest_path + '/js/'))
  .pipe(jsFilter.restore)

  // grab vendor css files from bower_components, minify and push in /public
  .pipe(cssFilter)
  // .pipe(gulp.dest(info.dest_path + '/css'))
  .pipe(concat('vendors.css'))
  // .pipe(minifycss())
  // .pipe(rename({
  //     suffix: ".min"
  // }))
  .pipe(gulp.dest(info.dest_path + '/css/'))
  .pipe(cssFilter.restore)

  // grab vendor font files from bower_components and push in /public
  .pipe(fontFilter)
  .pipe(flatten())
  .pipe(gulp.dest(info.dest_path + '/fonts'));

  done();
});


//////////////////////////////
// Pug Tasks
//////////////////////////////


// Your "watch" task
gulp.task('pug-watcher', (done) => {
	// Shows that run "watch" mode
	global.watch = true;
  gulp.watch('views/**/*.pug', gulp.series('pug'))
  		.on('all', (event, filepath) => {
  			global.emittyChangedFile = filepath;
  		});
      done();
});

gulp.task('pug', (done) =>
  new Promise((resolve, reject) => {
    emitty.scan(global.changedStyleFile).then(() => {
      gulp.src(info.pug.src)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(gulpif(global.watch, emitty.filter(global.emittyChangedFile)))
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(info.web.server))
        .on('end', resolve)
        .on('error', reject);
        done();
    });
  })
);

//////////////////////////////
// Stylus Tasks
//////////////////////////////


gulp.task('styles-watcher', (done) => {
	// Shows that run "watch" mode
	global.watch = true;
  gulp.watch(info.stylus.src, gulp.series('styles'))
	.on('all', (event, filepath) => {
		global.emittyChangedFile = filepath;
	});
  done();

});

gulp.task('styles', function (done) {
  gulp.src(pkg.config.stylus.src)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(stylus({
      paths:  ['node_modules', 'styles/globals'],
      import: ['jeet/stylus/jeet', 'stylus-type-utils', 'kouto-swiss'],
      use: koutoSwiss(),
      'include css': true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(pkg.config.stylus.dist))
    .pipe(web.stream());
    done();
});

//////////////////////////////
// HTML Tasks
//////////////////////////////
gulp.task('reload-watcher', (done) => {
	// Shows that run "watch" mode
	global.watch = true;
  gulp.watch(info.watch.reload, gulp.series('reload'))
	.on('all', (event, filepath) => {
		// global.emittyChangedFile = filepath;
	});
  done();
});

gulp.task('reload', function(done) {
    web.reload();
    done();
});

//////////////////////////////
// Javascript Tasks
//////////////////////////////

gulp.task('js-watcher', (done) => {
	// Shows that run "watch" mode
	global.watch = true;
  gulp.watch(info.js.src, gulp.series('js'))
	.on('all', (event, filepath) => {
		// global.emittyChangedFile = filepath;
	});
  done();

});



gulp.task('js', function(done) {

  return gulp.src(info.js.src)
    .pipe(plumber({
        errorHandler: function(error) {
            _onError(error, 'JS');
            this.emit('end');
        }
    }))
    .pipe(gulpif(global.isWatching, cached('js', {
        optimizeMemory: true
    })))
    .pipe(jsInheritance({
        dir: info.js.folder,
    }))
    .pipe(jshint(info.jshint))
    .pipe(jshint.reporter(stylish))
    .pipe(filter(function(file) {
        return !/\/_/.test(file.path) || !/^_/.test(file.relative);
    }))
    .pipe(data(function(file) {
        process.stdout.write("[JS]\t" + gutil.colors.magenta('Processing ') + file.path + "\t\t......\t");
    }))
    .pipe(gulpImports())
    //.pipe(uglify())
    .pipe(data(function(file) {
        console.log(gutil.colors.green('done'));
    }))
    .pipe(gulp.dest(function(file) {
        return file.base.replace(path.resolve(info.js.folder), path.resolve(info.js.dist));
    }));

    done();

});


// > SERVER WEB
gulp.task('serve', function(done) {
    gutil.log("[WEBSERVER]\tInitializing");
    web.init(info.web);
    done();
});

// > UTILS
gulp.task('setWatch', function(done) {
    global.isWatching = true;
    gutil.log("[WATCH]\tInitialized");
    done();
});


gulp.task('jsCache', function(done) {

    return gulp.src(info.js.src)
    .pipe(gulpif(global.isWatching, cached('js', {
        optimizeMemory: true
    }))).
    on('end', function() {
        gutil.log("[JS]\t\tCached");
    });

    done();

});

// > WATCH
gulp.task('watch', gulp.series('setWatch', 'jsCache', 'pug-watcher', 'styles-watcher', 'js-watcher', 'reload-watcher'));

// > BUILD
gulp.task('build', gulp.parallel('js','pug','styles','movefiles','bower-components'));


// > DEFAULT TASK
gulp.task('default',  gulp.series('serve', 'watch'));
