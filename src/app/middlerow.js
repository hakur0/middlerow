angular.module('middlerow', ['ui.router', 'vs-repeat', 'ngAnimate']);
angular.module('middlerow').config(middleRowConfig);

// Initializes the Cache Service Worker
if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('/sw.js');
    });
}

// App config
middleRowConfig.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider'];

function middleRowConfig($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider){
    // Install a HTTP response interceptor to handle fetch errors
    $httpProvider.interceptors.push('HttpErrorHandler');

    // Removes the #! URL code, since we're not supporting old browsers
    $locationProvider.html5Mode(true);

    // Unknown states will be redirected to the popular movies page
    $urlRouterProvider.otherwise('/popular');

    // App routes
    $stateProvider
        .state({
            name: 'popular-movies',
            url: '/popular?page',
            component: 'popularMovies',
            params: {
                page: {
                    dynamic: true
                }
            }
        })
        .state({
            name: 'movie-details',
            url: '/movie/:movieId',
            component: 'movieDetails',
        })
}
