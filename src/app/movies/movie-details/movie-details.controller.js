angular.module('middlerow').controller('MovieDetailsController', MovieDetailsController);

MovieDetailsController.$inject = ['$stateParams', 'TmdbService'];

function MovieDetailsController($stateParams, TmdbService){
    const self = this;

    this.model = {
        movie: null
    };

    this.$onInit = ()=>{
        // If a Movie object was passed, use it to populate the component before fetching more info
        if($stateParams.movie) self.model.movie = $stateParams.movie;

        TmdbService.getMovie($stateParams.movieId).then((movie)=>{
            self.model.movie = movie;
        });
    };
}
