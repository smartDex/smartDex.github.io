//
//Exchange Market Controller
routerApp.controller('marketCtrl', ['$scope', '$http', '$stateParams', 'config', '$location', 'MarketData', '$rootScope',
    function ($scope, $http, $stateParams, config, $location, MarketData, $rootScope) {
        //Base value Setting
        // $rootScope.quoteTokenAddr = '';
        $rootScope.quoteTokenId = $stateParams.Id;
        $scope.user_address = $.session.get('user_addr');
        $scope.tradeHistory = [];
        $scope.tokenList = [];
        $scope.ticker = []; // To store market ticker data
        $scope.orderbook = []; //To store market OrderBook
        var curDate = new Date();
        $scope.endDate = curDate.toISOString();
        $scope.startDate = MarketData.prevDate().toISOString();
        $(".loading").show();
        $http({
            url: '/api/getTokenInfo/' + $stateParams.Id,
            type: 'GET'
        }).then(function (res) {
            // console.log(res.data[0]);
            var result = res.data[0];
            $rootScope.quoteTokenAddr = result.token_address;
            MarketData.GetChartData(config.NetworkId, config.BASE_TOKEN_ADDRESS, $rootScope.quoteTokenAddr, $scope.startDate, $scope.endDate)
                .then(function (res) {
                var chartData = [];
                var result = res.data;
                // console.log(result.length);
                if (res) {
                    for (var i = 0; i < result.length; i++) {
                        // console.log($filter('date')(result[i].date, 'yyyy-mm-dd hh:mm:ss'));
                        var dd = new Date(result[i].date);
                        dd.setDate(dd.getDate() + i);
                        chartData[i] = ({
                            date: dd,
                            open: result[i].open,
                            close: result[i].close,
                            high: result[i].high,
                            low: result[i].low,
                            volume: result[i].volume,
                            value: result[i].low
                        });
                    }
                    // console.log(chartData);
                    MarketData.drawChart(chartData);
                    $('.loading').hide();
                }
                else {
                    $('.loading').hide();
                }
            }).catch(function (err) {
                console.log(err);
                $('.loading').hide();
            });
        }, function (err) {
            console.log(err);
        });
        // //Get Coinbase Address
        // ZeroService.exchange.getContractAddressAsync().then(function(result){
        //   console.log(result);
        // });
        // console.log($scope.address);
        MarketData.getBalance('ZRX', "0x627306090abaB3A6e1400e9345bC60c78a8BEf57").then(function (res) {
            if (res.status == 'ok') {
                console.log(res.result);
            }
        });
        // Get Token Lists from Server
        MarketData.GetTokenLists().then(function (res) {
            // console.log(res.data);
            $scope.tokenList = res.data;
        });
        // Get Market Overview data
        MarketData.GetTickerData($stateParams.Id)
            .then(function (data) {
            //   console.log(data);
            var r = data.data;
            //   iterate return data
            for (var i = 0; i < r.length; i++) {
                //if ticker.symbol is equal to given market token
                if (r[i].symbol == $stateParams.Id) {
                    //Store Ticker data into ticker
                    $scope.ticker = r[i];
                }
            }
            // console.log($scope.ticker);
        }).catch(function (data) {
            console.log('error in Get Ticker Data' + data);
        });
        // Get TradeHistory
        MarketData.GetTradeHistory(config.NetworkId).then(function (res) {
            //   console.log(res.data);
            $scope.tradeHistory = res.data;
        });
        $scope.sel_market = function (token) {
            // console.log(token);
            var url = "/market/" + config.BASE_TOKEN + "/" + token;
            $location.path(url);
        };
        // $("#user_addr").text($.session.get('user_addr').slice(0, 10) + '...');
    }
]);
