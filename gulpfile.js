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
const realFavicon = require('gulp-real-favicon');
const FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', function(done) {
    realFavicon.generateFavicon({
        masterPicture: 'src/images/icon/logo.png',
        dest: 'src',
        iconsPath: '',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffeef2',
                margin: '18%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                },
                appName: 'MiddleRow'
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#ffeef2',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                },
                appName: 'MiddleRow'
            },
            androidChrome: {
                pictureAspect: 'shadow',
                themeColor: '#ff416e',
                manifest: {
                    name: 'MiddleRow',
                    startUrl: 'https://middlerow.xyz',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'blackAndWhite',
                threshold: 65.3125,
                themeColor: '#ff416e'
            }
        },
        settings: {
            compression: 1,
            scalingAlgorithm: 'Lanczos',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: false,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

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
    const indexFilter = filter(['**/*', '!**/index.html'], { restore: true });
    const indexOnlyFilter = filter(['!**/*', '**/index.html'], { restore: true });

    return gulp.src('src/index.html')
               .pipe(useref().on('error', gutil.log))
               .pipe(gulpIf('*.js', uglify())).on('error', function(err){gutil.log(gutil.colors.red('[Error]'), err.toString());})
               .pipe(indexFilter)
               .pipe(rev())
               .pipe(indexFilter.restore)
               .pipe(indexOnlyFilter)
               .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
               .pipe(indexOnlyFilter.restore)
               .pipe(revReplace())
               .pipe(gulpIf('*.css', cssnano({ zindex: false })))
               .pipe(gulp.dest('dist'));
});

gulp.task('copy-assets', ['minify'], function(){
    const assets = [
        'src/app/**/*.html',
        'src/images/**/*',
        'src/*.png',
        'src/browserconfig.xml',
        'src/favicon.ico',
        'src/safari-pinned-tab.svg',
        'src/site.webmanifest',
        '!src/images/icon/**/*'
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
            '**\/*.{js,css,html,svg,ico}',
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
