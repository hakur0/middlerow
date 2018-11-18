angular.module('middlerow').controller('PopularMoviesController', PopularMoviesController);

PopularMoviesController.$inject = ['$stateParams', '$state', 'TmdbService'];

function PopularMoviesController($stateParams, $state, TmdbService){
    this.model = {
        initial_page: $stateParams.page
    };
    this.updatePage = updatePage;
    this.forceNetworkError = forceNetworkError;


    /**
     * Helper function to live test notifications
     */
    function forceNetworkError(){
        const message = 'Isso irá fazer 41 requests seguidas à API do TMDB ' +
            'para tentar gerar um erro 429 (Too Many Requests). Continuar?';

        if(window.confirm(message)){
            for(let i = 0; i < 41; i++){
                TmdbService.getPopularMovies();
            }
        }
    }

    /**
     * Updates the current page parameter in the URL
     * @param {number} page The current page
     */
    function updatePage(page){
        $state.go('popular-movies', {page: page === 1 ? null : page});
    }
}
