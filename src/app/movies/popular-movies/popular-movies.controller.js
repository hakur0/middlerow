angular.module('middlerow').controller('PopularMoviesController', PopularMoviesController);

PopularMoviesController.$inject = ['$stateParams', '$state', 'TmdbService'];

function PopularMoviesController($stateParams, $state, TmdbService){
    const self = this;

    this.model = {
        initial_page: $stateParams.page
    };
    this.updatePage = updatePage;
    this.forceNetworkError = forceNetworkError;

    function forceNetworkError(){
        const message = 'Isso irá fazer 41 requests seguidas à API do TMDB ' +
            'para tentar gerar um erro 429 (Too Many Requests). Continuar?';

        if(window.confirm(message)){
            for(let i = 0; i < 41; i++){
                TmdbService.getPopularMovies();
            }
        }
    }


    function updatePage(page){
        $state.go('popular-movies', {page: page === 1 ? null : page});
    }
}
