var PaymentPlanNewController = function ($scope, Api, $timeout, $q, $log, $location, $uibModal, $document, $routeParams) {

    var selCustomer = 0;
    if (typeof $routeParams.customerId != "undefined") {
        selCustomer = $routeParams.customerId;
    }

    $scope.plan = {
        id: "",
        invoice_no: "",
        contract_date: "",
        customer_id: "",
        device_model: "",
        serial_no: "",
        invoice_amount: "",
        down_payment: "",
        schedule: "",
        notes: "",
        installment_no: "",
        installment_amount: "",
        first_installment_due_date: ""
    }

    $scope.schedules = [
        {id:"1", schedule:"Monthly"},
        {id:"2", schedule:"Every 3 months"},
        {id:"3", schedule:"Every 6 months"},
        {id:"4", schedule:"Annually"}
    ];
    $scope.plan.schedule = $scope.schedules[0].id;

    $scope.simulateQuery = false;
    $scope.isDisabled = false;
    $scope.customers = [];
    
    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;

    function querySearch(query) {
        var results = query ? $scope.customers.filter(createFilterFor(query)) : $scope.customers,
            deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        $scope.plan.customer_id = item.value;
    }

    function loadAllCustomer() {

        Api.GetApiCall("IPMSQuery", "GetAllCustomer", function (event) {

            if (event.hasErrors == true) {
                //alert("Error Getting Locations: " + event.error);
                $scope.setError(event.error);
            } else {
                var allCustomers = event.result;
                for (var i = 0; i < allCustomers.length; i++) {
                    var customer = { value: allCustomers[i].id, display: allCustomers[i].name };
                    $scope.customers.push(customer);
                    if (selCustomer > 0 && customer.value == selCustomer)
                    {
                        $scope.selectedItem = customer;
                    }
                }
                
            }
        });
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(customer) {            
            return (customer.display.toLowerCase().indexOf(lowercaseQuery) === 0);
        };

    }

    loadAllCustomer();

    
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: '',
        startingDay: 1
    };

    $scope.contractDateOpen = function () {
        $scope.contractDatePopup.opened = true;
    };
    $scope.dueDateOpen = function () {
        $scope.dueDatePopup.opened = true;
    };

    $scope.format = 'yyyy-MMMM-dd';

    $scope.contractDatePopup = {
        opened: false
    };
    $scope.dueDatePopup = {
        opened: false
    };

    $scope.plan.contract_date = new Date();
    $scope.plan.first_installment_due_date = new Date();

    
    $scope.addNewCustomer = function () {
        $location.path("/customers-new/");
    }

    $scope.dueList = [];
    $scope.submitForm = function (isValid) {        
        if (isValid) {
            var plan = $scope.plan;
            if (plan.customer_id > 0) {

                Api.PostApiCall("IPMSQuery", "ConfirmPaymentPlan", plan, function (event) {
                    if (event.hasErrors == true) {
                        $scope.setError(event.error);
                    } else {
                        $scope.dueList = event.result;
                        confirmModalOpen(plan);
                    }
                });
            }
        }
    }

    function confirmModalOpen(plan) {

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'planConfirmModal.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                items: function () {
                    return $scope.dueList;
                }
            }
        });

        modalInstance.result.then(function () {
            Api.PostApiCall("IPMSQuery", "AddNewPaymentPlan", plan, function (event) {
                if (event.hasErrors == true) {
                    $scope.setError(event.error);
                } else {
                    $location.path('/dashboard');
                }
            });

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}

PaymentPlanNewController.$inject = ['$scope', 'Api', '$timeout', '$q', '$log', '$location', '$uibModal', '$document', '$routeParams'];