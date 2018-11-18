angular.module('middlerow').controller('SearchListController', SearchListController);

SearchListController.$inject = ['$stateParams', '$state'];

function SearchListController($stateParams, $state){
    this.model = {
        query: $stateParams.query,
        page: $stateParams.page
    };
    this.updateQuery = updateQuery;
    this.updatePage = updatePage;


    /**
     * Updates the current page parameter in the URL
     * @param {number} page The current page
     */
    function updatePage(page){
        $state.go('search-list', {page: page === 1 ? null : page});
    }


    /**
     * Updates the query parameter in the URL
     * @param {string} query The current query
     */
    function updateQuery(query){
        $state.go('search-list', {query: query});
    }
}
