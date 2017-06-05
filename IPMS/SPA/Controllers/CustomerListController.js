var CustomerListController = function ($scope, Api, DTOptionsBuilder, DTColumnDefBuilder, $uibModal, $location) {

    $scope.allCustomers = [];

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('numbers');

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];


    Api.GetApiCall("IPMSQuery", "GetAllCustomer", function (event) {

        if (event.hasErrors == true) {
            //alert("Error Getting Locations: " + event.error);
            $scope.setError(event.error);
        } else {
            $scope.allCustomers = event.result;
        }
    });

    $scope.viewCustomer = function (id) {
        $location.path('/customers-new/' +id);
    }

    $scope.editCustomer = function (id) {
        $location.path('/customers-new/' + id );
    }

    $scope.deleteCustomer = function (idx) {

        var customer = $scope.allCustomers[idx];

        //var modalInstance = $modal.open({
        //    templateUrl: 'views/super/deleteuser.html',
        //    size: 'sm',
        //    controller: ModalInstanceCtrl,
        //    resolve: {
        //        items: function () {
        //            return $scope.items;
        //        }
        //    }
        //});

        //modalInstance.result.then(function (selectedItem) {
            Api.PostApiCall("IPMSQuery", "DeleteCustomerById", { id: customer.id }, function (event) {
                if (event.hasErrors == true) {
                    //alert("Error Getting data: " + event.error);
                    $scope.setError(event.error);
                } else {
                    $scope.allCustomers.splice(idx, 1);
                }
            });
        //}, function () {

        //});
    }

    $scope.addCustomer = function () {
        $location.path("/customers-new/");
    }

}

CustomerListController.$inject = ['$scope', 'Api', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$uibModal', '$location'];