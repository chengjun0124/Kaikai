app.controller("summary", ["$scope", "companyAPIService", "sizeAPIService", "exportAPIService", "$rootScope", function ($scope, companyAPIService, sizeAPIService, exportAPIService, $rootScope) {
    $scope.companies = null;
    $scope.sizes = null;
    $scope.company = "";
    $scope.manSizeId = "";
    $scope.womanSizeId = "";

    $rootScope.invalidMapping = {
        "mansize": "td_m_man",
        "womansize": "td_m_woman"
        //"age": "div_mention_age",
        //"manChestEnlarge": "td_m_manChestEnlarge",
        //"womanChestEnlarge": "td_m_womanChestEnlarge"
    };
    
    companyAPIService.getCompanies().then(function (resp) {
        $scope.companies = resp.data;
    });

    sizeAPIService.getSizes().then(function (resp) {
        $scope.sizes = resp.data;
    });

    $scope.export = function () {        
        exportAPIService.export($scope.company, $scope.manSizeId, $scope.womanSizeId).then(function (resp) {
            var blob = new Blob([resp.data], { type: resp.headers("content-type") });
            var a = document.createElement("a");
            document.body.appendChild(a);
            var fileName = decodeURI(resp.headers("Content-Disposition").replace("attachment; filename=", ""));
            fileName = fileName.replace(/\"/g, "");
            a.download = fileName;
            a.href = URL.createObjectURL(blob);
            a.click();
            document.body.removeChild(a);
        });
    };    
}]);