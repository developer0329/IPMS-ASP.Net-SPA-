var LoginController = function ($scope, $rootScope, Api, $location) {

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.submitForm = function (isValid) {
        if (isValid) {
            Api.PostApiCall("IPMSQuery", "Login", $scope.user, function (event) {
                if (event.hasErrors == true) {
                    $scope.setError(event.error);
                } else {
                    if (event.result == "Success")
                    {
                        $rootScope.login = true;
                        $location.path("/dashboard");
                    }
                    else {
                        alert("Login Failed");
                    }
                }
            });
        }
    }
}

LoginController.$inject = ['$scope', '$rootScope', 'Api', '$location'];