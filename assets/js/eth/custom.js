// var web3 = new Web3();
// var global_keystore;
// // const createKeccakHash = require('keccak');
// //set Web3 provider
// function setWeb3Provider(keystore) {
//   var web3Provider = new HookedWeb3Provider({
//     host: "https://kovan.infura.io/",
//     transaction_signer: keystore
//   });
//   web3.setProvider(web3Provider);
// }
// //generate new address
// function newAddresses(password, randomSeed, flag) {
//   if (password == '') {
//     return false;
//   }
//   var numAddr = 1;
//   global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {
//     global_keystore.generateNewAddress(pwDerivedKey, numAddr);
//     var addresses = global_keystore.getAddresses();
//     var address = addresses[0];
//     $('#wallet_address').text(address);
//     $('#wallet_seed').val(randomSeed);
//   });
// }
// //import existing address from seed
// function importAccountFromSeed() {
//   var password = 'Password';
//   lightwallet.keystore.createVault({
//     password: password,
//     seedPhrase: document.getElementById('private-key').value,
//     //random salt
//     hdPathString: "m/0'/0'/0'"
//   }, function(err, ks) {
//     global_keystore = ks;
//     newAddresses(password, document.getElementById('private-key').value, 'import');
//     setWeb3Provider(global_keystore);
//   });
// }
// //create new wallet
// function newWallet(password) {
//   var extraEntropy = '';
//   var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
//   var password = password;
//   lightwallet.keystore.createVault({
//     password: password,
//     seedPhrase: randomSeed,
//     //random salt
//     hdPathString: "m/0'/0'/0'"
//   }, function(err, ks) {
//     global_keystore = ks;
//     newAddresses(password, randomSeed);
//     setWeb3Provider(global_keystore);
//     // return addr;
//     // getBalances();
//   });
// }
// $('#login_form').submit(function() {
//   var log_email = $("#log_email").val();
//   var log_password = $("#log_password").val();
//   $(this).ajaxSubmit({
//     error: function(xhr) {
//       status('Error: ' + xhr.status);
//     },
//     success: function(response) {
//       if (response.responseDesc == 'Sucess') {
//         logIn(log_email, log_password);
//       } else {
//         alert(response.responseDesc);
//       }
//     }
//   });
//   //Very important line, it disable the page refresh.
//   return false;
// });
// //email form validation
// function isEmail(email) {
//   var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//   return regex.test(email);
// }
// //check captcha
// function isCaptcha(flag) {
//   if (flag == 'signup') {
//     $('#signup_btn').text('Processing...');
//     var username = $("#signup_username").val();
//     var useremail = $("#signup_email").val();
//     var is_email = isEmail(useremail);
//     var pwd = $("#sign_password").val();
//     var confpwd = $("#sign_cofirm_password").val();
//     newWallet(pwd);
//     if (username.trim() == '') {
//       $("#signup_username").focus();
//       return false;
//     }
//     if (!is_email) {
//       $("#signup_email").focus();
//       return false;
//     }
//     if (pwd.length < 6) {
//       $("#sign_password").focus();
//       return false;
//     }
//     if (pwd != confpwd) {
//       $("#sign_cofirm_password").focus();
//       return false;
//     }
//     $.ajax({
//       url: '/auth/verify_captcha',
//       type: 'POST',
//       data: $("#signup_form").serialize(),
//       success: function(res) {
//         if (res.responseDesc == 'Sucess') {
//           signUp(username, useremail, pwd);
//         } else {
//           $(".captcha-alert-text").text(res.responseDesc);
//           $(".captcha-alert").show();
//         }
//       },
//       error: function(e) {
//         console.log(e);
//       }
//     });
//   }
//   if (flag == 'login') {
//     // $.session.clear();
//     var email = $("#log_email").val();
//     var isemail = isEmail(email);
//     var userpwd = $("#log_password").val();
//     $('#signin_btn').text('Processing...');
//     if (!isemail) {
//       $("#log_email").focus();
//       return false;
//     }
//     if (userpwd.length < 6) {
//       $("#log_password").focus();
//       return false;
//     }
//     $.ajax({
//       url: '/auth/verify_captcha',
//       type: 'POST',
//       data: $('#login_form').serialize(),
//       success: function(res) {
//         if (res.responseDesc == 'Sucess') {
//           logIn(email, userpwd);
//         } else {
//           $('.captcha-log-text').text(res.responseDesc);
//           $('.captcha-log').show();
//         }
//       },
//       error: function(e) {
//         console.log(e);
//       },
//     });
//   }
// }
// function signUp(username, useremail, pwd) {
//   setTimeout(function() {
//     var wallet_addr = $('#wallet_address').text();
//     var wallet_seed = $('#wallet_seed').val();
//     alert(useremail);
//     if (wallet_addr) {
//       $.ajax({
//         url: '/auth/signup',
//         type: 'POST',
//         data: {
//           username: username,
//           email: useremail,
//           password: pwd,
//           wallet_addr: wallet_addr
//         },
//         success: function(res) {
//           if (res.status && res.status == 'err') {
//             console.log(res.description);
//             $('.captcha-alert-text').text(res.description);
//             $('.captcha-alert').show();
//             setTimeout(function() {
//               location.reload();
//             }, 3000);
//             return false;
//           } else {
//             $.session.set('token', res.walletaddress);
//             $('.captcha-alert-text').text('SignUp Success');
//             $('.captcha-alert').show();
//             $('#signupmodal').fadeOut();
//           }
//           //generate qr code
//           $('#qr').qrcode({
//             render: 'image',
//             text: wallet_addr,
//             ecLevel: 'H',
//             size: '160',
//           });
//           walletmodal.style.display = 'block';
//         },
//         error: function(e) {
//           $('#signup_btn').text('Failed!!!');
//           location.reload();
//         }
//       });
//     } else {
//       alert('Please make sure new wallet is created successfully');
//     }
//   }, 3000);
// }
// //login
// function logIn(email, password) {
//   $.ajax({
//     url: '/auth/signin',
//     type: 'POST',
//     data: { email: email, password: password },
//     success: function(res) {
//       if (res.status && res.status == "err") {
//         $('.captcha-log-text').text(res.description);
//         $('.captcha-log').show();
//         setTimeout(function() { location.reload(); }, 1000);
//       } else {
//         $.session.set('token', res.walletaddress);
//         $('.captcha-log-text').text("Login Success");
//         $('.captcha-log').show();
//         // timeout($('#loginmodal').fadeOut(), 3000);
//         location.reload();
//       }
//     },
//     error: function(e) {
//       $('#signin_btn').text('Failed');
//       console.log(e);
//       setTimeout(function() { $('#loginmodal').fadeOut() }, 3000);
//     }
//   });
// }
// $("#copyaddr").click(function() {
//   var copyText = $("#qr_val").text();
//   // Select the address anchor text
//   var addr = document.querySelector('#qr_val');
//   var range = document.createRange();
//   range.selectNode(addr);
//   window.getSelection().addRange(range);
//   try {
//     // Now that we've selected the anchor text, execute the copy command
//     var successful = document.execCommand('copy');
//     var msg = successful ? 'successful' : 'unsuccessful';
//   } catch (err) {
//     console.log('Oops, unable to copy');
//   }
//   // Remove the selections - NOTE: Should use
//   // removeRange(range) when it is supported
//   window.getSelection().removeAllRanges();
//   $(this).text('COPIED');
//   // setTimeout(function(){$(this).text('COPY ADDRESS');}, 500);
//   setTimeout(function() { $("#copyaddr").text('COPY ADDRESS'); }, 1000);
// });
// // Get the modal
// var signupmodal = document.getElementById('signupmodal');
// var loginmodal = document.getElementById('loginmodal');
// var walletmodal = document.getElementById('Wallet_info');
// // Get the button that opens the modal
// var opensignup = document.getElementById("opensignup");
// var openlogin = document.getElementById("openlogin");
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
// // When the user clicks the button, open the modal
// opensignup.onclick = function() {
//   signupmodal.style.display = 'block';
// };
// openlogin.onclick = function() {
//     loginmodal.style.display = "block";
//   }
//   // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   signupmodal.style.display = 'none';
// }
// span.onclick = function() {
//   loginmodal.style.display = "none";
// }
// span.onclick = function() {
//   walletmodal.style.display = 'none';
// };
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == signupmodal) {
//     signupmodal.style.display = 'none';
//   }
//   if (event.target == loginmodal) {
//     loginmodal.style.display = "none";
//   }
//   if (event.target == walletmodal) {
//     walletmodal.style.display = 'none';
//   }
// } 
