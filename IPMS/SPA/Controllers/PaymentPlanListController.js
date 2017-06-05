var PaymentPlanListController = function ($scope, Api, DTOptionsBuilder, DTColumnDefBuilder, $uibModal, $location) {
    $scope.allPlans = [];
    $scope.total_contract = 0;
    $scope.total_paid = 0;
    $scope.total_due = 0;

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('numbers');

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5).notSortable()
    ];


    Api.GetApiCall("IPMSQuery", "GetAllInstallmentPlan", function (event) {
        if (event.hasErrors == true) {
            $scope.setError(event.error);
        } else {
            $scope.allPlans = event.result.plans;
            
            $scope.total_contract = event.result.total_values[0];
            $scope.total_paid = event.result.total_values[1];
            $scope.total_due = event.result.total_values[0] - event.result.total_values[1];
        }
    });

    $scope.viewDetail = function (id) {
        $location.path('/payment_plan_details/' + id);
    }

    $scope.addNewPlan = function () {
        $location.path('/payment_plan_new');
    }

    $scope.dueMonth = function () {
        $location.path('/due_payments_month');
    }
}

PaymentPlanListController.$inject = ['$scope', 'Api', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$uibModal', '$location'];