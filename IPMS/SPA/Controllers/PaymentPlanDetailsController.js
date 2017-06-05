var PaymentPlanDetailsController = function ($scope, $rootScope, Api, $routeParams, $location, DTOptionsBuilder, DTColumnDefBuilder, $http) {

    $scope.allDuePaidList = [];
    $scope.unpaid_num = 0;
    $scope.paid_num = 0;
    $scope.dueListLength = 0;

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('numbers');

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3)
    ];

    if (typeof $routeParams.planId != "undefined") {
        var planId = $routeParams.planId
        if (planId > 0) {
            Api.PostApiCall("IPMSQuery", "GetOneInstallmentPlanDetailById", { id: planId }, function (event) {
                if (event.hasErrors == true) {
                    //alert("Error Getting data: " + event.error);
                    $scope.setError(event.error);
                } else {
                    $scope.plan = event.result.plan;
                    $scope.plan.total_plan_amount = $scope.plan.invoice_amount - $scope.plan.down_payment;
                    $scope.plan.total_paid = event.result.paid_amount;
                    $scope.plan.total_unpaid = $scope.plan.total_plan_amount - event.result.paid_amount;
                    $scope.allDuePaidList = event.result.due_paid_list;
                    $scope.dueListLength = $scope.allDuePaidList.length;
                    $scope.paid_num = $scope.dueListLength - $scope.unpaid_num;
                    for (var i = 0; i < $scope.dueListLength; i++)
                    {
                        if($scope.allDuePaidList[i].paid_date == "Unpaid")
                        {
                            $scope.unpaid_num++;
                        }
                        $scope.paid_num = $scope.dueListLength - $scope.unpaid_num;
                    }
                }
            });
        }
    }
    
    var result = document.getElementById("logoImg");
    var element = angular.element(result);

    // files is a FileList object (similar to NodeList)
    var imgPath = element[0].src;
    var imgData = "";

    function convertFileToDataURLviaFileReader(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }

    var convertFunction = convertFileToDataURLviaFileReader;

    convertFunction(imgPath, function (base64Img) {
        imgData = base64Img;
    });
    $scope.printPdf = function () {       

        var docDefinition = {
            content: [
                {
                    image: imgData,
                    width: 100
                },
                {
                    text: 'Installment Plan Details',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, -20, 0, 20]
                },
                {
                    alignment: 'justify',
                    columns: [
                        {

                            text: [
                                { text: 'Customer:  ', style: 'label' },
                                { text: String($scope.plan.customer_name), style: 'value' }
                            ]
                        },
                        {
                            text: [
                                { text: 'Invoice No:  ', style: 'label' },
                                { text: String($scope.plan.invoice_no), style: 'value' }
                            ]
                        }
                    ],
                    style: 'data'
                },
                {
                    text: [
                           { text: 'Total Plan Amount:  ', style: 'label' },
                           { text: String($scope.plan.total_plan_amount), style: 'value' },
                           { text: '  (' + $scope.dueListLength + ' installments)', style: 'label' }
                    ],
                    style: 'data',
                },
                {
                    alignment: 'justify',
                    columns: [
                        {

                            text: [
                                { text: 'Total Paid: ', style: 'label' },
                                { text: String($scope.plan.total_paid), style: 'value' },
                                { text: '  (' + $scope.paid_num + ' installments)', style: 'label' },
                            ]
                        },
                        {
                            text: [
                                { text: 'Total Unpaid: ', style: 'label' },
                                { text: String($scope.plan.total_unpaid), style: 'value' },
                                { text: '  (' + $scope.unpaid_num + ' installments)', style: 'label' }
                            ]
                        }
                    ],
                    style: 'data'
                },
                {
                    text: [
                        { text: 'Device:  ', style: 'label' },
                        { text: String($scope.plan.device_model), style: 'value' }

                    ],
                    style: 'data',
                },
                {
                    style: 'table',
                    table: {
                        widths: [100, 100, '*', '*'],
                        headerRows: 1,
                        // keepWithHeaderRows: 1,
                        // dontBreakRows: true,
                        body: [
                                [
                                    { text: 'Due Date', style: 'tableHeader' },
                                    { text: 'Paid Date', style: 'tableHeader' },
                                    { text: 'Value', style: 'tableHeader' },
                                    { text: 'Paid Amount', style: 'tableHeader' }
                                ]
                        ]
                    }
                },
            ],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'justify'
                },
                data: {
                    margin: [0, 10, 0, 10]
                },
                label: {
                    fontSize: 10
                },
                value: {
                    fontSize: 12,
                    bold: true

                },
                table: {
                    margin: [0, 20, 0, 10]
                },
                tableRow: {
                    alignment: 'center'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black',
                    alignment: 'center'
                }
            },
            defaultStyle: {
                columnGap: 20,
            }
        };
       
        for(var i = 0; i < $scope.allDuePaidList.length; i++)
        {
            var row = [
                {style:"tableRow", text: String($scope.allDuePaidList[i].due_date)},
                {style:"tableRow", text: String($scope.allDuePaidList[i].paid_date)},
                {style:"tableRow", text: String($scope.allDuePaidList[i].due_value)},
                {style:"tableRow", text: String($scope.allDuePaidList[i].paid_value)}
            ];
            docDefinition.content[6].table.body.push(row);
        }
        
        pdfMake.createPdf(docDefinition).print();
    };
}

PaymentPlanDetailsController.$inject = ['$scope', '$rootScope', 'Api', '$routeParams', '$location', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$http'];