const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const removeFiles = require('gulp-remove-files');
const liveServer = require('live-server');
const babel = require('gulp-babel');

gulp.task('styles', done => {
    gulp.src('./css/main.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('./dist'));
        done();
});

gulp.task('clear', done => {
    gulp.src('./dist/*')
        .pipe(removeFiles());
        done()
});

const params = {
    port: 8181, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: ".", // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [['/components', './node_modules']], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

gulp.task('server', done => {
    liveServer.start(params);
        done()
});

gulp.task('js:build', done => {
    gulp.src('./src/index.js')
    .pipe(babel());
    done();
});

gulp.task('babel', () =>
	gulp.src('./src/index.js')
		.pipe(babel({
            presets: ['@babel/preset-env','@babel/plugin-transform-arrow-functions'],
            plugins: ['@babel/transform-runtime', '@babel/polyfill']
		}))
		.pipe(gulp.dest('dist'))
);

gulp.task('watch', () => {
    gulp.watch('./css/main.scss', gulp.series('styles'));
    gulp.watch('./src/index.js', gulp.series('js:build'));
});

gulp.task('default',gulp.series('clear','server'));