'use strict';


App.factory('myFactory', ['$http', '$q', function($http, $q) {
    var getData = function() {
        return $http.get("http://localhost:3001/data")
            .then(function(response) {
                return response.data
            });
    };

    var getYearData = function(year, data) {
        var data = _.chain(data).filter(function(item) { return item.year == year; }).value();
        var summed_by_type = _(data).reduce(function(mem, d) {
            mem[d.product] = (mem[d.product] || 0) + d.revenue
            return mem
        }, {})
        var pairs = _(summed_by_type).map(function(v, k) { return { type: k, total: v } })
        return pairs;
    };

    var getProductData = function(product, data) {
        var deferred = $q.defer();
        var data = _.chain(data).filter(function(item) { return item.product == product; }).value();
        var summed_by_type = _(data).reduce(function(mem, d) {
            mem[d.country] = (mem[d.country] || 0) + d.revenue
            return mem
        }, {});
        deferred.resolve(summed_by_type);
        return deferred.promise;
    };
    return {
        getData: getData,
        getYearData: getYearData,
        getProductData: getProductData
    };
}]);