angular.module('middlerow').controller('MovieDetailsController', MovieDetailsController);

MovieDetailsController.$inject = ['$stateParams', 'TmdbService'];

function MovieDetailsController($stateParams, TmdbService){
    const self = this;

    this.model = {
        movie: null
    };

    this.$onInit = ()=>{
        TmdbService.getMovie($stateParams.movieId).then((movie)=>{
            self.model.movie = movie;
        });
    };
}
