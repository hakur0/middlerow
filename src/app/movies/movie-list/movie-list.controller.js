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

        getPage(self.page || 1, self.query || null);

        self._$collectionUpdate = $scope.$on('vsRepeatInnerCollectionUpdated', function(event, start, end){
            if(self.model.pages.length) self.changePage({page: self.model.pages[Math.floor((start + end) / 2)].page});
        });
    };

    this.$onDestroy = ()=>{
        self._$collectionUpdate();
    };


    function getPage(page, query){
        queryApi(page, query, true).then((response)=>{
            self.model.pages = [{
                page: response.page,
                movies: response.results,
                query: query
            }];
        });
    }

    function nextPage(){
        const last_page = self.model.pages[self.model.pages.length - 1];

        if(last_page.page < self.model.total_pages){
            queryApi(last_page.page + 1, last_page.query).then((response)=>{
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

    function previousPage(){
        const first_page = self.model.pages[0];

        if(first_page.page !== 1){
            queryApi(first_page.page - 1, first_page.query).then((response)=>{
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
     * @param {string} query TODO: terminar
     * @param force
     * @returns {*}
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




    // this.generatePages = generatePages;


    // /**
    //  * Returns 5 numbers representing the current page pagination
    //  * The list will always have at most 5 numbers,
    //  * @param {TmdbListResponse} tmdbListResponse A TMDB API movie list response
    //  * @returns {number[]} The numbers to use for pagination
    //  */
    // function generatePages(tmdbListResponse){
    //     if(tmdbListResponse){
    //         const page_list = [];
    //         const current_page = tmdbListResponse.page;
    //         const total_pages = tmdbListResponse.total_pages;
    //
    //         if(current_page <= 3){
    //             for(let count = 1; count <= total_pages && count <= 5; count++){
    //                 page_list.push(count);
    //             }
    //         } else{
    //             let remaining_pages = 5;
    //
    //             for(let count = current_page; count <= total_pages && page_list.length < 3; count++){
    //                 page_list.push(count);
    //                 remaining_pages--;
    //             }
    //             for(let count = page_list[0] - 1; count > 0 && remaining_pages > 0; count--){
    //                 page_list.unshift(count);
    //                 remaining_pages--;
    //             }
    //         }
    //
    //         return page_list;
    //     }
    // }
}
