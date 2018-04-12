/*
 * 0xtrades.info
 * https://github.com/vsergeev/0xtrades.info
 *
 * Copyright (c) 2017 Ivan (Vanya) A. Sergeev
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/******************************************************************************/
/* Constants */
/******************************************************************************/
var ZEROEX_GENESIS_BLOCK = {
    1: 4145578,
    42: 4145578,
};
var ZEROEX_RELAY_ADDRESSES = {
    1: {
        "0xa258b39954cef5cb142fd567a46cddb31a670124": "Radar Relay",
        "0xeb71bad396acaa128aeadbc7dbd59ca32263de01": "Kin Alpha",
        "0xc22d5b2951db72b44cfb8089bb8cd374a3c354ea": "OpenRelay",
    },
    42: {},
};
var ZEROEX_TOKEN_INFOS = {};
var ZEROEX_EXCHANGE_ADDRESS = null;
var ZEROEX_TOKEN_ADDRESS = null;
var NETWORK_NAME = {
    1: "Mainnet",
    3: "Ropsten",
    4: "Rinkeby",
    42: "Kovan",
};
var NETWORK_BLOCK_EXPLORER = {
    1: "https://etherscan.io",
    3: "https://ropsten.etherscan.io",
    4: "https://rinkeby.etherscan.io",
    42: "https://kovan.etherscan.io",
};
var PRICE_API_URL = function (symbols, base) {
    return "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + symbols.join(',') + "&tsyms=" + base;
};
Logger = {
    enable: function () { Logger.log = Logger._log_console; },
    disable: function () { Logger.log = Logger._log_null; },
    _log_console: console.log.bind(window.console),
    _log_null: function (s) { },
    log: null,
    error: console.error.bind(window.console),
};
