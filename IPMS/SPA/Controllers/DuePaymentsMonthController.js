var DuePaymentsMonthController = function ($scope, $rootScope, Api, DTOptionsBuilder, DTColumnDefBuilder) {

    $scope.search = {
        date: '',
        paid: ''
    };
    $scope.paidStatus = [
        { id: "1", status: "Unpaid Only" },
        { id: "2", status: "Paid Only" },
        { id: "3", status: "All" }
    ]
    $scope.searchDatePopup = false;
    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: '',
        minMode:'month',
        startingDay: 1
    };

    $scope.searchDatePopupOpen = function () {
        $scope.searchDatePopup = true;
    };

    $scope.format = 'MMM-yyyy';

    $scope.search.date = new Date();
    $scope.search.paid = $scope.paidStatus[0].id;
    $scope.total_due_amount = 0;
    $scope.dueList = [];

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('numbers');

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4)
    ];

    dataLoading($scope.search);

    $scope.submitForm = function (isValid) {
        if (isValid) {
            var search = $scope.search;
            dataLoading(search);
        }
    }

    function dataLoading(search) {
        Api.PostApiCall("IPMSQuery", "GetDuePaymentOfMonth", search, function (event) {
            if (event.hasErrors == true) {
                $scope.setError(event.error);
            } else {
                $scope.dueList = event.result;
                $scope.total_due_amount = 0;
                for(var i = 0; i < $scope.dueList.length; i++)
                {
                    $scope.total_due_amount = $scope.total_due_amount + $scope.dueList[i].due_amount;
                }
            }
        });
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

    function getSelectedDateString() {
        var m_names = new Array("Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec");

        var curr_date = $scope.search.date.getDate();
        var curr_month = $scope.search.date.getMonth();
        var curr_year = $scope.search.date.getFullYear();
        return m_names[curr_month] + " " + curr_year;
    }
    function getSelectedPaidStatusString() {
        var paid_status = "";
        for (var i = 0; i < $scope.paidStatus.length; i++) {
            if ($scope.search.paid == $scope.paidStatus[i].id) {
                paid_status = $scope.paidStatus[i].status;
                break;
            }
        }
        return paid_status;
    }

    $scope.printPdf = function () {
        var paid_status = getSelectedPaidStatusString();
        var dateString = getSelectedDateString();

        var docDefinition = {
            content: [
                {
                    image: imgData,
                    width: 100
                },
                {
                    text: 'Due payment of the month',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, -20, 0, 20]
                },
                {
                    alignment: 'justify',
                    columns: [
                        {

                            text: [
                                { text: 'Due Month:  ', style: 'label' },
                                { text: String(dateString), style: 'value' }
                            ]
                        },
                        {
                            text: [
                                { text: 'Pay Status:  ', style: 'label' },
                                { text: String(paid_status), style: 'value' }
                            ]
                        }
                    ],
                    style: 'data'
                },
                {
                    style: 'table',
                    table: {
                        widths: [100, 100, 100, '*', '*'],
                        headerRows: 1,
                        // keepWithHeaderRows: 1,
                        // dontBreakRows: true,
                        body: [
                                [
                                    { text: 'Due Date', style: 'tableHeader' },
                                    { text: 'Customer', style: 'tableHeader' },
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

        for (var i = 0; i < $scope.dueList.length; i++) {
            var row = [
                { style: "tableRow", text: String($scope.dueList[i].due_date) },
                { style: "tableRow", text: String($scope.dueList[i].customer) },
                { style: "tableRow", text: String($scope.dueList[i].paid_date) },
                { style: "tableRow", text: String($scope.dueList[i].due_amount) },
                { style: "tableRow", text: String($scope.dueList[i].paid_amount) }
            ];
            docDefinition.content[3].table.body.push(row);
        }

        pdfMake.createPdf(docDefinition).print();
    };
    $scope.exportCSV = function () {

        var csvContent = "data:text/csv;charset=utf-8,";

        var dataString = "Due payment of the month,\n\n";

        var dateString = getSelectedDateString();
        dataString = dataString + "Due Month," + dateString + ",\n";

        var paid_status = getSelectedPaidStatusString();
        dataString = dataString + "Pay Status," + paid_status + ",\n\n\n";

        dataString = dataString + "Due Date,Customer,Paid Date,Value,Paid Amount" + paid_status + ",\n";
        $scope.dueList.forEach(function (infoArray, index) {

            var row = infoArray.due_date + "," + infoArray.customer + "," + infoArray.paid_date + "," + infoArray.due_amount + "," + infoArray.paid_amount + "\n";
            dataString += row;

        });
        csvContent += dataString;

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Due_Payment_Month(" + dateString + ").csv");
        document.body.appendChild(link); // Required for FF

        link.click();
    }
}

DuePaymentsMonthController.$inject = ['$scope', '$rootScope', 'Api', 'DTOptionsBuilder', 'DTColumnDefBuilder'];