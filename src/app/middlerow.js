angular.module('middlerow', ['ui.router', 'vs-repeat', 'ngAnimate']);

// Initializes the Cache Service Worker
if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('/sw.js');
    });
}

// App config
angular.module('middlerow').config(middleRowConfig);

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
        .state({
            name: 'search-list',
            url: '/search?query?page',
            component: 'searchList',
            params: {
                page: {
                    dynamic: true
                }
            }
        })
}

// Configurations that must live inside a run block
angular.module('middlerow').run(middleRowRun);

middleRowRun.$inject = ['$transitions', '$document'];

function middleRowRun($transitions, $document){
    // Scroll the viewport to top when transitioning routes
    $transitions.onSuccess({}, (transition)=>{
        // Only scroll if the route transitioned to a different state
        // Otherwise, simply updating the page URL would scroll the view
        if(transition.from() !== transition.to()){
            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        }
    });
}
