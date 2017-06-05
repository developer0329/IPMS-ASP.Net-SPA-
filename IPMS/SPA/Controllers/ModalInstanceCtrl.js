var ModalInstanceCtrl = function ($scope, $uibModalInstance, items) {
    
    $scope.dueList = items;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'items'];