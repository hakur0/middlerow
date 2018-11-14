angular.module('middlerow').controller('SearchBarController', SearchBarController);

SearchBarController.$inject = ['TmdbService'];

function SearchBarController(TmdbService){
    const self = this;


    self.model = {
        query: '',
        latest_search: null,
        is_loading: false
    };

    /**
     * Search for movies at TMDB and updates the latest_search model
     * @param {String} query The query string to search for
     */
    self.search = function(query){
        if(query.length){
            self.model.is_loading = true;

            TmdbService.searchMovies(query).then((response) => {
                self.model.latest_search = response;
            }).finally(() => {
                self.model.is_loading = false;
            });
        } else{
            // If the query is empty, clean the search model so it'll stop
            // showing earlier search results
            self.model.latest_search = null;
        }
    }
}
