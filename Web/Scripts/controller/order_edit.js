app.controller("order_edit", ["$scope", "orderAPIService", "sizeAPIService", "$stateParams", "routeService", "$rootScope", "dialogService", function ($scope, orderAPIService, sizeAPIService, $stateParams, routeService, $rootScope, dialogService) {
    $scope.isCreate = $stateParams.orderId == "" ? true : false;
    $rootScope.invalidMapping = {
        "group": "td_m_group",
        "company": "td_m_company",
        "department": "td_m_department",
        "job": "td_m_job",
        "employeecode": "td_m_employee_code",
        "name": "td_m_name",
        "age": "td_m_age",
        "sex": "td_m_sex",
        "height": "td_m_height",
        "weight": "td_m_weight",
        "neck": "td_m_neck",
        "shoulder": "td_m_shoulder",
        "flength": "td_m_flength",
        "blength": "td_m_blength",
        "chest": "td_m_chest",
        "waist": "td_m_waist",
        "lowerhem": "td_m_lowerhem",
        "presize": "td_m_presize",
        "lsleevelength": "td_m_lsleevelength",
        "lsleevecuff": "td_m_lsleevecuff",
        "lprice": "td_m_lprice",
        "ssleevelength": "td_m_ssleevelength",
        "ssleevecuff": "td_m_ssleevecuff",
        "sprice": "td_m_sprice",
        "memo": "td_m_memo",
        "chestenlarge": "td_m_chestenlarge",
        "waistenlarge": "td_m_waistenlarge",
        "lowerhemenlarge": "td_m_lowerhemenlarge",
        "longsleeve": "td_m_longsleeve",
        "shortsleeve": "td_m_shortsleeve",
        "lcolor_": "td_lcolor_",
        "lcloth_": "td_lcloth_",
        "lamount_": "td_lamount_",
        "scolor_": "td_scolor_",
        "scloth_": "td_scloth_",
        "samount_": "td_samount_"
    };
    $scope.order = {};
    $scope.order.sex = "M";
    $scope.order.chestEnlarge = "15";
    $scope.order.waistEnlarge = "15";
    $scope.order.lowerHemEnlarge = "15";
    $scope.order.preSize = "B";
    $scope.order.orderDetails = [];
    $scope.order.orderDetails.push({
        "color": "",
        "cloth": "",
        "amount": "1",
        "isLongSleeve": true
    });
    $scope.order.orderDetails.push({
        "color": "",
        "cloth": "",
        "amount": "1",
        "isLongSleeve": false
    });
    $scope.order.hasLongSleeve = true;
    $scope.order.hasShortSleeve = false;
    $scope.sizeDetails = null;

    if (!$scope.isCreate) {
        orderAPIService.getOrder($stateParams.orderId).then(function (resp) {
            $scope.order = resp.data;

            //如果没有长袖明细，加一条
            var hasOrderDetail = false;
            for (var i = 0; i < $scope.order.orderDetails.length; i++) {
                if ($scope.order.orderDetails[i].isLongSleeve == true) {
                    hasOrderDetail = true;
                    break;
                }
            }
            if (!hasOrderDetail)
                $scope.order.orderDetails.push({
                    "color": "",
                    "cloth": "",
                    "amount": "1",
                    "isLongSleeve": true
                });
            //如果没有短袖明细，加一条
            hasOrderDetail = false;
            for (var i = 0; i < $scope.order.orderDetails.length; i++) {
                if ($scope.order.orderDetails[i].isLongSleeve == false) {
                    hasOrderDetail = true;
                    break;
                }
            }
            if (!hasOrderDetail)
                $scope.order.orderDetails.push({
                    "color": "",
                    "cloth": "",
                    "amount": "1",
                    "isLongSleeve": false
                });
        });
    }

    $scope.clearSize = function (clearSizeName, clearSizes, resetEnlarge) {
        if (clearSizes) {
            $scope.order.neck = "";
            $scope.order.shoulder = "";
            $scope.order.fLength = "";
            $scope.order.bLength = "";
            $scope.order.chest = "";
            $scope.order.waist = "";
            $scope.order.lowerHem = "";
            $scope.order.lSleeveLength = "";
            $scope.order.lSleeveCuff = "";
            $scope.order.sSleeveLength = "";
            $scope.order.sSleeveCuff = "";
            $scope.order.chestEnlarge = "";
            $scope.order.waistEnlarge = "";
            $scope.order.lowerHemEnlarge = "";
        }

        if (clearSizeName) {
            $scope.order.sizeName = "";
            if ($scope.order.chestEnlarge == null || $scope.order.chestEnlarge == "")
                $scope.order.chestEnlarge = $scope.order.sex == "M" ? "15" : "10";

            if ($scope.order.waistEnlarge == null || $scope.order.waistEnlarge == "")
                $scope.order.waistEnlarge = $scope.order.sex == "M" ? "15" : "10";

            if ($scope.order.lowerHemEnlarge == null || $scope.order.lowerHemEnlarge == "")
                $scope.order.lowerHemEnlarge = $scope.order.sex == "M" ? "15" : "10";
        }

        if (resetEnlarge) {
            $scope.order.chestEnlarge = $scope.order.sex == "M" ? "15" : "10";
            $scope.order.waistEnlarge = $scope.order.sex == "M" ? "15" : "10";
            $scope.order.lowerHemEnlarge = $scope.order.sex == "M" ? "15" : "10";
        }

    };
    
    $scope.hasSizeName = function () {
        if ($scope.order.sizeName == null || $scope.order.sizeName == "")
            return false;
        else
            return true;
    };

    $scope.submit = function () {
        //var orderCloned = clone($scope.order);

        //if ($scope.hasLongSleeve == false) {
        //    for (var i = 0; i < orderCloned.orderDetails.length; i++) {
        //        if (orderCloned.orderDetails[i].isLongSleeve == true) {
        //            orderCloned.orderDetails.splice(i, 1);
        //            i--;
        //        }
        //    }
        //}

        //if ($scope.hasShortSleeve == false) {
        //    for (var i = 0; i < orderCloned.orderDetails.length; i++) {
        //        if (orderCloned.orderDetails[i].isLongSleeve == false) {
        //            orderCloned.orderDetails.splice(i, 1);
        //            i--;
        //        }
        //    }
        //}


        if ($scope.isCreate) {
            orderAPIService.createOrder($scope.order).then(function (resp) {
                $(".invalid_msg").text("");

                dialogService.showMention("1", "创建订单成功，可继续创建订单");
                $scope.order.employeeCode = "";
                $scope.order.name = "";
                $scope.order.age = "";
                $scope.order.height = "";
                $scope.order.weight = "";
                $scope.order.neck = "";
                $scope.order.shoulder = "";
                $scope.order.fLength = "";
                $scope.order.bLength = "";
                $scope.order.chest = "";
                $scope.order.waist = "";
                $scope.order.lowerHem = "";
                $scope.order.preSize = "B";
                $scope.order.lSleeveLength = "";
                $scope.order.lSleeveCuff = "";
                $scope.order.lPrice = "";
                $scope.order.sSleeveLength = "";
                $scope.order.sSleeveCuff = "";
                $scope.order.sPrice = "";
                $scope.order.memo = "";
                $scope.order.sizeName = "";
                $scope.order.chestEnlarge = $scope.order.sex == "M" ? "15" : "10";
                $scope.order.waistEnlarge = $scope.order.sex == "M" ? "15" : "10";
                $scope.order.lowerHemEnlarge = $scope.order.sex == "M" ? "15" : "10";
                
            });
        }
        else {
            orderAPIService.updateOrder($scope.order).then(function (resp) {
                //routeService.goParams("orders");
                opener.$("#ui_view").scope().refreshOrders();
                this.close();
            });
        }
    };

    $scope.addDetail = function (isLongSleeve, enable) {
        if (!enable)
            return;

        $scope.order.orderDetails.push({
            "color": "",
            "cloth": "",
            "amount": "1",
            "isLongSleeve": isLongSleeve
        });
    };

    $scope.isShowDelete = function (isLongSleeve) {
        var count = 0;
        for (var i = 0; i < $scope.order.orderDetails.length; i++) {
            if ($scope.order.orderDetails[i].isLongSleeve == isLongSleeve)
                count++;

            if (count == 2)
                return true;
        }
        
    };

    sizeAPIService.getDefaultSizeDetails().then(function (resp) {
        $scope.sizeDetails = resp.data;
    });

    $scope.deleteDetail = function (enable, detail) {
        if (!enable)
            return;

        var index = $scope.order.orderDetails.indexOf(detail);
        $scope.order.orderDetails.splice(index, 1);
    };

    $scope.isOrderDetailRequired = function (isLongSleeve) {
        
        //var hasSleeve = isLongSleeve ? $scope.order.hasLongSleeve : $scope.order.hasShortSleeve;

        var count = 0;
        //if (hasSleeve) {
            for (var i = 0; i < $scope.order.orderDetails.length; i++) {
                if ($scope.order.orderDetails[i].isLongSleeve == isLongSleeve)
                    count++;

                if (count == 2)
                    return true;
            }
        //}
        return false;
    };

}]);
