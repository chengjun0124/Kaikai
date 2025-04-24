app.controller("sizes", ["$scope", "sizeAPIService", "routeService", "dialogService", function ($scope, sizeAPIService, routeService, dialogService) {
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 20
    };
    $scope.sizes = null;


    function getSizes() {
        sizeAPIService.getSizesPagination($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage).then(function (resp) {
            $scope.paginationConf.totalItems = resp.data.recordCount;
            $scope.sizes = resp.data.sizes;
        });
    }

    $scope.detail = function (id) {
        routeService.goParams("size_edit", { sizeId: id });
    };

    $scope.delete = function (sizeId) {
        sizeAPIService.deleteSize(sizeId).then(function (resp) {
            getSizes();
        },
        function (error) {
            if (error.status == 500)
                routeService.goParams("error");
            else if (error.status == 404)
                routeService.goParams("error", { msg: encodeURIComponent("您请求的数据不存在，请返回首页重新浏览") });
            else if (error.status == 400) {
                dialogService.showMention(1, error.data[0].message);
            }
            else if (error.status == 401)
                routeService.goParams("login");
            else
                routeService.goParams("error");
        });
    };
    

    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function () {
        if ($scope.paginationConf.currentPage == 0)
            return;
        getSizes();
    });


}]);