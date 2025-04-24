app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);


app.filter("null", [function () {
    return function (input, param1) {
        return input == null ? param1 : input;
    };
}]);

app.filter("toUserType", [function () {
    return function (input) {

        if (input == 1)
            return "系统管理员";

        if (input == 2)
            return "订单操作员";

    };
}]);
