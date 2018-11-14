angular.module('middlerow').service('TmdbService', TmdbService);

TmdbService.$inject = ['tmdbApiUrl', 'tmdbApiKey', '$http', '$httpParamSerializer', 'MovieFactory'];

function TmdbService(tmdbApiUrl, tmdbApiKey, $http, $httpParamSerializer, MovieFactory){
    /**
     * Constructs a TMDB API url using a resource name and query params, if any.
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
     * Gets search results for movies based on a query string
     * @param {String} query The query to search for
     * @param {Number} page The page to get, defaults to the first
     * @returns {Promise|Object} A $http promise that resolves to an array of Movie objects
     */
    this.searchMovies = function(query, page = 1){
        return $http.get(_constructUrl('search/movie', {query: encodeURIComponent(query), page: page})).then(function(response){
            if(response.data.results.length){
                const data = response.data;
                data.results = _generateMovieList(data.results);
                return data;
            }
            return response.data;
        });
    };

    /**
     * Gets a list of keywords related to the given query
     * @param {String} query The query to search for
     * @returns {Promise|Object[]} A $http promise that resolves to an array of keyword objects
     */
    this.searchKeywords = function(query){
        return $http.get(_constructUrl('search/keyword', {query: encodeURIComponent(query)})).then(function(response){
            return response.data.results;
        });
    };
}
