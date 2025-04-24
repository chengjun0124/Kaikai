app.controller("user_edit", ["$scope", "$stateParams", "userAPIService", "dialogService", "$rootScope", function ($scope, $stateParams, userAPIService, dialogService, $rootScope) {
    $scope.isCreate = $stateParams.userId == "" ? true : false;
    $scope.user = {};
    $scope.user.userTypeId = 2;
    $scope.userTypes = [
        { name: "订单操作员", id: 2 },
        { name: "系统管理员", id: 1 }
    ];


    $rootScope.invalidMapping = {
        "username": "td_m_username",
        "password": "td_m_password",
        "usertype": "td_m_usertype",
    };

    if (!$scope.isCreate) {
        userAPIService.getUser($stateParams.userId).then(function (resp) {
            $scope.user = resp.data;
        });
    }



    $scope.submit = function () {
        if ($scope.isCreate) {
            userAPIService.createUser($scope.user).then(function (resp) {
                dialogService.showMention("1", "创建用户成功", "users");
            });
        }
        else {
            userAPIService.updateUser($scope.user).then(function (resp) {
                dialogService.showMention("1", "修改用户成功", "users");
            });
        }
    };

}]);