var routerApp = angular.module('myApp', [
    'ui.router'
]);
routerApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', { url: '/', templateUrl: 'home.html' })
        .state('account', { url: '/account', templateUrl: 'accounts.html' })
        .state('market', {
        url: '/market/:BaseToken/:Id',
        templateUrl: 'exchange.html',
        controller: "marketCtrl",
        resolve: {
            resolveId: [
                '$stateParams', '$rootScope',
                function ($stateParams) {
                    if ($stateParams.Id === '' || $stateParams.Id === null) {
                        $stateParams.Id = 'ZRX';
                    }
                    return $stateParams.Id;
                },
            ],
        }
    });
});
//For development
routerApp.constant('config', {
    'NetworkId': '1',
    'APP_NAME': 'ERC20 Token Exchange',
    'APP_VERSION': '1.0.0',
    'BASE_URL': 'http://localhost:3000',
    'SYSTEM_LANGUAGE': 'Typescript',
    'BASE_TOKEN': 'WETH',
    'BASE_TOKEN_ADDRESS': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'INFURA_API_URL': 'https://kovan.infura.io/QKt6Cz7nybWrpMH4xxLL',
    'INFURA_API_KEY': 'QKt6Cz7nybWrpMH4xxLL'
});
routerApp.run(function (config, $rootScope) {
    console.log(config.APP_NAME);
    window.addEventListener('load', function () {
        var params = (new URLSearchParams(window.location.search));
        /* Enable logging in debug mode */
        if (params.has("debug"))
            Logger.enable();
        else
            Logger.disable();
        /* Look up provider */
        var provider = params.get("provider");
        if (!provider)
            provider = (typeof web3 !== 'undefined') ? 'current' : 'infura';
        Logger.log('[App] Using web3 provider ' + provider);
        if (provider == 'current')
            window.web3 = new Web3(web3.currentProvider);
        else if (provider == 'localhost')
            window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        else if (provider == 'infura')
            window.web3 = new Web3(new ZeroClientProvider({
                getAccounts: function (cb) {
                    cb(null, []);
                }, rpcUrl: config.INFURA_API_URL
            }));
        // zeroEx = new ZeroEx.ZeroEx($window.web3.currentProvider);
        // Now you can start your app & access web3 freely:
        // startApp()
        web3.version.getNetwork(function (err, netId) {
            switch (netId) {
                case "1":
                    console.log('This is mainnet');
                    break;
                case "2":
                    console.log('This is the deprecated Morden test network.');
                    break;
                case "3":
                    console.log('This is the ropsten test network.');
                    break;
                case "4":
                    console.log('This is the Rinkeby test network.');
                    break;
                case "42":
                    console.log('This is the Kovan test network.');
                    break;
                default:
                    console.log('This is an unknown network.');
            }
        });
        // $.session.remove('user_addr');
        var account = web3.eth.coinbase;
        setInterval(function () {
            if (web3.eth.accounts[0] !== account) {
                account = web3.eth.accounts[0];
                window.location.reload();
            }
        }, 100);
        $.session.set('user_addr', account);
        $rootScope.UserAddress = account;
        var temp_addr = $.session.get('user_addr');
        // console.log(account);
    });
});
// function ZeroExFactory($window){
//   var zeroEx;
//   if(!$window.web3) {
//    zeroEx = new ZeroEx($window.web3.currentProvider);
//   }else{
//    zeroEx = new ZeroEx("https://kovan.infura.io");    
//   }
//   return zeroEx;
// }
// ZeroExFactory.$inject = ['$window'];
// routerApp.factory('ZeroService', ZeroExFactory); 
