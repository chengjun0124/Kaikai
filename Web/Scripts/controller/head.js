app.controller("head", ["$scope", "storageService", function ($scope, storageService) {
    
    $scope.logout = function () {
        storageService.removeSession("jwt");
        storageService.removeSession("userTypeId");
    };
    
}]);