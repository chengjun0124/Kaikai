app.controller("login", ["$scope", "authAPIService", "storageService", "routeService", "dialogService", function ($scope, authAPIService, storageService, routeService, dialogService) {

    $scope.login = function () {
        
        if (!$scope.userName || $scope.userName.length == 0) {
            dialogService.showMention(1, "请输入用户名");
            return;
        }

        if (!$scope.password || $scope.password.length == 0) {
            dialogService.showMention(1, "请输入密码");
            return;
        }

        authAPIService.auth($scope.userName, $scope.password).then(function (resp) {
            storageService.setSession("jwt", resp.data.jwt);
            storageService.setSession("userTypeId", resp.data.userTypeId);
            routeService.goParams("home");
        }, function (error) {
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

    $scope.focusPwd = function () {
        document.getElementById("txt_password").focus();
    };

    var height = $(window).height();
    $("body").css("height", height);
    
}]);