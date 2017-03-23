var exec = require('child_process').exec;
var MtrList = require('../list.json');
var mysql = require('../node_modules/mysql');
var optionAwk = "awk 'NR==1 {print $0} END {print $2,$3}'";

var pool = mysql.createPool(require("../DB.json"));

readList();

function readList(){
	for(count in MtrList.data) {
		ip = MtrList.data[count].ip;
		cmd = 'mtr ' + ip + " -rw | " + optionAwk;
		callMtr(cmd,ip);
	}
}

function callMtr(cmd,ip) {
	exec(cmd, function(error, stdout, stderr) {
		parseMtr(stdout,ip);
	});
}

function parseMtr(data,ip) {
	data = data.split(/\r?\n/);
	startTime = new Date(data[0].split("Start: ")[1]);
	sourceIp = ip;
	traceDestination = data[1].split(" ")[0];
	lossPercentage = data[1].split(" ")[1].replace("%","");
	
	dbInsert(startTime, sourceIp, traceDestination, lossPercentage);
}

function dbInsert(startTime,sourceIp,traceDestination,lossPercentage) {
	var logTable = {
		'startTime' : startTime,
	    'sourceIp': sourceIp,
        'traceDestination': traceDestination,
        'lossPercenTage': lossPercentage
    };
    
	pool.getConnection(function(err, connection) {
		var query = connection.query('insert into Log set ?', logTable, function(err,result){
	        if (err) {
	            console.error(err);
	            throw err;
	        }
			connection.destroy();
	    });
	});
}
