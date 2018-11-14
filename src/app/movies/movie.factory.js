angular.module('middlerow').factory('MovieFactory', ()=>{
    /**
     * Create Movie objects
     * @param data The raw movie object returned by the TMDB API responses
     * @constructor
     */
    const Movie = function(data){
        this.backdrop_path = 'https://image.tmdb.org/t/p/w1400_and_h450_face' + data.backdrop_path;
        this.genres = data.genres;
        this.id = data.id;
        this.imdb_id = data.imdb_id;
        this.original_title = data.original_title;
        this.overview = data.overview;
        this.poster_path = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2' + data.poster_path;
        this.release_date = data.release_date;
        this.title = data.title;
        this.vote_average = data.vote_average;
    };

    return Movie;
});
