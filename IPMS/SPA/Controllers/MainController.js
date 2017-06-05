var MainController = function ($scope, $rootScope, Api, $location) {
    if(!$rootScope.login)
        $location.path("/login");
}

MainController.$inject = ['$scope', '$rootScope','Api', '$location'];