angular.module('middlerow').service('TmdbService', TmdbService);

TmdbService.$inject = ['tmdbApiUrl', 'tmdbApiKey', '$http', '$httpParamSerializer', 'MovieFactory', '$q'];

function TmdbService(tmdbApiUrl, tmdbApiKey, $http, $httpParamSerializer, MovieFactory, $q){
    /**
     * @typedef {Object} TmdbListResponse
     * @property {number} page The current page
     * @property {number} total_results The total number of results
     * @property {number} total_pages The total number of pages
     * @property {Movie[]} results An array of Movie objects
     */

    const self = this;


    /**
     * Constructs a TMDB API url using a resource name and query params, if any.
     * Automatically inserts the API key to the request.
     * @param {String} resource The API resource (eg: 'search/movies')
     * @param {Object} params The GET params to include, if any (eg: {'query': 'avengers'})
     * @returns {string} The constructed URL
     * @private
     */
    function _constructUrl(resource, params = {}){
        params.api_key = tmdbApiKey;
        return tmdbApiUrl + resource + '?' + $httpParamSerializer(params);
    }

    /**
     * Generates an array of Movie objects from raw TMDB movie objects
     * @param {Array} movieArray The list of raw movie objects from TMDB's API
     * @returns {Movie[]} An array of generated Movie objects
     * @private
     */
    function _generateMovieList(movieArray){
        const movieList = [];

        for(let movie of movieArray) movieList.push(new MovieFactory(movie));

        return movieList;
    }

    /**
     * Gets a list of keywords related to the given query
     * @param {String} query The query to search for
     * @returns {Promise|Object[]} A $http promise that resolves to an array of keyword objects
     */
    this.searchKeywords = (query)=>{
        return $http.get(_constructUrl('search/keyword', {query: query})).then((response)=>{
            return response.data.results;
        });
    };

    /**
     * Gets a paged list of the most popular TMDB's movies as of today
     * @param {Number} page The page to get, defaults to the first
     * @returns {Promise|TmdbListResponse} A $http promise that resolves into a TmdbListResponse object
     */
    this.getPopularMovies = (page = 1)=>{
        return self.getPaginatedMovieList('movie/popular', page);
    };

    /**
     * Gets a paged list of movies from the given TMDB API resource
     * @param {string} resource The resource to fetch, eg: 'movie/popular'
     * @param {number} page The page to fetch, defaults to the first
     * @param {string?} query The query string to fetch if you're making a search request
     * @returns {Promise|TmdbListResponse} A $http promise that resolves into a TmdbListResponse object
     */
    this.getPaginatedMovieList = (resource, page = 1, query)=>{
        return $http.get(_constructUrl(resource, {page: page, query: query})).then((response)=>{
            if(response.data.results.length){
                const data = response.data;
                data.results = _generateMovieList(data.results);
                return data;
            }
            return response.data;
        }).catch(()=>{
            $q.reject('There was an error trying to fetch a movie list. Try again.');
        });
    };

    /**
     * Returns a Movie object from the TMDB's API
     * @param {number} movieId The ID of the movie to retrieve
     * @returns {Promise|Movie} A $http promise that resolves into a Movie
     */
    this.getMovie = (movieId)=>{
        return $http.get(_constructUrl('movie/' + movieId)).then((response)=>{
            return new MovieFactory(response.data);
        });
    }
}
