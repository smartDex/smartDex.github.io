// Global Options
var base_token = 'WETH';
var proxy = 'https://cors-anywhere.herokuapp.com/';
var loading = "<img src='../img/loader.gif' align='middle' style='margin:auto;'>";
var h_data = '';
//get chart data
var chartData = [];
// var url = window.location.href; // Returns full URL
// var token = url.substr(-8, 8);
// if (token.indexOf('WETH') < 0) {
//   token = 'ZRX-WETH';
// }
// $.ajax({
//   url: '/api/tokens',
//   type: 'GET',
//   success: function(data) {
//     var r = data;
//     for (var key in r) {
//       h_data += '<li class="option" data-value="residential" onclick="change_market(' + "'" + r[key].token_symbol + "','" + r[key].token_id + "'" + ')">' + r[key].token_symbol + '-WETH</li>';
//     }
//     //    console.log(data);
//     $('#img_category_options').html(h_data);
//     $('.orderask').html(loading);
//     $('.orderbid').html(loading);
//     $('.orderhistory').html(loading);
//     $('#chart_container').html(loading);
//     $('li .option').each(function() {
//       if ($(this).text() == token) {
//         // console.log('selected: ' + $(this).text());
//         $(this).click();
//       }
//     });
//   },
//   error: function(err) {
//     console.log(err);
//   }
// });
// console.log(token);
//When Market change!!!
// function change_market(token, token_id) {
//   location.href = "#/market/" + token + "-WETH";
//   // When market change
//   var market = token + '/' + base_token;
//   //Default Chart Period
//   var init_period = '1d';
//   //Change Token Names
//   $('.selected_token').text(token);
//   //Market Ticker Data from coinmarketcap.com
//   getTickerData(token_id);
//   //Get orderbook of given market from our API.
//   getOrdoerList(market);
//   //Get candle datas from our API and draw Trading Chart.
//   getChartData(market, init_period);
// }
//check type of number
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
//get order list
function getOrdoerList(market) {
    var url = 'https://api.paradex.io/consumer/v0/orderbook?market=' + market;
    $.ajax({
        url: proxy + url,
        type: 'GET',
        headers: {
            'API-KEY': 'cp1st5KYcGR5CtjjOSKTo6Pm2dQfjeMT',
        },
        success: function (res) {
            var r = res;
            //           console.log(r);
            var bid_total_volume = 0;
            var ask_total_volume = 0;
            var ask_vol = 0;
            var bid_vol = 0;
            var h_askdata = '';
            var h_biddata = '';
            if (r.asks) {
                var status = "ask";
                for (var k = 0; k < r.asks.length; k++) {
                    ask_total_volume = Number(Number(r.asks[k].amount) + Number(ask_total_volume));
                }
                ask_vol = ask_total_volume;
                for (var i = 0; i < r.asks.length; i++) {
                    var amount = Number(r.asks[i].amount);
                    var price = Number(r.asks[i].price);
                    if (i > 0)
                        ask_total_volume = Number(ask_total_volume - amount);
                    h_askdata += '<div class="col-4 entry colmn-2">' + amount.toFixed(5) + '</div>';
                    h_askdata += '<div class="col-4 entry colmn-1" onclick="select_order(' + "'" + amount + "','" + price + "','" + status + "'" + ')">' + price.toFixed(5) + '</div>';
                    h_askdata += '<div class="col-4 entry colmn-2">' + ask_total_volume.toFixed(5) + '</div>';
                }
            }
            //bids
            if (r.bids) {
                var status = 'bid';
                for (var j = 0; j < r.bids.length; j++) {
                    var amount1 = Number(r.bids[j].amount);
                    var price1 = Number(r.bids[j].price);
                    bid_total_volume = Number(bid_total_volume + amount1);
                    h_biddata += '<div class="col-4 entry colmn-2">' + amount1.toFixed(5) + '</div>';
                    h_biddata += '<div class="col-4 entry colmn-1" onclick="select_order(' + "'" + amount1 + "','" + price1 + "','" + status + "'" + ')">' + price1.toFixed(5) + '</div>';
                    h_biddata += '<div class="col-4 entry colmn-2">' + bid_total_volume.toFixed(5) + '</div>';
                }
                bid_vol = bid_total_volume;
            }
            // console.log(bid_vol + '/' + ask_vol);
            var spread = Number(bid_vol / ask_vol);
            if (h_askdata == '')
                h_askdata =
                    "<div class='text-center' style='padding:15px;'>There are no Oders to buy</div>";
            if (h_biddata == '')
                h_biddata =
                    "<div class='text-center' style='padding:15px;'>There are no Oders to sell</div>";
            $('.orderask').html(h_askdata);
            $('.orderask').css('font-size', '13px');
            $('.orderbid').html(h_biddata);
            $('.orderbid').css('font-size', '13px');
            $('#spread').html(spread.toFixed(8));
            $('#spread').css('font-size', '13px');
            $('#spread').css('color', 'yellow');
            $('.orderhistory').html("<div class='text-center' style='padding:15px;'>There are no Trade History</div>");
        },
        error: function (e) {
            console.log(e);
        },
    });
}
//Get Trading History of given market
// function getTradeHistory(market) {
//     //   /  var url = 'https://api.paradex.io/consumer/v0/orderbook?market=' + market + '&state=filled';
// }
//Select Order from OrderBook
function select_order(amount, price, state) {
    var token = $.session.get('token');
    if (token) {
        if (state == 'ask') {
            $('#button_state').text('Buy');
        }
        else if (state == 'bid') {
            $('#button_state').text('Sell');
        }
        $('#order_amount').val(amount);
        $('#order_price').val(price);
    }
    else {
        alert('Please Sign In First');
    }
}
// get ticker data function from coinmarketcap.com
function getTickerData(token) {
    var url = 'https://api.coinmarketcap.com/v1/ticker/' + token + '/?convert=WETH';
    $.ajax({
        url: proxy + url,
        type: 'GET',
        success: function (res) {
            var r = res;
            for (var key in r) {
                var change_1h = '<h3 style="color:rgb(144, 241, 237); font-size:20px;">' + Number(r[key]['percent_change_1h']).toFixed(5) + '%</h3><h5 style="color:white;">percent_change_1h</h5>';
                var change_24h = '<h3 style="color:rgb(144, 241, 237); font-size:20px;">' + Number(r[key]['percent_change_24h']).toFixed(5) + '%</h3><h5 style="color:white;">percent_change_24h</h5>';
                var change_7d = '<h3 style="color:rgb(144, 241, 237); font-size:20px;">' + Number(r[key]['percent_change_7d']).toFixed(5) + '%</h3><h5 style="color:white;">percent_change_7d</h5>';
                var price_usd = '<h3 style="color:rgb(144, 241, 237); font-size:20px;">' + Number(r[key]['price_usd']).toFixed(5) + '$</h3><h5 style="color:white;">price_usd</h5>';
                var price_weth = '<h3 style="color:rgb(144, 241, 237); font-size:20px;">' + Number(r[key]['price_weth']).toFixed(5) + '</h3><h5 style="color:white;">price_weth</h5>';
                $('#percent_1h').html(change_1h);
                $('#selected_logo').attr('src', './img/token_icons/' + token + '.png');
                $('#percent_24h').html(change_24h);
                $('#percent_7d').html(change_7d);
                $('#price_usd').html(price_usd);
                $('#price_weth').html(price_weth);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}
function getChartData(market, period) {
    var url = 'https://api.paradex.io/consumer/v0/ohlcv';
    var amount = 30;
    $.ajax({
        url: proxy + url + '?market=' + market + '&period=' + period + '&amount=' + amount,
        type: 'GET',
        headers: {
            'API-KEY': 'cp1st5KYcGR5CtjjOSKTo6Pm2dQfjeMT',
        },
        success: function (res) {
            // console.log(res.length);
            if (res.error) {
                console.log("Couldn't find Chart Data");
                drawChart();
            }
            else {
                for (var i = 0; i < res.length; i++) {
                    // console.log(res[i].date);
                    var newDate = new Date(res[i].date);
                    // console.log(newDate);
                    newDate.setDate(newDate.getDate() + i);
                    chartData[i] = ({
                        "date": newDate,
                        "open": Number(res[i].open),
                        "close": Number(res[i].close),
                        "high": Number(res[i].high),
                        "low": Number(res[i].low),
                        "volume": Number(res[i].volume),
                        "value": Number(res[i].high)
                    });
                }
            }
            $("a[href='http://www.amcharts.com']").hide();
        },
        error: function (e) {
            console.log(e);
        },
        complete: function () {
            //  console.log(chartData);
            drawChart();
        }
    });
}
function drawChart() {
    var chart = AmCharts.makeChart('chart_container', {
        type: 'stock',
        theme: 'dark',
        dataSets: [{
                fieldMappings: [{
                        fromField: 'open',
                        toField: 'open',
                    },
                    {
                        fromField: 'close',
                        toField: 'close',
                    },
                    {
                        fromField: 'high',
                        toField: 'high',
                    },
                    {
                        fromField: 'low',
                        toField: 'low',
                    },
                    {
                        fromField: 'volume',
                        toField: 'volume',
                    },
                    {
                        fromField: 'value',
                        toField: 'value',
                    },
                ],
                color: '#7f8da9',
                dataProvider: chartData,
                title: 'West Stock',
                categoryField: 'date',
            },
            {
                fieldMappings: [{
                        fromField: 'value',
                        toField: 'value',
                    },],
                color: '#fac314',
                dataProvider: chartData,
                compared: true,
                title: 'East Stock',
                categoryField: 'date',
            },
        ],
        panels: [{
                title: 'Value',
                showCategoryAxis: false,
                percentHeight: 70,
                valueAxes: [{
                        id: 'v1',
                        dashLength: 5,
                    },],
                categoryAxis: {
                    dashLength: 5,
                },
                stockGraphs: [{
                        type: 'candlestick',
                        id: 'g1',
                        openField: 'open',
                        closeField: 'close',
                        highField: 'high',
                        lowField: 'low',
                        valueField: 'close',
                        lineColor: '#7f8da9',
                        fillColors: '#7f8da9',
                        negativeLineColor: '#db4c3c',
                        negativeFillColors: '#db4c3c',
                        fillAlphas: 1,
                        useDataSetColors: false,
                        comparable: true,
                        compareField: 'value',
                        showBalloon: false,
                        proCandlesticks: true,
                    },],
                stockLegend: {
                    valueTextRegular: undefined,
                    periodValueTextComparing: '[[percents.value.close]]%',
                },
            },
            {
                title: 'Volume',
                percentHeight: 30,
                marginTop: 1,
                showCategoryAxis: true,
                valueAxes: [{
                        dashLength: 5,
                    },],
                categoryAxis: {
                    dashLength: 5,
                },
                stockGraphs: [{
                        valueField: 'volume',
                        type: 'column',
                        showBalloon: false,
                        fillAlphas: 1,
                    },],
                stockLegend: {
                    markerType: 'none',
                    markerSize: 0,
                    labelText: '',
                    periodValueTextRegular: '[[value.close]]',
                },
            },
        ],
        chartScrollbarSettings: {
            graph: 'g1',
            graphType: 'line',
            usePeriod: 'WW',
        },
        chartCursorSettings: {
            valueLineBalloonEnabled: true,
            valueLineEnabled: true,
        },
        periodSelector: {
            position: 'bottom',
            periods: [{
                    period: 'DD',
                    selected: true,
                    count: 10,
                    label: '10 days',
                },
                {
                    period: 'MM',
                    count: 1,
                    label: '1 month',
                },
                {
                    period: 'YYYY',
                    count: 1,
                    label: '1 year',
                },
                {
                    period: 'YTD',
                    label: 'YTD',
                },
                {
                    period: 'MAX',
                    label: 'MAX',
                },
            ],
        },
        export: {
            enabled: true,
        },
    });
}
