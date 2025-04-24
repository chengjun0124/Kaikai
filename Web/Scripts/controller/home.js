app.controller("home", ["$scope", "storageService", function ($scope, storageService) {
    
    $scope.userTypeId = storageService.getSession("userTypeId");

    

}]);