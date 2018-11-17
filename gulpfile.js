const gulp = require('gulp');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify-es').default;
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const del = require('del');
const connect = require('gulp-connect');
const fs = require('fs');
const gutil = require('gulp-util');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const filter = require('gulp-filter');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const workboxBuild = require('workbox-build');

gulp.task('clean', function(){
    return del('dist/**');
});

gulp.task('sassify', function(){
    return gulp.src('src/app/**/*.scss')
               .pipe(sourcemaps.init())
               .pipe(sass().on('error', sass.logError))
               .pipe(sourcemaps.write(''))
               .pipe(gulp.dest('src/app/'));
});

gulp.task('minify', ['clean', 'sassify'], function(){
    const indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

    return gulp.src('src/index.html')
               .pipe(useref().on('error', gutil.log))
               .pipe(gulpIf('*.js', uglify())).on('error', function(err){gutil.log(gutil.colors.red('[Error]'), err.toString());})
               .pipe(indexHtmlFilter)
               .pipe(rev())
               .pipe(indexHtmlFilter.restore)
               .pipe(revReplace())
               .pipe(gulpIf('*.css', cssnano({ zindex: false })))
               .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', ['minify'], function(){
    const assets = [
        'src/app/**/*.html',
        'src/images/**/*'
    ];

    return gulp.src(assets, {base:'src'})
               .pipe(gulp.dest('dist'));
});

gulp.task('service-worker', ['copy-assets'], () => {
    return workboxBuild.injectManifest({
        swSrc: 'src/sw.js',
        swDest: 'dist/sw.js',
        globDirectory: 'dist',
        globPatterns: [
            '**\/*.{js,css,html,svg}',
        ]
    }).then(({count, size, warnings}) => {
        warnings.forEach(console.warn);
        console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
});

gulp.task('build', ['service-worker'], function(){
    const assets = [
        'src/app/**/*.html'
    ];

    return gulp.src(assets, {base:'src'})
               .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['sassify'], function(){
    gulp.watch('src/app/**/*.scss', ['sassify']);
    connect.server({
        name: 'Development Server',
        root: 'src',
        port: 3000,
        fallback: 'src/index.html',
        https:{
            key: fs.readFileSync('certs/server.key'),
            cert: fs.readFileSync('certs/server.crt')
        }
    });
});

gulp.task('serve-http', ['sassify'], function(){
    gulp.watch('src/app/**/*.scss', ['sassify']);
    connect.server({
        name: 'Development Server (no SSL)',
        root: 'src',
        port: 3000,
        fallback: 'src/index.html',
    });
});

gulp.task('serve-dist', function(){
    connect.server({
        name: 'Dist Server',
        root: 'dist',
        port: 4000,
        fallback: 'dist/index.html',
        https:{
            key: fs.readFileSync('certs/server.key'),
            cert: fs.readFileSync('certs/server.crt')
        }
    });
});

gulp.task('serve-dist-http', function(){
    connect.server({
        name: 'Dist Server (no SSL)',
        root: 'dist',
        port: 4000,
        fallback: 'dist/index.html',
    });
});

gulp.task('default', ['serve', 'serve-dist']);
