var express = require('express');
var router = express.Router();
var mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mynewpassword',
    database: 'mint'
});

connection.connect(function (error) {
    if (!!error) console.log(error);
    else console.log('Database Connects!-----------view');
});


router.get('/',(req, res) => {
  // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
  let sql = "SELECT * FROM mint";
  let query = connection.query(sql, (err, rows) => {
    if(err) {
      // render to views/mint/index.ejs
      res.render('view',{mint:''});   
  } else {
      // render to views/mint/index.ejs
      res.render('view',{mint:rows});
  
  }
    });
   } );


  
   


  module.exports = router;