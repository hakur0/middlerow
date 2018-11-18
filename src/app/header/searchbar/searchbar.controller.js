angular.module('middlerow').controller('SearchBarController', SearchBarController);

SearchBarController.$inject = ['TmdbService', '$state'];

function SearchBarController(TmdbService, $state){
    const self = this;

    this.model = {
        query: '',
        latest_search: null,
        is_loading: false
    };

    this.search = search;
    this.searchKeywords = searchKeywords;


    /**
     * Redirect the user to the search page
     * @param {string} query The query to search for
     */
    function search(query){
        self.model.query = '';
        self.model.latest_search = null;
        $state.go('search-list', {query: query});
    }

    /**
     * Search for movies at TMDB and updates the latest_search model
     * @param {String} query The query string to search for
     */
    function searchKeywords(query){
        if(query.length){
            self.model.is_loading = true;

            TmdbService.searchKeywords(query).then((response) => {
                if(self.model.query.length) self.model.latest_search = response;
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
