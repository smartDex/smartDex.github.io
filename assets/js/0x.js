"use strict";
var __assign = (this && this.__assign) || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1)
            throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f)
            throw new TypeError("Generator is already executing.");
        while (_)
            try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done)
                    return t;
                if (y = 0, t)
                    op = [0, t.value];
                switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return { value: op[1], done: false };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                }
                op = body.call(thisArg, _);
            }
            catch (e) {
                op = [6, e];
                y = 0;
            }
            finally {
                f = t = 0;
            }
        if (op[0] & 5)
            throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_schemas_1 = require("@0xproject/json-schemas");
var utils_1 = require("@0xproject/utils");
var web3_wrapper_1 = require("@0xproject/web3-wrapper");
var ethUtil = require("ethereumjs-util");
var _ = require("lodash");
var artifacts_1 = require("./artifacts");
var ether_token_wrapper_1 = require("./contract_wrappers/ether_token_wrapper");
var exchange_wrapper_1 = require("./contract_wrappers/exchange_wrapper");
var token_registry_wrapper_1 = require("./contract_wrappers/token_registry_wrapper");
var token_transfer_proxy_wrapper_1 = require("./contract_wrappers/token_transfer_proxy_wrapper");
var token_wrapper_1 = require("./contract_wrappers/token_wrapper");
var order_state_watcher_1 = require("./order_watcher/order_state_watcher");
var zero_ex_config_schema_1 = require("./schemas/zero_ex_config_schema");
var types_1 = require("./types");
var assert_1 = require("./utils/assert");
var constants_1 = require("./utils/constants");
var decorators_1 = require("./utils/decorators");
var signature_utils_1 = require("./utils/signature_utils");
var utils_2 = require("./utils/utils");
/**
 * The ZeroEx class is the single entry-point into the 0x.js library. It contains all of the library's functionality
 * and all calls to the library should be made through a ZeroEx instance.
 */
