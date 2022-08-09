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
  else console.log('Database Connects!-----------mint');
});



router.get('/', function (req, res, next) {
  res.render('mint');
});


router.get('/', function (req, res, next) {
  res.render('mint', { title: 'Express' });
});

router.post('/mint', function (req, res, next) {

  // <!-- tktkid,amt,user -->

   var tkid = req.body.tkid;
  console.log(tkid);

  var amt = req.body.amt;
  console.log(amt);

  var  user = req.body.user;
  console.log("user", user);

  // ads, amt
   /////////////////////////////////////////////////
   var  bits = web3.eth.abi.encodeParameters(['uint256', 'uint256', 'address', 'bool'], [tkid, amt, user, true]);
    console.log("encode", bits)

    // var element = "anything you want in the array";

    var  decobits = web3.eth.abi.decodeParameters(['uint256', 'uint256', 'address', 'bool'], bits);
    console.log("decode", decobits);

    /////////////////////////////////////////////


  // var passArray = contract.passArray(otherNumbers);

  var resp = MyContract.methods.mint(tkid, amt, user).send({ from: user, gas: 6000000, value: Web3.utils.toWei(amt, 'ether') }).on('transactionHash', (hash) => {
    console.log("lets go", hash);
    console.log(resp)

  }).on('error', (error) => {
    console.log(error.message);
    alert("something wrong  🙅️");

  });



  connection.query("insert into mint(tkid, amt, user,bits,uploadFile,uploadbits,cash,cashbits,enabled) values(?,?,?,?,?,?,?,?,?)", [tkid, amt, user,bits,"","","","",false], function (err, results, fields) {
    if (err) throw err;
    else {
      res.render("mint.ejs");
      console.log("ok!...")

    }
  });


});



module.exports = router;









