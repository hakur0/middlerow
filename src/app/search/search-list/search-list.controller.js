angular.module('middlerow').controller('SearchListController', SearchListController);

SearchListController.$inject = ['$stateParams', '$state'];

function SearchListController($stateParams, $state){
    const self = this;

    this.model = {
        query: $stateParams.query,
        page: $stateParams.page
    };
    this.updateQuery = updateQuery;
    this.updatePage = updatePage;


    function updatePage(page){
        $state.go('search-list', {page: page === 1 ? null : page});
    }


    function updateQuery(query){
        $state.go('search-list', {query: query});
    }
}
