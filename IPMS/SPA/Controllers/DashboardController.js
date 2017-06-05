var DashboardController = function ($scope, Api, $timeout, $q, $log, $location, $uibModal, DTOptionsBuilder, DTColumnDefBuilder) {
    $scope.searchValue = {
        customer_id: "",
        invoice_no: ""
    };

    $scope.simulateQuery = false;
    $scope.isDisabled = false;

    $scope.customers = [];
    $scope.invoices = [{ plan_id: "Empty", invoice_no: "No Plan" }];

    $scope.querySearch = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange = searchTextChange;
    $scope.total_due_amount  = 0;
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
        if (typeof item == "undefined")
        {
            $scope.searchValue.customer_id = 0;            
        }
        else
        {
            $scope.searchValue.customer_id = item.value;
        }
        loadInvoiceData($scope.searchValue.customer_id);
    }

    function loadAllCustomer() {

        Api.GetApiCall("IPMSQuery", "GetAllCustomer", function (event) {

            if (event.hasErrors == true) {
                //alert("Error Getting Locations: " + event.error);
                $scope.setError(event.error);
            } else {
                var allCustomers = event.result;
                for (var i = 0; i < allCustomers.length; i++) {
                    $scope.customers.push({ value: allCustomers[i].id, display: allCustomers[i].name });
                }
            }
        });
    }


    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: '',
        startingDay: 1
    };

    $scope.paidDateOpen = function (idx) {
        $scope.dueList[idx].paidDateOpened = true;
    };

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(customer) {
            return (customer.display.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }

    function loadInvoiceData(customerID) {
        if (customerID == null || typeof customerID == "undefined")
            customerID = 0;

        Api.PostApiCall("IPMSQuery", "GetInvoiceListByCustomerID", { id: customerID }, function (event) {
            if (event.hasErrors == true) {
                //alert("Error Getting data: " + event.error);
                $scope.setError(event.error);
            } else {
                $scope.invoices = [{ plan_id: "Empty", invoice_no: "No Plan" }];
                if (event.result.length > 0) {
                    for (var i = 0; i < event.result.length; i++) {
                        $scope.invoices.push(event.result[i]);
                    }
                }
                $scope.invoice_no = $scope.invoices[0].plan_id;

            }
        });
    }

    loadAllCustomer();
    loadInvoiceData();

    $scope.searchBtn_Clicked = function () {
        $scope.searchValue.invoice_no = $scope.invoice_no;
        if ($scope.searchValue.invoice_no == "" && $scope.searchValue.customer_id == "") {
            return;
        }
        else {
            if ($scope.searchValue.customer_id == "")
                customerID = 0;
            else
                customerID = $scope.searchValue.customer_id;
            
            Api.PostApiCall("IPMSQuery", "GetDueInfoByCustomerIDAndInovice", { customer_id: customerID, invoice_no: $scope.invoice_no }, function (event) {
                if (event.hasErrors == true) {
                    //alert("Error Getting data: " + event.error);
                    $scope.setError(event.error);
                } else {
                    $scope.dueList = event.result;
                    $scope.total_due_amount = 0;
                    for (var i = 0; i < $scope.dueList.length; i++) {
                        $scope.total_due_amount = $scope.total_due_amount + $scope.dueList[i].due_amount;
                        if ($scope.dueList[i].paid_amount >= $scope.dueList[i].due_amount) {
                            $scope.dueList[i].complete = false;
                        }
                        else {
                            $scope.dueList[i].complete = true;
                        }
                    }
                }
            });
        }
    }

    $scope.paymentPlanDetail = function () {
        if($scope.searchValue.invoice_no > 0)
        {
            $location.path('/payment_plan_details/' + $scope.searchValue.invoice_no);
        }
    }

    $scope.dueList = [];
    $scope.new_paid_date = [];
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('numbers');

    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6),
        DTColumnDefBuilder.newColumnDef(7).notSortable()
    ];

    $scope.payButtonClicked = function (id, index) {

        var el = document.getElementById("valueInput_" + id);
        var element = angular.element(el);

        // files is a FileList object (similar to NodeList)
        var value = +element[0].value;
        if (value > 0)
        {
            var paid_amount = value + $scope.dueList[index].paid_amount;
            var paid_date = $scope.new_paid_date[index];

            Api.PostApiCall("IPMSQuery", "UpdateDuePaymentMonthRow", { id: id, paid_amount: paid_amount, paid_date:paid_date }, function (event) {
                if (event.hasErrors == true) {
                    //alert("Error Getting data: " + event.error);
                    $scope.setError(event.error);
                } else {
                    if (event.result != null)
                    {
                        $scope.dueList[index].paid_amount = event.result.value;
                        $scope.dueList[index].paid_date = event.result.date;
                        angular.element(el).val("");
                    }
                    
                }
            });
        }
        else
        {
            alert("Invalid Number!!!");
        }
    }
    
    Api.PostApiCall("IPMSQuery", "GetDueInfoByCustomerIDAndInovice", { customer_id: "0", invoice_no: $scope.invoice_no }, function (event) {
        if (event.hasErrors == true) {
            //alert("Error Getting data: " + event.error);
            $scope.setError(event.error);
        } else {
            var arr = event.result;
            $scope.total_due_amount = 0;
            for (var i = 0; i < arr.length; i++) {

                 $scope.total_due_amount = $scope.total_due_amount + arr[i].due_amount;
                 $scope.new_paid_date.push(new Date());
                 if (arr[i].paid_amount >= arr[i].due_amount) {
                     arr[i].complete = false;

                     //arr[i].new_paid_date = new Date();
                     arr[i].paidDateOpened = false;
                }
                else {
                     arr[i].complete = true;
                }
            }

             $scope.dueList = arr;
        }
    });

    $scope.viewCustomer = function (id) {
        $location.path('/customers-new/' + id);
    }

    $scope.viewDetail = function (id) {
        $location.path('/payment_plan_details/' + id);
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

    function getSelectedCustomerName(){
        var customer_name = "";
        if ($scope.searchValue.customer_id != "")
        {
            for(var i = 0; i < $scope.customers.length; i++)
            {
                if ($scope.customers[i].value == $scope.searchValue.customer_id)
                {
                    customer_name = $scope.customers[i].display;
                    break;
                }
                    
            }
        }
        return customer_name;
    }
    function getSelectedInvoiceName() {
        var inovice_no = "";
        if ($scope.invoice_no != "Empty") {
            for (var i = 0; i < $scope.invoices.length; i++) {
                if ($scope.invoice_no == $scope.invoices[i].plan_id) {
                    inovice_no = $scope.invoices[i].invoice_no;
                    break;
                }
            }
        }
        return inovice_no;
    }
    $scope.printPdf = function () {
        
        var customer_name = getSelectedCustomerName();
        var inovice_no = getSelectedInvoiceName();
        
        var docDefinition = {
            content: [
                {
                    image: imgData,
                    width: 100
                },
                {
                    text: 'Customer Due Payments',
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
                                { text: String(customer_name), style: 'value' }
                            ]
                        },
                        {
                            text: [
                                { text: 'Invoice No:  ', style: 'label' },
                                { text: String(inovice_no), style: 'value' }
                            ]
                        }
                    ],
                    style: 'data'
                },
                {
                    style: 'table',
                    table: {
                        widths: ['auto', '*', 'auto', 'auto', '*', 'auto', 'auto'],
                        headerRows: 1,
                        // keepWithHeaderRows: 1,
                        // dontBreakRows: true,
                        body: [
                                [
                                    { text: 'Serial', style: 'tableHeader' },
                                    { text: 'Due Date', style: 'tableHeader' },
                                    { text: 'Invoice ID', style: 'tableHeader' },
                                    { text: 'Customer', style: 'tableHeader' },
                                    { text: 'Paid Date', style: 'tableHeader' },
                                    { text: 'Paid Amount', style: 'tableHeader' },
                                    { text: 'Due Amount', style: 'tableHeader' }
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
                    fontSize: 12,
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
                columnGap: 10,
            }
        };

        var total_paid_amount = 0;
        var total_due_amount = 0;

        for (var i = 0; i < $scope.dueList.length; i++) {
            var row = [
                { style: "tableRow", text: String($scope.dueList[i].serial) },
                { style: "tableRow", text: String($scope.dueList[i].due_date) },
                { style: "tableRow", text: String($scope.dueList[i].invoice_id) },
                { style: "tableRow", text: String($scope.dueList[i].customer_name) },
                { style: "tableRow", text: String($scope.dueList[i].paid_date) },
                { style: "tableRow", text: String($scope.dueList[i].paid_amount) },
                { style: "tableRow", text: String($scope.dueList[i].due_amount) }
            ];

            total_paid_amount = total_paid_amount + $scope.dueList[i].paid_amount;
            total_due_amount = total_due_amount + $scope.dueList[i].due_amount;

            docDefinition.content[3].table.body.push(row);
        }

        var row = [
                { style: "tableRow", text: "" },
                { style: "tableRow", text: "" },
                { style: "tableRow", text: "" },
                { style: "tableRow", text: "" },
                { style: "tableRow", text: ""},
                { style: "tableRow", text: "Total Due Amount" },
                { style: "tableRow", text: String(total_due_amount) }
        ];
        docDefinition.content[3].table.body.push(row);

        pdfMake.createPdf(docDefinition).print();
    }

    $scope.exportCSV = function () {
        var csvContent = "data:text/csv;charset=utf-8,";

        var dataString = "Customer Due Payments,\n\n";

        var customer_name = getSelectedCustomerName();
        var inovice_no = getSelectedInvoiceName();

        dataString = dataString + "Custmer:," + customer_name + ",,Invoice No:," + inovice_no + ",\n\n\n";

        dataString = dataString + "Serial,Due Date,Invoice ID,Customer,Paid Date,Paid Amount,Due Amount" + ",\n";

        var total_paid_amount = 0;
        var total_due_amount = 0;

        $scope.dueList.forEach(function (infoArray, index) {

            var row = infoArray.serial + ","
                + infoArray.due_date + ","
                + infoArray.invoice_id + ","
                + infoArray.customer_name + ","
                + infoArray.paid_date + ","
                + infoArray.paid_amount + ","
                + infoArray.due_amount + "\n";
            dataString += row;

            total_paid_amount = total_paid_amount + infoArray.paid_amount;
            total_due_amount = total_due_amount + infoArray.due_amount;

        });

        dataString = dataString + ",,,,,Total Due Amount," + total_due_amount + ",\n";

        csvContent += dataString;

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);

        var currentdate = new Date();
        var datetime = currentdate.getDate() + "-"
                        + (currentdate.getMonth() + 1) + "-"
                        + currentdate.getFullYear();

        link.setAttribute("download", "Customer Due Payments(" + datetime + ").csv");
        document.body.appendChild(link); // Required for FF

        link.click();
    }
}

DashboardController.$inject = ['$scope', 'Api', '$timeout', '$q', '$log', '$location', '$uibModal', 'DTOptionsBuilder', 'DTColumnDefBuilder'];