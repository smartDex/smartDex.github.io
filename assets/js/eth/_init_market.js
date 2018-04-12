$(document).ready(function () {
    // var init_token = 'ZRX';
    // var init_token_id = '0x';
    // var init_token_addr = '0xe41d2489571d322189246dafa5ebde1f4699f498';
    // change_market(init_token, init_token_id, init_token_addr);
    var openaccount = $('#openaccount');
    var openlogin = $('#openlogintab');
    var opensignup = $('#opensignuptab');
    var signout = $('#signout').parent();
    var wallet = $.session.get('token');
    if (!wallet) {
        // openaccount.html('<a class="" title="Account" >Accounts</a>');
        signout.html('<a class="" title="SignOut" >SignOut</a>');
    }
    else {
        openlogin.html('<a class="" title="Sign In" >Sign In</a>');
        opensignup.html('<a class="" title="Sign Up" >Sign Up</a>');
        $('#user_addr').text(wallet.slice(0, 10) + '...');
        $('#user_addr').attr('href', 'https://ropsten.etherscan.io/address/' + wallet);
    }
    $(document).delegate('.open', 'click', function (event) {
        $(this).addClass('oppenned');
        event.stopPropagation();
    });
    $(document).delegate('body', 'click', function (event) {
        $('.open').removeClass('oppenned');
    });
    $(document).delegate('.cls', 'click', function (event) {
        $('.open').removeClass('oppenned');
        event.stopPropagation();
    });
    $("#datetime3").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        todayBtn: true
    });
    $('.btn-toggle').click(function () {
        $(this).find('.btn').toggleClass('active');
        var buy = $(".btn-toggle button:first-child");
        var sell = $(".btn-toggle button:last-child");
        sell.toggleClass('btn-danger');
        buy.toggleClass('btn-primary');
    });
    $('#signout').click(function () {
        $.session.clear();
        alert('Signed Out!');
        location.reload();
    });
});
