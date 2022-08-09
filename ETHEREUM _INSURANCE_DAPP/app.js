var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('req-flash');
var cors = require('cors')
//---------------------------------------------------
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
var multer  = require('multer');
//----------------------------------------------------
var Web3 = require("web3");
var mintRouter = require('./routes/mint');
var claimRouter = require('./routes/claim');
var viewRouter = require('./routes/view');

var usersRouter = require('./routes/users');
var amtto_userRouter = require('./routes/amtto_user');

var app = express();

var fileUpload = require('express-fileupload');

//-------------------------------------WEB3 Integration starts-----------------------------------------------------------------------
var MyContractJSON  = require(path.join(__dirname, 'build/contracts/insurance.json'));
var Web3 = require("web3");
const web3 = new Web3('http://localhost:7545');
accountAddress = "0x3ab322917e33B21d82458f0F50F6442d1DAF6054"; //Ganache
const contractAddress = MyContractJSON.networks['5777'].address;
const contractAbi = MyContractJSON.abi;
MyContract = new web3.eth.Contract(contractAbi, contractAddress);

//-------------------------------------WEB3 Integration starts-----------------------------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mintRouter);
app.use('/claim', claimRouter);
app.use('/view', viewRouter);

app.use('/users', usersRouter);
app.use('/amtto_user',amtto_userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/download/:ID',function(req,res){
  console.log(req.params.ID);
  res.redirect('https://ipfs.io/ipfs/'+req.params.ID);
})



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;
