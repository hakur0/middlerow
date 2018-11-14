angular.module('middlerow').controller('HeaderController', HeaderController);

HeaderController.$inject = [];

function HeaderController(){
    const self = this;

    self.name = 'Lucas';
}
