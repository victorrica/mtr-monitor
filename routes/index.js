var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection(require("../DB.json"));

router.get('/', function(req, res, next) {
	var query = connection.query('select * from Log',function(err,rows){
		var Logdata = new Array();
		
		for(count in rows) {
			var value = rows[count];
			
			Logdata.push({
				'sourceIp' : value.sourceIp,
				'startTime' : value.startTime,
				'traceDestination' : value.sourceIp,
				'lossPercentage' : value.lossPercentage
			});
			
		}
		res.render('index', { title: 'MTR Monitor', data: JSON.stringify(Logdata) });
    });
});

module.exports = router;
