angular.module('middlerow').component('movieList', {
    templateUrl: 'app/movies/movie-list/movie-list.component.html',
    controller: 'MovieListController as MovieList',
    bindings:{
        resource: '@',
        page: '<',
        query: '<',
        changePage: '&onChangePage'
    }
});
