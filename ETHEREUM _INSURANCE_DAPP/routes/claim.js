var express = require('express');
var router = express.Router();

var ipfsAPI = require('ipfs-api');

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
    else console.log('Database Connects!-----------claim');
});





/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('claim', { title: 'Express' });
})
router.post('/', function (req, res, next) {

    const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

    var user = req.body.user;
    console.log(user);

    data = req.body;
    // uid = req.body.id;

    myFileBuffer = req.files.uploadFile.data;
    console.log(myFileBuffer);
    ipfs.files.add(myFileBuffer, function (err, file) {
        if (err) throw err;

        let url = `https://ipfs.io/ipfs/${file[0].hash}`;
        console.log(`Url --> ${url}`);


        var uploadbits = web3.eth.abi.encodeParameters(['address', 'string'], [user, url]);
        console.log("encode", uploadbits)

        // var element = "anything you want in the array";

        var decobits = web3.eth.abi.decodeParameters(['address', 'string'], uploadbits);
        console.log("decode", decobits);

        /////////////////////////////////////////////

        res.send(`IPFS HASH OF PDF ----- ${url}`);

        console.log(data);
        MyContract.methods.claim(file[0].hash).send({ from: user, gas: 6000000 })


        console.log("<====Console Success====>")




        var query = ` UPDATE mint SET uploadFile = "${url}" , uploadbits = "${uploadbits}" WHERE user = "${user}" `;

        connection.query(query, function (error, data) {

            if (error) {
                throw error;
            }
            else {
                console.log("success")
            }

        });

    });


});



module.exports = router;

