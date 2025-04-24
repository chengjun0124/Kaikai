app.controller("password", ["$scope", "passwordAPIService", "dialogService", "$rootScope", function ($scope, passwordAPIService, dialogService, $rootScope) {
    $scope.pwd = {};

    $rootScope.invalidMapping = {
        "oldpassword": "td_m_old",
        "newpassword": "td_m_new"
    };


    $scope.submit = function () {
        passwordAPIService.updatePassword($scope.pwd).then(function (resp) {
            $scope.pwd.oldPassword = "";
            $scope.pwd.newPassword = "";
            $scope.pwd.confirmPassword = "";
            dialogService.showMention("1", "修改密码成功");
        });
    };

}]);