angular.module('middlerow').controller('NetworkStatusController', NetworkStatusController);

NetworkStatusController.$inject = ['$window'];

function NetworkStatusController($window){
    this.isOffline = isOffline;


    function isOffline(){
        return !$window.navigator.onLine;
    }
}