var ZeroEx = (function () {
    /**
     * Instantiates a new ZeroEx instance that provides the public interface to the 0x.js library.
     * @param   provider    The Web3.js Provider instance you would like the 0x.js library to use for interacting with
     *                      the Ethereum network.
     * @param   config      The configuration object. Look up the type for the description.
     * @return  An instance of the 0x.js ZeroEx class.
     */
    function ZeroEx(provider, config) {
        assert_1.assert.isWeb3Provider('provider', provider);
        assert_1.assert.doesConformToSchema('config', config, zero_ex_config_schema_1.zeroExConfigSchema);
        var artifactJSONs = _.values(artifacts_1.artifacts);
        var abiArrays = _.map(artifactJSONs, function (artifact) { return artifact.abi; });
        this._abiDecoder = new utils_1.AbiDecoder(abiArrays);
        var defaults = {
            gasPrice: config.gasPrice,
        };
        this._web3Wrapper = new web3_wrapper_1.Web3Wrapper(provider, defaults);
        this.proxy = new token_transfer_proxy_wrapper_1.TokenTransferProxyWrapper(this._web3Wrapper, config.networkId, config.tokenTransferProxyContractAddress);
        this.token = new token_wrapper_1.TokenWrapper(this._web3Wrapper, config.networkId, this._abiDecoder, this.proxy);
        this.exchange = new exchange_wrapper_1.ExchangeWrapper(this._web3Wrapper, config.networkId, this._abiDecoder, this.token, config.exchangeContractAddress, config.zrxContractAddress);
        this.tokenRegistry = new token_registry_wrapper_1.TokenRegistryWrapper(this._web3Wrapper, config.networkId, config.tokenRegistryContractAddress);
        this.etherToken = new ether_token_wrapper_1.EtherTokenWrapper(this._web3Wrapper, config.networkId, this._abiDecoder, this.token);
        this.orderStateWatcher = new order_state_watcher_1.OrderStateWatcher(this._web3Wrapper, this._abiDecoder, this.token, this.exchange, config.orderWatcherConfig);
    }
    /**
     * Verifies that the elliptic curve signature `signature` was generated
     * by signing `data` with the private key corresponding to the `signerAddress` address.
     * @param   data          The hex encoded data signed by the supplied signature.
     * @param   signature     An object containing the elliptic curve signature parameters.
     * @param   signerAddress The hex encoded address that signed the data, producing the supplied signature.
     * @return  Whether the signature is valid for the supplied signerAddress and data.
     */
    ZeroEx.isValidSignature = function (data, signature, signerAddress) {
        assert_1.assert.isHexString('data', data);
        assert_1.assert.doesConformToSchema('signature', signature, json_schemas_1.schemas.ecSignatureSchema);
        assert_1.assert.isETHAddressHex('signerAddress', signerAddress);
        var isValidSignature = signature_utils_1.signatureUtils.isValidSignature(data, signature, signerAddress);
        return isValidSignature;
    };
    /**
     * Generates a pseudo-random 256-bit salt.
     * The salt can be included in an 0x order, ensuring that the order generates a unique orderHash
     * and will not collide with other outstanding orders that are identical in all other parameters.
     * @return  A pseudo-random 256-bit number that can be used as a salt.
     */
    ZeroEx.generatePseudoRandomSalt = function () {
        // BigNumber.random returns a pseudo-random number between 0 & 1 with a passed in number of decimal places.
        // Source: https://mikemcl.github.io/bignumber.js/#random
        var randomNumber = utils_1.BigNumber.random(constants_1.constants.MAX_DIGITS_IN_UNSIGNED_256_INT);
        var factor = new utils_1.BigNumber(10).pow(constants_1.constants.MAX_DIGITS_IN_UNSIGNED_256_INT - 1);
        var salt = randomNumber.times(factor).round();
        return salt;
    };
    /**
     * Checks if the supplied hex encoded order hash is valid.
     * Note: Valid means it has the expected format, not that an order with the orderHash exists.
     * Use this method when processing orderHashes submitted as user input.
     * @param   orderHash    Hex encoded orderHash.
     * @return  Whether the supplied orderHash has the expected format.
     */
    ZeroEx.isValidOrderHash = function (orderHash) {
        // Since this method can be called to check if any arbitrary string conforms to an orderHash's
        // format, we only assert that we were indeed passed a string.
        assert_1.assert.isString('orderHash', orderHash);
        var schemaValidator = new json_schemas_1.SchemaValidator();
        var isValidOrderHash = schemaValidator.validate(orderHash, json_schemas_1.schemas.orderHashSchema).valid;
        return isValidOrderHash;
    };
    /**
     * A unit amount is defined as the amount of a token above the specified decimal places (integer part).
     * E.g: If a currency has 18 decimal places, 1e18 or one quintillion of the currency is equivalent
     * to 1 unit.
     * @param   amount      The amount in baseUnits that you would like converted to units.
     * @param   decimals    The number of decimal places the unit amount has.
     * @return  The amount in units.
     */
    ZeroEx.toUnitAmount = function (amount, decimals) {
        assert_1.assert.isValidBaseUnitAmount('amount', amount);
        assert_1.assert.isNumber('decimals', decimals);
        var aUnit = new utils_1.BigNumber(10).pow(decimals);
        var unit = amount.div(aUnit);
        return unit;
    };
    /**
     * A baseUnit is defined as the smallest denomination of a token. An amount expressed in baseUnits
     * is the amount expressed in the smallest denomination.
     * E.g: 1 unit of a token with 18 decimal places is expressed in baseUnits as 1000000000000000000
     * @param   amount      The amount of units that you would like converted to baseUnits.
     * @param   decimals    The number of decimal places the unit amount has.
     * @return  The amount in baseUnits.
     */
    ZeroEx.toBaseUnitAmount = function (amount, decimals) {
        assert_1.assert.isBigNumber('amount', amount);
        assert_1.assert.isNumber('decimals', decimals);
        var unit = new utils_1.BigNumber(10).pow(decimals);
        var baseUnitAmount = amount.times(unit);
        var hasDecimals = baseUnitAmount.decimalPlaces() !== 0;
        if (hasDecimals) {
            throw new Error("Invalid unit amount: " + amount.toString() + " - Too many decimal places");
        }
        return baseUnitAmount;
    };
    /**
     * Computes the orderHash for a supplied order.
     * @param   order   An object that conforms to the Order or SignedOrder interface definitions.
     * @return  The resulting orderHash from hashing the supplied order.
     */
    ZeroEx.getOrderHashHex = function (order) {
        assert_1.assert.doesConformToSchema('order', order, json_schemas_1.schemas.orderSchema);
        var orderHashHex = utils_2.utils.getOrderHashHex(order);
        return orderHashHex;
    };
    /**
     * Sets a new web3 provider for 0x.js. Updating the provider will stop all
     * subscriptions so you will need to re-subscribe to all events relevant to your app after this call.
     * @param   provider    The Web3Provider you would like the 0x.js library to use from now on.
     * @param   networkId   The id of the network your provider is connected to
     */
    ZeroEx.prototype.setProvider = function (provider, networkId) {
        this._web3Wrapper.setProvider(provider);
        this.exchange._invalidateContractInstances();
        this.exchange._setNetworkId(networkId);
        this.tokenRegistry._invalidateContractInstance();
        this.tokenRegistry._setNetworkId(networkId);
        this.token._invalidateContractInstances();
        this.token._setNetworkId(networkId);
        this.proxy._invalidateContractInstance();
        this.proxy._setNetworkId(networkId);
        this.etherToken._invalidateContractInstance();
        this.etherToken._setNetworkId(networkId);
    };
    /**
     * Get user Ethereum addresses available through the supplied web3 provider available for sending transactions.
     * @return  An array of available user Ethereum addresses.
     */
    ZeroEx.prototype.getAvailableAddressesAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var availableAddresses;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._web3Wrapper.getAvailableAddressesAsync()];
                    case 1:
                        availableAddresses = _a.sent();
                        return [2 /*return*/, availableAddresses];
                }
            });
        });
    };
    /**
     * Signs an orderHash and returns it's elliptic curve signature.
     * This method currently supports TestRPC, Geth and Parity above and below V1.6.6
     * @param   orderHash       Hex encoded orderHash to sign.
     * @param   signerAddress   The hex encoded Ethereum address you wish to sign it with. This address
     *          must be available via the Web3.Provider supplied to 0x.js.
     * @param   shouldAddPersonalMessagePrefix  Some signers add the personal message prefix `\x19Ethereum Signed Message`
     *          themselves (e.g Parity Signer, Ledger, TestRPC) and others expect it to already be done by the client
     *          (e.g Metamask). Depending on which signer this request is going to, decide on whether to add the prefix
     *          before sending the request.
     * @return  An object containing the Elliptic curve signature parameters generated by signing the orderHash.
     */
    ZeroEx.prototype.signOrderHashAsync = function (orderHash, signerAddress, shouldAddPersonalMessagePrefix) {
        return __awaiter(this, void 0, void 0, function () {
            var msgHashHex, orderHashBuff, msgHashBuff, signature, validVParamValues, ecSignatureVRS, isValidVRSSignature, ecSignatureRSV, isValidRSVSignature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert_1.assert.isHexString('orderHash', orderHash);
                        return [4 /*yield*/, assert_1.assert.isSenderAddressAsync('signerAddress', signerAddress, this._web3Wrapper)];
                    case 1:
                        _a.sent();
                        msgHashHex = orderHash;
                        if (shouldAddPersonalMessagePrefix) {
                            orderHashBuff = ethUtil.toBuffer(orderHash);
                            msgHashBuff = ethUtil.hashPersonalMessage(orderHashBuff);
                            msgHashHex = ethUtil.bufferToHex(msgHashBuff);
                        }
                        return [4 /*yield*/, this._web3Wrapper.signTransactionAsync(signerAddress, msgHashHex)];
                    case 2:
                        signature = _a.sent();
                        validVParamValues = [27, 28];
                        ecSignatureVRS = signature_utils_1.signatureUtils.parseSignatureHexAsVRS(signature);
                        if (_.includes(validVParamValues, ecSignatureVRS.v)) {
                            isValidVRSSignature = ZeroEx.isValidSignature(orderHash, ecSignatureVRS, signerAddress);
                            if (isValidVRSSignature) {
                                return [2 /*return*/, ecSignatureVRS];
                            }
                        }
                        ecSignatureRSV = signature_utils_1.signatureUtils.parseSignatureHexAsRSV(signature);
                        if (_.includes(validVParamValues, ecSignatureRSV.v)) {
                            isValidRSVSignature = ZeroEx.isValidSignature(orderHash, ecSignatureRSV, signerAddress);
                            if (isValidRSVSignature) {
                                return [2 /*return*/, ecSignatureRSV];
                            }
                        }
                        throw new Error(types_1.ZeroExError.InvalidSignature);
                }
            });
        });
    };
    /**
     * Waits for a transaction to be mined and returns the transaction receipt.
     * @param   txHash            Transaction hash
     * @param   pollingIntervalMs How often (in ms) should we check if the transaction is mined.
     * @param   timeoutMs         How long (in ms) to poll for transaction mined until aborting.
     * @return  Transaction receipt with decoded log args.
     */
    ZeroEx.prototype.awaitTransactionMinedAsync = function (txHash, pollingIntervalMs, timeoutMs) {
        if (pollingIntervalMs === void 0) {
            pollingIntervalMs = 1000;
        }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var timeoutExceeded, txReceiptPromise, txReceipt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeoutExceeded = false;
                        if (timeoutMs) {
                            setTimeout(function () { return (timeoutExceeded = true); }, timeoutMs);
                        }
                        txReceiptPromise = new Promise(function (resolve, reject) {
                            var intervalId = utils_1.intervalUtils.setAsyncExcludingInterval(function () {
                                return __awaiter(_this, void 0, void 0, function () {
                                    var transactionReceipt, logsWithDecodedArgs, transactionReceiptWithDecodedLogArgs;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (timeoutExceeded) {
                                                    utils_1.intervalUtils.clearAsyncExcludingInterval(intervalId);
                                                    return [2 /*return*/, reject(types_1.ZeroExError.TransactionMiningTimeout)];
                                                }
                                                return [4 /*yield*/, this._web3Wrapper.getTransactionReceiptAsync(txHash)];
                                            case 1:
                                                transactionReceipt = _a.sent();
                                                if (!_.isNull(transactionReceipt)) {
                                                    utils_1.intervalUtils.clearAsyncExcludingInterval(intervalId);
                                                    logsWithDecodedArgs = _.map(transactionReceipt.logs, this._abiDecoder.tryToDecodeLogOrNoop.bind(this._abiDecoder));
                                                    transactionReceiptWithDecodedLogArgs = __assign({}, transactionReceipt, { logs: logsWithDecodedArgs });
                                                    resolve(transactionReceiptWithDecodedLogArgs);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            }, pollingIntervalMs, function (err) {
                                utils_1.intervalUtils.clearAsyncExcludingInterval(intervalId);
                                reject(err);
                            });
                        });
                        return [4 /*yield*/, txReceiptPromise];
                    case 1:
                        txReceipt = _a.sent();
                        return [2 /*return*/, txReceipt];
                }
            });
        });
    };
    /*
     * HACK: `TokenWrapper` needs a token transfer proxy address. `TokenTransferProxy` address is fetched from
     * an `ExchangeWrapper`. `ExchangeWrapper` needs `TokenWrapper` to validate orders, creating a dependency cycle.
     * In order to break this - we create this function here and pass it as a parameter to the `TokenWrapper`
     * and `ProxyWrapper`.
     */
    ZeroEx.prototype._getTokenTransferProxyAddressAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenTransferProxyAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.exchange._getTokenTransferProxyAddressAsync()];
                    case 1:
                        tokenTransferProxyAddress = _a.sent();
                        return [2 /*return*/, tokenTransferProxyAddress];
                }
            });
        });
    };
    /**
     * When creating an order without a specified taker or feeRecipient you must supply the Solidity
     * address null type (as opposed to Javascripts `null`, `undefined` or empty string). We expose
     * this constant for your convenience.
     */
    ZeroEx.NULL_ADDRESS = constants_1.constants.NULL_ADDRESS;
    __decorate([
        decorators_1.decorators.syncZeroExErrorHandler
    ], ZeroEx, "getOrderHashHex", null);
    return ZeroEx;
}());
exports.ZeroEx = ZeroEx;
