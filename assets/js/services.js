// import { ZeroEx } from "0x.js";
routerApp.factory('MarketData', ['$http', '$rootScope',
    function ($http, $rootScope) {
        var service = [];
        $rootScope.account = "";
        $rootScope.netId = "";
        var proxy = 'https://cors-anywhere.herokuapp.com/';
        service.getBalance = function (token, address) {
            return $http({
                type: 'GET',
                url: '/api/getBalances/' + address + '/' + token,
            });
        };
        service.prevDate = function () {
            var date = new Date();
            date.setDate(date.getMonth() - 3);
            return date;
        };
        //Get supported token_list
        service.GetTokenLists = function () {
            return $http({
                url: '/api/GetTokenLists',
                method: 'GET',
            });
        };
        //Get Given Token's Market Data
        service.GetTickerData = function (token) {
            var url = 'https://api.ercdex.com/api/reports/ticker';
            return $http({
                url: proxy + url,
                method: 'GET',
            });
        };
        //Get Chart Data
        service.GetChartData = function (networkId, tokenA, tokenB, startData, endDate) {
            var url = 'https://api.ercdex.com/api/reports/historical?networkId=' + networkId + '&makerTokenAddress=' + tokenA + '&takerTokenAddress=' + tokenB + '&startDate=' + startData + '&endDate=' + endDate;
            return $http({
                url: proxy + url,
                method: 'GET',
            });
        };
        //Get Given Token Market's Orderbook based on WETH
        service.GetOrderData = function (networkId, tokenA, tokenB) {
            var url = "https://api.ercdex.com/api/standard/" + networkId + "/v0/orderbook?baseTokenAddress=" + tokenA + "&quoteTokenAddress=" + tokenB;
            return $http({
                url: proxy + url,
                method: 'GET',
            });
        };
        // Get given market's trading history
        service.GetTradeHistory = function (networkId) {
            var url = 'https://api.ercdex.com/api/orders?networkId=' + networkId + '&isOpen=false';
            return $http({
                url: proxy + url,
                method: 'GET',
            });
        };
        // Draw Chart from chartData
        service.drawChart = function (chartData) {
            var chart = AmCharts.makeChart("chart_container", {
                "type": "stock",
                "theme": "dark",
                "dataSets": [{
                        "fieldMappings": [{
                                "fromField": "open",
                                "toField": "open"
                            }, {
                                "fromField": "close",
                                "toField": "close"
                            }, {
                                "fromField": "high",
                                "toField": "high"
                            }, {
                                "fromField": "low",
                                "toField": "low"
                            }, {
                                "fromField": "volume",
                                "toField": "volume"
                            }, {
                                "fromField": "value",
                                "toField": "value"
                            }],
                        "color": "#7f8da9",
                        "dataProvider": chartData,
                        "title": "West Stock",
                        "categoryField": "date"
                    }, {
                        "fieldMappings": [{
                                "fromField": "value",
                                "toField": "value"
                            }],
                        "color": "#fac314",
                        "dataProvider": chartData,
                        "compared": true,
                        "title": "East Stock",
                        "categoryField": "date"
                    }],
                "panels": [{
                        "title": "Value",
                        "showCategoryAxis": false,
                        "percentHeight": 70,
                        "valueAxes": [{
                                "id": "v1",
                                "dashLength": 5
                            }],
                        "categoryAxis": {
                            "dashLength": 5
                        },
                        "stockGraphs": [{
                                "type": "candlestick",
                                "id": "g1",
                                "openField": "open",
                                "closeField": "close",
                                "highField": "high",
                                "lowField": "low",
                                "valueField": "close",
                                "lineColor": "#7f8da9",
                                "fillColors": "#7f8da9",
                                "negativeLineColor": "#db4c3c",
                                "negativeFillColors": "#db4c3c",
                                "fillAlphas": 1,
                                "useDataSetColors": false,
                                "comparable": true,
                                "compareField": "value",
                                "showBalloon": false,
                                "proCandlesticks": true
                            }],
                        "stockLegend": {
                            "valueTextRegular": undefined,
                            "periodValueTextComparing": "[[percents.value.close]]%"
                        }
                    },
                    {
                        "title": "Volume",
                        "percentHeight": 30,
                        "marginTop": 1,
                        "showCategoryAxis": true,
                        "valueAxes": [{
                                "dashLength": 5
                            }],
                        "categoryAxis": {
                            "dashLength": 5
                        },
                        "stockGraphs": [{
                                "valueField": "volume",
                                "type": "column",
                                "showBalloon": false,
                                "fillAlphas": 1
                            }],
                        "stockLegend": {
                            "markerType": "none",
                            "markerSize": 0,
                            "labelText": "",
                            "periodValueTextRegular": "[[value.close]]"
                        }
                    }
                ],
                "chartScrollbarSettings": {
                    "graph": "g1",
                    "graphType": "line",
                    "usePeriod": "WW"
                },
                "chartCursorSettings": {
                    "valueLineBalloonEnabled": true,
                    "valueLineEnabled": true
                },
                "periodSelector": {
                    "position": "bottom",
                    "periods": [{
                            "period": "DD",
                            "count": 10,
                            "label": "10 days"
                        }, {
                            "period": "MM",
                            "selected": true,
                            "count": 1,
                            "label": "1 month"
                        }, {
                            "period": "YYYY",
                            "count": 1,
                            "label": "1 year"
                        }, {
                            "period": "YTD",
                            "label": "YTD"
                        }, {
                            "period": "MAX",
                            "label": "MAX"
                        }]
                },
                "export": {
                    "enabled": true
                }
            });
        };
        return service;
    }
]);
// routerApp.factory('ZeroExService', ['$http', '$rootScope','$location', 'config', 
//     function($http, $rootScope, config) {
//       this._Web3 = window.web3;
//       this._networkId = config.networkId;
//       this._zeroEx = new ZeroEx.ZeroEx(window.web3.currentProvider);
//       ZeroExService.getCoinbase = function () {
//         console.log(this._Web3.eth.coinbase);
//         return this._Web3.eth.coinbase;
//       };
//       // console.log(this._Web3.eth.coinbase);
// }]); 
