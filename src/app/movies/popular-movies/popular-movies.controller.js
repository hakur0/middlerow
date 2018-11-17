angular.module('middlerow').controller('PopularMoviesController', PopularMoviesController);

PopularMoviesController.$inject = ['$stateParams', '$state'];

function PopularMoviesController($stateParams, $state){
    const self = this;

    this.model = {
        initial_page: $stateParams.page
    };
    this.updatePage = updatePage;


    function updatePage(page){
        $state.go('popular-movies', {page: page === 1 ? null : page});
    }
}
