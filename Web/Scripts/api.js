(function () {
    app.factory('authAPIService', ["apiService", function (apiService) {
        return {
            auth: function (userName, password) {
                return apiService.call("get", "auth/" + userName + "/" + password);
            }
        };
    }]);

    app.factory('orderAPIService', ["apiService", function (apiService) {
        return {
            getOrder: function (orderId) {
                return apiService.call("get", "order/" + orderId);
            },
            getOrders: function (pageNumber, pageSize, json) {
                return apiService.call("put", "order/" + pageNumber + "/" + pageSize, json);

            },
            updateOrder: function (json) {
                return apiService.call("put", "order", json);
            },
            createOrder: function (json) {
                return apiService.call("post", "order", json);
            },
            deleteOrders: function (ids) {
                return apiService.call("put", "order/delete", ids);
            },
            updateOrderDetailsBatch: function (orders) {
                return apiService.call("put", "order/updateorderdetailsbatch", orders);
            }
        };
    }]);

    app.factory('companyAPIService', ["apiService", function (apiService) {
        return {
            getCompanyOptions: function () {
                return apiService.call("get", "company/options");
            },
            getCompanies: function () {
                return apiService.call("get", "company");
            }
        };
    }]);
    app.factory('sizeAPIService', ["apiService", function (apiService) {
        return {
            getSizes: function () {
                return apiService.call("get", "size");
            },
            getSizesPagination: function (pageNumber, pageSize) {
                return apiService.call("get", "size/" + pageNumber + "/" + pageSize);
            },
            deleteSize: function (sizeId) {
                return apiService.call("delete", "size/" + sizeId);
            },
            getSize: function (sizeId) {
                return apiService.call("get", "size/" + sizeId);
            },
            updateSize: function (json) {
                return apiService.call("put", "size", json);
            },
            createSize: function (json) {
                return apiService.call("post", "size", json);
            },
            getDefaultSizeDetails: function () {
                return apiService.call("get", "size/defaultsizedetails");
            }
        };
    }]);

    app.factory('exportAPIService', ["apiService", function (apiService) {
        return {
            "export": function (company, manSizeId, womanSizeId) {
                return apiService.call("get", "export/" + company + "/" + manSizeId + "/" + womanSizeId, null, "arraybuffer");
            }
        };
    }]);

    app.factory('passwordAPIService', ["apiService", function (apiService) {
        return {
            "updatePassword": function (json) {
                return apiService.call("put", "password", json);
            }
        };
    }]);

    app.factory('userAPIService', ["apiService", function (apiService) {
        return {
            "getUser": function (userId) {
                return apiService.call("get", "user/" + userId);
            },
            "createUser": function (json) {
                return apiService.call("post", "user", json);
            },
            "updateUser": function (json) {
                return apiService.call("put", "user", json);
            },
            "getUsers": function (pageNumber, pageSize) {
                return apiService.call("get", "user/" + pageNumber + "/" + pageSize);
            },
            "deleteUser": function (id) {
                return apiService.call("delete", "user/" + id);
            }
        };
    }]);
})();