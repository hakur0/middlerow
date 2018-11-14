angular.module('middlerow', []);
angular.module('middlerow').config(middleRowConfig);

// Initializes the Cache Service Worker
if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register('/sw.js');
    });
}

// App config
middleRowConfig.$inject = ['$httpProvider'];

function middleRowConfig($httpProvider){
    $httpProvider.interceptors.push('authInjector');
}
