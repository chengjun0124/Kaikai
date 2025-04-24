app.controller("orders", ["$scope", "orderAPIService", "routeService", "companyAPIService", "dialogService", "$location", function ($scope, orderAPIService, routeService, companyAPIService, dialogService, $location) {
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 20
    };
    $scope.searchParam = {};
    $scope.selectedCompany = null;
    $scope.companies=null;
    $scope.orders=null;


    companyAPIService.getCompanyOptions().then(function (resp) {
        $scope.companies = resp.data;
    });
    
    function getOrders() {
        orderAPIService.getOrders($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage, $scope.searchParam).then(function (resp) {
            $scope.paginationConf.totalItems = resp.data.recordCount;
            $scope.orders = resp.data.orders;
        });
    }

    $scope.refreshOrders = function () {
        getOrders();
    };


    $scope.search = function () {
        $scope.paginationConf.currentPage = 1;
        getOrders();
    };

    $scope.delete = function () {
        var ids = [];
        $("[name='chk_order_id']:checked").each(function (index, item) {
            ids.push($(item).val());
        });

        if (ids.length == 0) {
            dialogService.showMention(1, "请勾选要删除的订单");
            return;
        }

        dialogService.showMention(2, "确定要删除选中的订单吗？", null, function () {
            orderAPIService.deleteOrders(ids).then(function (resp) {
                $("#chk_all")[0].checked = false;
                getOrders();
            });
        });
    };

    $scope.sync = function () {
        var selectedOrders = [];
        $("[name='chk_order_id']").each(function (index, item) {
            if (item.checked)
                selectedOrders.push($scope.orders[index]);
        });

        if (selectedOrders.length == 0) {
            dialogService.showMention(1, "请勾选要同步的订单");
            return;
        }
        dialogService.showSycnOrderDetail(selectedOrders);
    };


    $scope.updatebatch = function () {
        var selectedOrders = [];
        $("[name='chk_order_id']").each(function (index, item) {
            if (item.checked)
                selectedOrders.push($scope.orders[index]);
        });

        if (selectedOrders.length == 0)
        {
            dialogService.showMention(1, "请勾选要保存的订单");
            return;
        }
        dialogService.showMention(2, "确定要保存选中的订单吗？", null, function () {
            orderAPIService.updateOrderDetailsBatch(selectedOrders).then(function (resp) {
                dialogService.showMention(1, "保存明细成功");
            });
        });
    };


    $scope.detail = function (id) {
        //routeService.goParams("order_edit", { orderId: id });
        window.open($location.$$absUrl.replace("orders", "order_edit/" + id));
    };

    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function () {
        $("#chk_all")[0].checked = false;
        if ($scope.paginationConf.currentPage == 0)
            return;
        getOrders();
    });

    $scope.changeCompany = function () {
        $scope.selectedCompany = null;

        var selectedValue=$("#sel_company").val();

        for (var i = 0; i < $scope.companies.length; i++) {
            if ($scope.companies[i].value == selectedValue) {
                $scope.selectedCompany = $scope.companies[i];
                return;
            }
        }
        
    };

    $scope.selectAll = function () {        
        var checked = $("#chk_all")[0].checked;

        $("[name='chk_order_id']").each(function (index, item) {
            item.checked = checked;
        });
    }
}]);
