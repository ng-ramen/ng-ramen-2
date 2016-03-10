var gulp = require('gulp');
var karma = require('karma').server;
var sourcemaps = require('gulp-sourcemaps');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var exec = require('child_process').exec;
var typescript = require('gulp-typescript');

var tscConfig = require('./tsconfig.json');

var remapCmd = 'node_modules/.bin/remap-istanbul -i coverage/coverage-final.json -o coverage -t html'

var PATHS = {
    src: 'src/**/*.ts',
    demo: 'demo/**/*.ts'
};

gulp.task('clean', function (done) {
    var del = require('del');
    del(['dist'], done);
});

gulp.task('test', ['ts2js'], function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });
});

gulp.task('html-cov', function (cb) {
    exec(remapCmd, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('demo', ['clean'], function () {

    var tsResult = gulp
        .src(PATHS.demo)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions));

    return tsResult.js.pipe(sourcemaps.write('./', {
            sourceRoot: __dirname + '/'
        })).pipe(gulp.dest('.'));
});

gulp.task('dist', ['clean'], function () {

    var tsResult = gulp
        .src(PATHS.src)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions));

    return tsResult.js.pipe(sourcemaps.write('./', {
            sourceRoot: __dirname + '/src'
        })).pipe(gulp.dest('dist'));
});

gulp.task('ts2js', ['clean'], function () {

    var tsResult = gulp
        .src(PATHS.src)
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions));

    return tsResult.js.pipe(sourcemaps.write('./', {
            sourceRoot: __dirname + '/src'
        })).pipe(gulp.dest('src'));
});

gulp.task('play', ['ts2js'], function () {
    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9000, app;

    gulp.watch(PATHS.src, ['ts2js']);

    app = connect().use(serveStatic(__dirname));
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port);
    });
});

gulp.task('default', ['ts2js']);
