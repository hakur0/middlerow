angular.module('middlerow').controller('MovieListController', MovieListController);

MovieListController.$inject = ['TmdbService', '$q', '$scope'];

function MovieListController(TmdbService, $q, $scope){
    const self = this;

    this.model = {
        pages: [],
        total_pages: null,
        total_results: null,
        is_loading: false
    };
    this.nextPage = nextPage;
    this.previousPage = previousPage;

    this.$onInit = ()=>{
        if(!self.resource){
            console.error('You need to provide a resource to fetch in a movie list!');
        }

        // Page initialization
        getPage(self.page || 1, self.query || null);

        self._$collectionUpdate = $scope.$on('vsRepeatInnerCollectionUpdated', function(event, start, end){
            // When the VS Repeat module updates the ng-repeat view, calculate which page
            // is currently being rendered and update the parent controller with it
            if(self.model.pages.length) { // noinspection JSUnresolvedFunction
                self.changePage({page: self.model.pages[Math.floor((start + end) / 2)].page});
            }
        });
    };

    this.$onDestroy = ()=>{
        self._$collectionUpdate();
    };


    /**
     * Queries the TMDB API using page and query parameters
     * @param {number} page The page to fetch
     * @param {string} query The query to send, if searching
     */
    function getPage(page, query){
        queryApi(page, query, true).then((response)=>{
            self.model.pages = [{
                page: response.page,
                movies: response.results,
                query: query
            }];
        });
    }

    /**
     * Loads the next page based on what's already loaded
     */
    function nextPage(){
        const last_page = self.model.pages[self.model.pages.length - 1];

        if(last_page.page < self.model.total_pages){
            queryApi(last_page.page + 1, last_page.query).then((response)=>{
                // If the response query is different from the current query, it probably
                // means that this response arrived after the user made a different query.
                // If that's the case, simply discard the response.
                if(self.model.pages[self.model.pages.length - 1].query === last_page.query){
                    self.model.pages.push({
                        page: response.page,
                        movies: response.results,
                        query: last_page.query
                    })
                }
            }).catch(angular.noop);
        }
    }

    /**
     * Loads the previous page based on what's already loaded
     */
    function previousPage(){
        const first_page = self.model.pages[0];

        if(first_page.page !== 1){
            queryApi(first_page.page - 1, first_page.query).then((response)=>{
                // If the response query is different from the current query, it probably
                // means that this response arrived after the user made a different query.
                // If that's the case, simply discard the response.
                if(self.model.pages[0].query === first_page.query){
                    self.model.pages.unshift({
                        page: response.page,
                        movies: response.results,
                        query: first_page.query
                    })
                }
            }).catch(angular.noop);
        }
    }

    /**
     * Queries the TMDB API using the resource given to the movie list component
     * @param {number} page The page to fetch
     * @param {string} query The query to send, if searching
     * @param {boolean} force If true, will make a new request even if already fetching something
     * @returns {Promise|TmdbListResponse} A $http promise that resolves into a TmdbListResponse object
     */
    function queryApi(page, query, force = false){
        if(!self.model.is_loading || force){
            self.model.is_loading = true;

            return TmdbService.getPaginatedMovieList(self.resource, page, query).then((response)=>{
                self.model.total_pages = response.total_pages;
                self.model.total_results = response.total_results;
                return response;
            }).finally(()=>{
                self.model.is_loading = false;
            });
        }
        return $q.reject('Fetch in progress.');
    }
}
