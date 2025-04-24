(function () {

    app.factory("locationEx", ["$location", function ($location) {

        $location.queryString = function (query) {
            var value = $location.absUrl().match(new RegExp("[?&]" + query + "=([^#&]*)"));
            return value == null ? null : value[1];
        };

        return $location;
    }]);

    app.factory('routeService', ["$state", function ($state) {

        return {
            goParams: function (routeName, params) {
                $('html, body').scrollTop(0);

                $state.go(routeName, params, { reload: true });
            }
        };

    }]);

    app.factory('dialogService', ["ngDialog", "$rootScope", "routeService", function (ngDialog, $rootScope, routeService) {
        var uploadHandler;
        var mentionHandler;
        var receiveDataURLCallBack;

        window.closeUploadDialog = function () {
            uploadHandler.close();
        };

        window.receiveDataURL = function (dataURL) {
            uploadHandler.close();
            $rootScope.$apply(function () {
                receiveDataURLCallBack(dataURL);
            });

        };
        return {
            showMention: function (buttonCount, message, state, callback) {
                //if (!Array.isArray(messageList))
                //    messageList = [messageList];

                var mentionHandler = ngDialog.open({
                    template: $rootScope.dialogMentionTemplate,
                    plain: false,
                    showClose: false,
                    closeByEscape: false,
                    overlay: true,
                    className: "ngdialog-theme-mention",
                    closeByDocument: false,
                    controller: ["$scope", function ($scope) {
                        $scope.close = function () {
                            mentionHandler.close();
                            if (state)
                                routeService.goParams(state);
                        };
                        $scope.confirm = function () {
                            mentionHandler.close();
                            callback();
                            if (state)
                                routeService.goParams(state);
                        };
                    }],
                    data: { buttonCount: buttonCount, content: message }
                });
            },
            showUpload: function (w, h, callBack) {
                receiveDataURLCallBack = callBack;
                uploadHandler = ngDialog.open({
                    template: "<iframe src=\"photoclip/demo.html?w=" + w + "&h=" + h + "\"></iframe>",
                    plain: true,
                    showClose: false,
                    closeByEscape: true,
                    overlay: false,
                    className: "ngdialog-theme-upload",
                    closeByDocument: true
                });
            },
            showSycnOrderDetail: function (orders) {
                var sycnOrderDetailHandler = ngDialog.open({
                    template: $rootScope.dialogSyncOrderDetailTemplate,
                    plain: false,
                    showClose: false,
                    closeByEscape: false,
                    overlay: true,
                    className: "ngdialog-theme-syncorderdetail",
                    closeByDocument: true,
                    controller:["$scope", function ($scope) {
                        $scope.order = {};
                        $scope.order.hasLongSleeve = true;
                        $scope.order.hasShortSleeve = false;
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

                        $scope.deleteDetail = function (enable, detail) {
                            if (!enable)
                                return;

                            var index = $scope.order.orderDetails.indexOf(detail);
                            $scope.order.orderDetails.splice(index, 1);
                        };

                        $scope.isOrderDetailRequired = function (isLongSleeve) {
                            var count = 0;
                            for (var i = 0; i < $scope.order.orderDetails.length; i++) {
                                if ($scope.order.orderDetails[i].isLongSleeve == isLongSleeve)
                                    count++;

                                if (count == 2)
                                    return true;
                            }
                            return false;
                        };

                        $scope.sync = function () {
                            for (var i = 0; i < orders.length; i++) {
                                orders[i].hasLongSleeve = $scope.order.hasLongSleeve;
                                orders[i].hasShortSleeve = $scope.order.hasShortSleeve;
                                orders[i].orderDetails = clone($scope.order.orderDetails);
                            }
                            sycnOrderDetailHandler.close();
                        };
                    }]
                });
            }
        };
    }]);

    app.factory("storageService", [function () {
        return {
            set: function (key, value) {
                localStorage[key] = value;
            },
            get: function (key) {
                return localStorage[key];
            },
            setSession: function (key, value) {
                sessionStorage[key] = value;
            },
            getSession: function (key) {
                return sessionStorage[key];
            },
            removeSession: function (key) {
                delete sessionStorage[key];
            }
        };
    }]);

    app.factory('apiService', ["$http", "routeService", "ngDialog", "storageService", "locationEx", "dialogService", "$rootScope", function ($http, routeService, ngDialog, storageService, locationEx, dialogService, $rootScope) {
        var callAPICount = 0;
        var ngDialogHandle = null;

        function defaultAPIErrorHandler(error) {
            if (error.status == 500)
                routeService.goParams("error");
            else if (error.status == 404)
                routeService.goParams("error", { msg: encodeURIComponent("您请求的数据不存在，请返回首页重新浏览") });
            else if (error.status == 400) {
                $(".invalid_msg").text("");

                for (var i = 0; i < error.data.length; i++) {
                    var domId;

                    var m = error.data[i].id.match(/^(.+_)(\d+)$/);
                    if (m != null) {
                        domId = $rootScope.invalidMapping[m[1]];
                        domId = domId + m[2];
                    }
                    else
                        domId = $rootScope.invalidMapping[error.data[i].id];

                    $("#" + domId).text(error.data[i].message);
                }
            }
            else if (error.status == 401)
                routeService.goParams("login");
            else
                routeService.goParams("error");
            return false;
        };


        function promiseWrapper(p) {
            this.promise = p;

            this.then = function (success, customError) {
                var p = this.promise.then(function (resp) {
                    if (!resp) return false;

                    callAPICount--;
                    if (callAPICount == 0) {
                        ngDialogHandle.close();
                    }

                    var o = null;
                    if (success)
                        o = success(resp);

                    if (o instanceof promiseWrapper)
                        return o.promise;
                    else
                        return o;
                },
                function (error) {
                    callAPICount = 0;
                    ngDialogHandle.close();

                    if (customError == null)
                        defaultAPIErrorHandler(error);
                    else {
                        var o = customError(error);

                        if (o instanceof promiseWrapper)
                            return o.promise;
                        else
                            return o;
                    }
                }
                );
                return new promiseWrapper(p);
            };
        };

        return {
            call: function (method, path, params, responseType) {
                if (callAPICount == 0) {
                    ngDialogHandle = ngDialog.open({
                        template: "<div class=\"sk-circle\">" +
                                            "<div class=\"sk-circle1 sk-child\"></div>" +
                                            "<div class=\"sk-circle2 sk-child\"></div>" +
                                            "<div class=\"sk-circle3 sk-child\"></div>" +
                                            "<div class=\"sk-circle4 sk-child\"></div>" +
                                            "<div class=\"sk-circle5 sk-child\"></div>" +
                                            "<div class=\"sk-circle6 sk-child\"></div>" +
                                            "<div class=\"sk-circle7 sk-child\"></div>" +
                                            "<div class=\"sk-circle8 sk-child\"></div>" +
                                            "<div class=\"sk-circle9 sk-child\"></div>" +
                                            "<div class=\"sk-circle10 sk-child\"></div>" +
                                            "<div class=\"sk-circle11 sk-child\"></div>" +
                                            "<div class=\"sk-circle12 sk-child\"></div>" +
                                        "</div>",
                        className: "ngdialog-theme-loading",
                        plain: true,
                        showClose: false,
                        closeByEscape: false,
                        closeByDocument: false
                    });
                }
                callAPICount++;

                var token = storageService.getSession("jwt");
                var headers = {};
                if (token != null)
                    headers.Authorization = token;



                if (responseType == undefined)
                    responseType = "";

                var promise = $http({ url: $rootScope.APIURL + path, method: method, data: params, headers: headers, responseType: responseType });
                return new promiseWrapper(promise);
            }
        };
    }]);
})();