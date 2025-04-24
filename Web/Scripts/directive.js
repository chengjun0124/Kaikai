app.directive('validateClick', ["$rootScope", function ($rootScope) {
    return {
        scope: {
            validateClick: "&",
            panel: "@"
        },
        link: function (scope, element, attrs) {
            element.on("click", function () {
                $(".invalid_msg").text("");
                var inputs;
                var invalidMessages = [];
                var validations;
                var validation;
                var fieldName;
                var value;
                var mentionId;
                var regex;
                var validationSplit = "|||";
                var paramSplit = ":::";
                var decimal;
                var min;
                var max;
                var minLength
                var comparedValue;
                var mode;
                var forceCompare;
                var comparedFieldName;


                if (scope.panel != null && scope.panel != undefined)
                    inputs = $("#" + scope.panel + " [validation]");
                else
                    inputs = $("[validation]");

                for (var i = 0; i < inputs.length; i++) {
                    validations = $(inputs[i]).attr("validation").split(validationSplit);
                    fieldName = $(inputs[i]).attr("fieldName");
                    mentionId = $(inputs[i]).attr("mentionId");
                    value = $(inputs[i]).val();

                    for (var j = 0; j < validations.length; j++) {
                        validation = validations[j];

                        if (validation == "required") {
                            if (inputs[i].tagName.toLowerCase() == "select") {
                                if (inputs[i].selectedIndex == 0) {
                                    invalidMessages.push({
                                        message: "请选择" + fieldName,
                                        mentionId: mentionId
                                    });
                                    break;
                                }
                            }
                            else {
                                if (value.trim().length == 0) {
                                    invalidMessages.push({
                                        message: "请输入" + fieldName,
                                        mentionId: mentionId
                                    });
                                    break;
                                }
                            }
                        }

                        if (value.length > 0) {

                            if (validation.indexOf("pattern" + paramSplit) == 0) {
                                regex = new RegExp(validation.split(paramSplit)[1]);

                                if (!regex.test(value)) {
                                    invalidMessages.push({
                                        message: fieldName + validation.split(paramSplit)[2],
                                        mentionId: mentionId
                                    });
                                    break;
                                }
                            }


                            if (validation.indexOf("minlengh" + paramSplit) == 0) {
                                minLength = parseInt(validation.split(paramSplit)[1]);
                                if (value.length < minLength) {
                                    invalidMessages.push({
                                        message: fieldName + "必须大于" + minLength + "个字符",
                                        mentionId: mentionId
                                    });
                                    break;
                                }
                            }

                            if (validation.indexOf("number" + paramSplit) == 0) {
                                //number:::0
                                decimal = validation.split(paramSplit)[1];

                                if (decimal == "0") {
                                    if (!/^\d+$/.test(value)) {
                                        invalidMessages.push({
                                            message: fieldName + "必须是整数",
                                            mentionId: mentionId
                                        });
                                        break;
                                    }
                                }
                                else {

                                    //9999999, 99能过这个regex,需要research
                                    regex = new RegExp("^\\d+(.\\d{1," + decimal + "}){0,1}$");
                                    if (!regex.test(value)) {
                                        invalidMessages.push({
                                            message: fieldName + "必须是数字，且最多包含" + decimal + "位小数",
                                            mentionId: mentionId
                                        });
                                        break;
                                    }
                                }
                            }

                            if (validation.indexOf("range" + paramSplit) == 0) {
                                //range:::1-150
                                min = validation.split(paramSplit)[1].split("-")[0];
                                max = validation.split(paramSplit)[1].split("-")[1];
                                min = parseFloat(min);
                                max = parseFloat(max);
                                value = parseFloat(value);

                                if (value < min || value > max) {
                                    invalidMessages.push({
                                        message: fieldName + "必须在" + min + "-" + max + "之间",
                                        mentionId: mentionId
                                    });
                                    break;
                                }
                            }


                        }

                        //以下的比较验证器放在if (value.length > 0) 外部，因为有时候为空也需比较
                        if (validation.indexOf("compare" + paramSplit) == 0) {
                            //compare:txt_pwd:equal:true:密码
                            comparedValue = $("#" + validation.split(paramSplit)[1]).val();
                            mode = validation.split(paramSplit)[2];
                            forceCompare = validation.split(paramSplit)[3] == "true" ? true : false;
                            comparedFieldName = validation.split(paramSplit)[4];

                            if (forceCompare || value.length > 0) {
                                if (mode == "equal") {
                                    if (value != comparedValue) {
                                        invalidMessages.push({
                                            message: fieldName + "和" + comparedFieldName + "必须相等",
                                            mentionId: mentionId
                                        });
                                        break;
                                    }
                                }
                            }
                        }

                        if (validation.indexOf("oneisrequired" + paramSplit) == 0) {
                            //oneisrequired:::txt_xxx:::txt_xxx2:::后衣长和xxx
                            var hasValue = false;

                            if ($(inputs[i]).attr("type") == "checkbox") {
                                hasValue = inputs[i].checked;
                            }
                            else
                                hasValue = value.trim().length > 0

                            if (!hasValue) {
                                var params = validation.split(paramSplit);
                                //k从1开始，结束在length-1, 因为数组第一个是验证器的名字oneisrequired，最后一个是要比较的其他控件对应的字段名，比如“后衣长”
                                for (var k = 1; k < params.length - 1; k++) {
                                    var ele = $("#" + params[k]);

                                    if (ele.attr("type") == "checkbox") {
                                        if (ele[0].checked) {
                                            hasValue = true;
                                            break;
                                        }
                                    }
                                    else {
                                        if (ele.val().trim().length > 0) {
                                            hasValue = true;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (!hasValue) {
                                invalidMessages.push({
                                    message: fieldName + "和" + params[params.length - 1] + "至少填写一个",
                                    mentionId: mentionId
                                });
                                break;
                            }


                        }

                    }
                }


                for (var i = 0; i < invalidMessages.length; i++) {
                    $("#" + invalidMessages[i].mentionId).text(invalidMessages[i].message);
                }

                if (invalidMessages.length == 0) {
                    scope.validateClick();
                    $rootScope.$apply();
                }
            });
        }
    };
}]);


app.directive('enter', [function () {
    return {
        scope: {
            enter: "@"
        },
        link: function (scope, element, attrs) {
            element.keyup(function (e) {
                if (e.keyCode == 13) {
                    var inputs = $("input:enabled,textarea:enabled,select:enabled");
                    var nextElementIndex;

                    for (var i = 0; i < inputs.length; i++) {
                        if (inputs[i] == element[0]) {
                            nextElementIndex = i + 1;
                            break;
                        }
                    }

                    if (e.altKey) {
                        for (var i = nextElementIndex; i < inputs.length; i++) {
                            if (inputs[i].getAttribute("type") == "button") {
                                inputs[i].focus();
                                inputs[i].click();
                                break;
                            }
                        }
                    }
                    else {
                        var inputType;
                        inputType = inputs[nextElementIndex].getAttribute("type");
                        inputs[nextElementIndex].focus();

                        if (inputType == "button")
                            inputs[nextElementIndex].click();
                        else if (inputType == "text")
                            inputs[nextElementIndex].select();
                    }
                }
            });
        }
    };
}]);

//分页控件 http://www.cnblogs.com/cench/p/5373114.html
app.directive('tmPagination', [function () {
    return {
        restrict: 'EA',
        template: '<div class="page-list">' +
        '<ul class="pagination" ng-show="conf.totalItems > 0">' +
        '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
        '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
        'ng-click="changeCurrentPage(item)">' +
        '<span>{{ item }}</span>' +
        '</li>' +
        '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
        '</ul>' +
        '<div class="page-total" ng-show="conf.totalItems > 0">' +
        '第<input type="text" ng-model="jumpPageNum"  ng-keyup="jumpToPage($event)"/>页 ' +
        '每页<select ng-model="conf.itemsPerPage" ng-options="option for option in conf.perPageOptions " ng-change="changeItemsPerPage()"></select>' +
        '/共<strong>{{ conf.totalItems }}</strong>条' +
        '</div>' +
        '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
        '</div>',
        replace: true,
        scope: {
            conf: '='
        },
        link: function (scope, element, attrs) {
            // 变更当前页
            scope.changeCurrentPage = function (item) {
                if (item == '...') {
                    return;
                } else {
                    scope.conf.currentPage = item;
                }
            };

            // 定义分页的长度必须为奇数 (default:9)
            scope.conf.pagesLength = parseInt(scope.conf.pagesLength) ? parseInt(scope.conf.pagesLength) : 9;
            if (scope.conf.pagesLength % 2 === 0) {
                // 如果不是奇数的时候处理一下
                scope.conf.pagesLength = scope.conf.pagesLength - 1;
            }

            // conf.erPageOptions
            if (!scope.conf.perPageOptions) {
                scope.conf.perPageOptions = [10, 15, 20, 30, 50];
            }

            // pageList数组
            function getPagination() {
                // conf.currentPage
                scope.conf.currentPage = parseInt(scope.conf.currentPage) ? parseInt(scope.conf.currentPage) : 1;
                // conf.totalItems
                scope.conf.totalItems = parseInt(scope.conf.totalItems);

                // conf.itemsPerPage (default:15)
                // 先判断一下本地存储中有没有这个值
                if (scope.conf.rememberPerPage) {
                    if (!parseInt(localStorage[scope.conf.rememberPerPage])) {
                        localStorage[scope.conf.rememberPerPage] = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                    }

                    scope.conf.itemsPerPage = parseInt(localStorage[scope.conf.rememberPerPage]);


                } else {
                    scope.conf.itemsPerPage = parseInt(scope.conf.itemsPerPage) ? parseInt(scope.conf.itemsPerPage) : 15;
                }

                // numberOfPages
                scope.conf.numberOfPages = Math.ceil(scope.conf.totalItems / scope.conf.itemsPerPage);

                // judge currentPage > scope.numberOfPages
                if (scope.conf.currentPage < 1) {
                    scope.conf.currentPage = 1;
                }

                if (scope.conf.currentPage > scope.conf.numberOfPages) {
                    scope.conf.currentPage = scope.conf.numberOfPages;
                }

                // jumpPageNum
                scope.jumpPageNum = scope.conf.currentPage;

                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                var perPageOptionsLength = scope.conf.perPageOptions.length;
                // 定义状态
                var perPageOptionsStatus;
                for (var i = 0; i < perPageOptionsLength; i++) {
                    if (scope.conf.perPageOptions[i] == scope.conf.itemsPerPage) {
                        perPageOptionsStatus = true;
                    }
                }
                // 如果itemsPerPage在不在perPageOptions数组中，就把itemsPerPage加入这个数组中
                if (!perPageOptionsStatus) {
                    scope.conf.perPageOptions.push(scope.conf.itemsPerPage);
                }

                // 对选项进行sort
                scope.conf.perPageOptions.sort(function (a, b) { return a - b });

                scope.pageList = [];
                if (scope.conf.numberOfPages <= scope.conf.pagesLength) {
                    // 判断总页数如果小于等于分页的长度，若小于则直接显示
                    for (i = 1; i <= scope.conf.numberOfPages; i++) {
                        scope.pageList.push(i);
                    }
                } else {
                    // 总页数大于分页长度（此时分为三种情况：1.左边没有...2.右边没有...3.左右都有...）
                    // 计算中心偏移量
                    var offset = (scope.conf.pagesLength - 1) / 2;
                    if (scope.conf.currentPage <= offset) {
                        // 左边没有...
                        for (i = 1; i <= offset + 1; i++) {
                            scope.pageList.push(i);
                        }
                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    } else if (scope.conf.currentPage > scope.conf.numberOfPages - offset) {
                        scope.pageList.push(1);
                        scope.pageList.push('...');
                        for (i = offset + 1; i >= 1; i--) {
                            scope.pageList.push(scope.conf.numberOfPages - i);
                        }
                        scope.pageList.push(scope.conf.numberOfPages);
                    } else {
                        // 最后一种情况，两边都有...
                        scope.pageList.push(1);
                        scope.pageList.push('...');

                        for (i = Math.ceil(offset / 2) ; i >= 1; i--) {
                            scope.pageList.push(scope.conf.currentPage - i);
                        }
                        scope.pageList.push(scope.conf.currentPage);
                        for (i = 1; i <= offset / 2; i++) {
                            scope.pageList.push(scope.conf.currentPage + i);
                        }

                        scope.pageList.push('...');
                        scope.pageList.push(scope.conf.numberOfPages);
                    }
                }

                if (scope.conf.onChange) {
                    scope.conf.onChange();
                }
                scope.$parent.conf = scope.conf;
            }

            // prevPage
            scope.prevPage = function () {
                if (scope.conf.currentPage > 1) {
                    scope.conf.currentPage -= 1;
                }
            };
            // nextPage
            scope.nextPage = function () {
                if (scope.conf.currentPage < scope.conf.numberOfPages) {
                    scope.conf.currentPage += 1;
                }
            };

            // 跳转页
            scope.jumpToPage = function () {
                scope.jumpPageNum = scope.jumpPageNum.replace(/[^0-9]/g, '');
                if (scope.jumpPageNum !== '') {
                    scope.conf.currentPage = scope.jumpPageNum;
                }
            };

            // 修改每页显示的条数
            scope.changeItemsPerPage = function () {
                // 清除本地存储的值方便重新设置
                if (scope.conf.rememberPerPage) {
                    localStorage.removeItem(scope.conf.rememberPerPage);
                }
            };

            scope.$watch(function () {
                var newValue = scope.conf.currentPage + ' ' + scope.conf.totalItems + ' ';
                // 如果直接watch perPage变化的时候，因为记住功能的原因，所以一开始可能调用两次。
                //所以用了如下方式处理
                if (scope.conf.rememberPerPage) {
                    // 由于记住的时候需要特别处理一下，不然可能造成反复请求
                    // 之所以不监控localStorage[scope.conf.rememberPerPage]是因为在删除的时候会undefind
                    // 然后又一次请求
                    if (localStorage[scope.conf.rememberPerPage]) {
                        newValue += localStorage[scope.conf.rememberPerPage];
                    } else {
                        newValue += scope.conf.itemsPerPage;
                    }
                } else {
                    newValue += scope.conf.itemsPerPage;
                }
                return newValue;

            }, getPagination);

        }
    };
}]);


app.directive('customEnter', [function () {
    return {
        scope: {
            customEnter: "&"
        },
        link: function (scope, element, attrs) {
            element.keyup(function (e) {
                if (e.keyCode == 13) {
                    scope.customEnter();
                }
            });
        }
    };
}]);