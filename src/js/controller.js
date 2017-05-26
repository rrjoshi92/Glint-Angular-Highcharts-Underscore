'use strict';

App.controller('homeController', ['$scope', 'myFactory', function($scope, myFactory) {
    var data;

    //return _.chain(response.data).map(function(item) { return item.year; }).uniq().value();
    myFactory.getData().then(function(response) {
        data = response;
        console.log(data);

        $scope.years = _.chain(data).map(function(item) { return item.year; }).uniq().value();;
    });
    $scope.yearchange = function() {
        $("#grid").hide();
        $scope.chartdata = myFactory.getYearData($scope.year, data);
        // $scope.chartdata = data;
        var values = [];
        _.each($scope.chartdata, function(item) {
            values.push({
                name: item.type,
                y: item.total
            })
        })
        Highcharts.chart('container', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: 'Product market shares ' + $scope.year
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                },
                series: {
                    events: {
                        click: function(event) {
                            $scope.product = event.point.name;
                            myFactory.getProductData($scope.product, data).then(function(Response) {
                                $scope.gridData = Response;
                                var sum = Object.values(Response).reduce(function(a, b) {
                                    return a + b;
                                }, 0);
                                console.log(Object.values(Response).length)
                                $scope.avg = sum / Object.values(Response).length;
                                $("#grid").show();
                            });

                        }
                    }
                }
            },
            series: [{
                name: 'Products',
                colorByPoint: true,
                data: values
            }]
        });
    };
}]);