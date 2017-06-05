var NewCustomerController = function ($scope, Api, $routeParams, $location) {

    $scope.customer = {
        id: "",
        name: "",
        office_tel: "",
        address: "",
        contact_person1: "",
        contact_tel1: "",
        contact_person2: "",
        contact_tel2: "",
        email:""
    };

    if (typeof $routeParams.customerId != "undefined") {
        $scope.customer.id = $routeParams.customerId
        if($scope.customer.id > 0){
            Api.PostApiCall("IPMSQuery", "GetOneCustomerById", { id: $scope.customer.id }, function (event) {
                if (event.hasErrors == true) {
                    //alert("Error Getting data: " + event.error);
                    $scope.setError(event.error);
                } else {
                    $scope.customer = event.result;
                }
            });
        }        
    }

    $scope.submitForm = function (isValid) {
        // check to make sure the form is completely valid
        if (isValid) {
            if (this.customer.id > 0)
            {
                Api.PostApiCall("IPMSQuery", "UpdateCustomer", this.customer, function (event) {
                    if (event.hasErrors == true) {
                        //alert("Error Getting data: " + event.error);
                        $scope.setError(event.error);
                    } else {
                        $location.path('/customers-list');
                        //$location.path('/payment_plan_new/' + event.result);
                    }
                });
            } else {
                Api.PostApiCall("IPMSQuery", "AddNewCustomer", this.customer, function (event) {
                    if (event.hasErrors == true) {
                        //alert("Error Getting data: " + event.error);
                        $scope.setError(event.error);
                    } else {
                        //$location.path('/customers-list');
                        $location.path('/payment_plan_new/' + event.result);
                    }
                });
            }            
        }
    };
    
    $scope.cancelBtn_Click = function () {
        $location.path('/customers-list');
    }
}

NewCustomerController.$inject = ['$scope', 'Api', '$routeParams', '$location'];