var app = angular.module("app", ["ui.router", "ngDialog"]);


app.run(["$rootScope", "$state", "storageService", "directiveInculdeHtmlTemplates", function ($rootScope, $state, storageService, directiveInculdeHtmlTemplates) {
    for (var i = 0; i < directiveInculdeHtmlTemplates.length; i++) {
        $rootScope[directiveInculdeHtmlTemplates[i].name] = directiveInculdeHtmlTemplates[i].templateUrl + "?d=" + directiveInculdeHtmlTemplates[i].digest;
    }


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var states = ["home", "order_edit", "orders", "summary", "users", "user_edit", "password", "sizes", "size_edit"];


        if (states.indexOf(toState.name) > -1) {
            if (!storageService.getSession("jwt")) {
                $state.go("login");
                event.preventDefault();
            }
        }
    });
}]);

app.config(["$stateProvider", "$urlRouterProvider", "htmlTemplates", function ($stateProvider, $urlRouterProvider, htmlTemplates) {
    for (var i = 0; i < htmlTemplates.length; i++) {
        $stateProvider.state(htmlTemplates[i].state, {
            url: htmlTemplates[i].url,
            templateUrl: htmlTemplates[i].templateUrl + "?d=" + htmlTemplates[i].digest,
            controller: htmlTemplates[i].controller
        });
    }
}]);
