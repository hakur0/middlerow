angular.module('middlerow').controller('HeaderController', HeaderController);

HeaderController.$inject = ['TmdbService'];

function HeaderController(TmdbService){
    const self = this;

    this.forceNetworkError = forceNetworkError;

    function forceNetworkError(){
        const message = 'Isso irá fazer 42 requests seguidas à API do TMDB ' +
            'para tentar gerar um erro 429 (Too Many Requests). Continuar?';

        if(window.confirm(message)){
            for(let i = 0; i < 42; i++){
                TmdbService.getPopularMovies();
            }
        }
    }
}
