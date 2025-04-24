app.controller("users", ["$scope", "userAPIService", "routeService", "dialogService", function ($scope, userAPIService, routeService, dialogService) {
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 20
    };
    $scope.users = null;
    
    function getUsers() {
        userAPIService.getUsers($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage).then(function (resp) {
            $scope.paginationConf.totalItems = resp.data.recordCount;
            $scope.users = resp.data.users;
        });
    }

    $scope.delete = function (userId) {
        userAPIService.deleteUser(userId).then(function (resp) {
            getUsers();
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

    $scope.detail = function (id) {
        routeService.goParams("user_edit", { userId: id });
    };

    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function () {
        if ($scope.paginationConf.currentPage == 0)
            return;
        getUsers();
    });

}]);