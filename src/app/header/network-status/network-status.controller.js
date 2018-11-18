angular.module('middlerow').controller('NetworkStatusController', NetworkStatusController);

NetworkStatusController.$inject = ['$window'];

function NetworkStatusController($window){
    this.isOffline = isOffline;


    /**
     * Returns true if the browser is currently offline
     * @returns {boolean} True if browser is offline, else false
     */
    function isOffline(){
        return !$window.navigator.onLine;
    }
}
