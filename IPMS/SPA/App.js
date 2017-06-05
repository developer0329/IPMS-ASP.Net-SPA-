var App = angular.module('IPMS', ['ngRoute', 'ui.bootstrap', 'datatables', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']);

App.service('Api', ['$http', ApiService]);

App.controller('MainController', MainController);
App.controller('ModalInstanceCtrl', ModalInstanceCtrl);

App.controller('PaymentPlanListController', PaymentPlanListController);
App.controller('PaymentPlanNewController', PaymentPlanNewController);
App.controller('PaymentPlanDetailsController', PaymentPlanDetailsController);

App.controller('NewCustomerController', NewCustomerController);
App.controller('CustomerListController', CustomerListController);
App.controller('DuePaymentsMonthController', DuePaymentsMonthController);
App.controller('LoginController', LoginController);

var configFunction = function ($routeProvider, $httpProvider) {
    $routeProvider.
        when("/login", {
            templateUrl: "SPA/Views/Login.html",
            controller: LoginController
        })
        .when("/dashboard", {
            templateUrl: "SPA/Views/Dashboard.html",
            controller: DashboardController
        })
        .when("/payment_plan_list", {
            templateUrl: "SPA/Views/PaymentPlan-List.html",
            controller: PaymentPlanListController
        })
        .when("/payment_plan_new/:customerId?/", {
            templateUrl: "SPA/Views/PaymentPlan-New.html",
            controller: PaymentPlanNewController
        })
        .when("/payment_plan_details/:planId?/", {
            templateUrl: "SPA/Views/PaymentPlan-Details.html",
            controller: PaymentPlanDetailsController
        })
        .when("/customers-list", {
            templateUrl: "SPA/Views/Customers-List.html",
            controller: CustomerListController
        })
        .when("/customers-new/:customerId?/", {
            templateUrl: "SPA/Views/Customers-New.html",
            controller: NewCustomerController
        })
        .when("/due_payments_month", {
            templateUrl: "SPA/Views/DuePaymentsMonth.html",
            controller: DuePaymentsMonthController
        })
        .otherwise({
            redirectTo: function () {
                return "/login";
            }
        })
}

configFunction.$inject = ["$routeProvider", "$httpProvider"];

App.config(configFunction);

App.run(function ($rootScope) {
    $rootScope.login = false;
});