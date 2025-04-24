app.controller("size_edit", ["$scope", "$stateParams", "sizeAPIService", "dialogService", "$rootScope", function ($scope, $stateParams, sizeAPIService, dialogService, $rootScope) {
    $scope.isCreate = $stateParams.sizeId == "" ? true : false;
    $scope.size = {};

    
    $rootScope.invalidMapping = {
        "sizename": "td_m_sizename",
        "sex": "td_m_sex",
        "neckscopel": "td_m_neckscopel",
        "neckscopeu": "td_m_neckscopeu",
        "shoulderscopel": "td_m_shoulderscopel",
        "shoulderscopeu": "td_m_shoulderscopeu",
        "flengthscopel": "td_m_flengthscopel",
        "flengthscopeu": "td_m_flengthscopeu",
        "blengthscopel": "td_m_blengthscopel",
        "blengthscopeu": "td_m_blengthscopeu",
        "chestscopel": "td_m_chestscopel",
        "chestscopeu": "td_m_chestscopeu",
        "waistscopel": "td_m_waistscopel",
        "waistscopeu": "td_m_waistscopeu",
        "lowerhemscopel": "td_m_lowerhemscopel",
        "lowerhemscopeu": "td_m_lowerhemscopeu",
        "lsleevelengthscopel": "td_m_lsleevelengthscopel",
        "lsleevelengthscopeu": "td_m_lsleevelengthscopeu",
        "lsleevecuffscopel": "td_m_lsleevecuffscopel",
        "lsleevecuffscopeu": "td_m_lsleevecuffscopeu",
        "ssleevelengthscopel": "td_m_ssleevelengthscopel",
        "ssleevelengthscopeu": "td_m_ssleevelengthscopeu",
        "ssleevecuffscopel": "td_m_ssleevecuffscopel",
        "ssleevecuffscopeu": "td_m_ssleevecuffscopeu",
        "sizedetails": "td_m_sizedetails",
        "sizename_": "td_m_sizename_",
        "sizealias_": "td_m_sizealias_",
        "neck_": "td_m_neck_",
        "shoulder_": "td_m_shoulder_",
        "flength_": "td_m_flength_",
        "blength_": "td_m_blength_",
        "chest_": "td_m_chest_",
        "waist_": "td_m_waist_",
        "lowerhem_": "td_m_lowerhem_",
        "lsleevelength_": "td_m_lsleevelength_",
        "lsleevecuff_": "td_m_lsleevecuff_",
        "ssleevelength_": "td_m_ssleevelength_",
        "ssleevecuff_": "td_m_ssleevecuff_"
    };

    if (!$scope.isCreate) {
        sizeAPIService.getSize($stateParams.sizeId).then(function (resp) {
            $scope.size = resp.data;
        });
    }
    else {
        $scope.size.sex = "M";
        $scope.size.sizeDetails = [];
        $scope.size.sizeDetails.push({
            "sizeName": "",
            "sizeAlias": "",
            "neck": "",
            "shoulder": "",
            "fLength": "",
            "bLength": "",
            "chest": "",
            "waist": "",
            "lowerHem": "",
            "lSleeveLength": "",
            "lSleeveCuff": "",
            "sSleeveLength": "",
            "sSleeveCuff": ""
        });
    }



    $scope.submit = function () {
        if ($scope.isCreate) {
            sizeAPIService.createSize($scope.size).then(function (resp) {
                dialogService.showMention("1", "创建尺码成功", "sizes");
            });
        }
        else {
            sizeAPIService.updateSize($scope.size).then(function (resp) {
                dialogService.showMention("1", "修改尺码成功", "sizes");
            });
        }
    }


    $scope.addDetail = function () {
        $scope.size.sizeDetails.push({
            "sizeName": "",
            "sizeAlias": "",
            "neck": "",
            "shoulder": "",
            "fLength": "",
            "bLength": "",
            "chest": "",
            "waist": "",
            "lowerHem": "",
            "lSleeveLength": "",
            "lSleeveCuff": "",
            "sSleeveLength": "",
            "sSleeveCuff": ""
        });
    };

    $scope.deleteDetail = function (detail) {
        var index = $scope.size.sizeDetails.indexOf(detail);
        $scope.size.sizeDetails.splice(index, 1);
    };

}]);