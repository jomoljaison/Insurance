var express = require('express');
var router = express.Router();

var Web3 = require("web3");
const web3 = new Web3('http://localhost:7545');
var alert = require('alert');
const mysql = require('mysql');




const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mynewpassword',
  database: 'mint'
});

connection.connect(function (error) {
  if (!!error) console.log(error);
  else console.log('Database Connects!-----------amtto_user');
});



router.get('/', function (req, res, next) {
  res.render('amtto_user', { title: 'Express' });
});

router.post('/', function (req, res, next) {

  // <!-- tktkid,amt,user -->


  var cash = req.body.cash;
  console.log(cash);

  var  user = req.body.user;
  console.log("user", user);

  // ads, amt
   /////////////////////////////////////////////////
   var  cashbits = web3.eth.abi.encodeParameters([ 'uint256', 'address', 'bool'], [ cash, user, true]);
    console.log("encode", cashbits)

    // var element = "anything you want in the array";

    var  decobits = web3.eth.abi.decodeParameters(['uint256', 'address', 'bool'], cashbits);
    console.log("decode", decobits);

    /////////////////////////////////////////////


  // var passArray = contract.passArray(otherNumbers);

  var resp = MyContract.methods.amtto_user(user,cash).send({ from: accountAddress,to:user, gas: 6000000, value: Web3.utils.toWei(cash, 'ether') }).on('transactionHash', (hash) => {
    console.log("lets go", hash);
    res.send(hash);
    console.log(resp)

  }).on('error', (error) => {
    console.log(error.message);
    // alert("something wrong  🙅️");

  });



  var query = ` UPDATE mint SET cash = "${cash}" , cashbits = "${cashbits}",enabled = true WHERE user = "${user}" `;

  connection.query(query, function (error, data) {

      if (error) {
          throw error;
      }
      else {
          console.log("success")
      }

  });




});



module.exports = router;









