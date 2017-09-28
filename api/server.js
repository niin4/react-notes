var http     = require('http'),
	express  = require('express'),
	mysql    = require('mysql'),
	parser   = require('body-parser'),
	cors = require('cors');
 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'notes'
});
try {
	connection.connect();
	
} catch(e) {
	console.log('Database Connetion failed:' + e);
}
 
var app = express();
app.use(cors());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);
 
app.get('/', function (req, res) {
	
});

app.get('/notes/:id', function (req,res) {
	var id = req.params.id;
 
	connection.query('SELECT * from notes_notes where notes_user = ?', [id], function(err, rows, fields) {
  		if (!err){
  			var response = [];

			if (rows.length != 0) {
				response.push({'result' : 'success', 'data' : rows});
			} else {
				response.push({'result' : 'error', 'msg' : 'No Results Found'});
			}
 
			res.setHeader('Access-Control-Allow-Origin', '*');
	    	res.status(200).send(response);
  		} else {
		    res.status(400).send(err);
				
	  	}
	});
});

app.post('/notes', function (req,res) {
	var response = [];
 
	if (
		typeof req.body.notes_user !== 'undefined' && 
		typeof req.body.notes_name !== 'undefined' && 
		typeof req.body.notes_text !== 'undefined'
	) {
		var user = req.body.notes_user, name = req.body.name, text = req.body.notes_text;
 
		connection.query('INSERT INTO notes_notes (notes_user, notes_name, notes_text) VALUES (?, ?, ?)', 
			[user, name, text], 
			function(err, result) {
		  		if (!err){
 
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}
 
					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});
 
	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.status(200).send(JSON.stringify(response));
	}
});

app.post('/notes/edit/:id', function (req,res) {
	var id = req.params.id, response = [];
	console.log(req.body.name);

	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.text !== 'undefined' 
	) {
		var name = req.body.name, text = req.body.text;
		connection.query('UPDATE notes_notes SET notes_name = ?, notes_text = ? WHERE notes_id = ?', 
		[name, text, id], 
			function(err, result) {
		  		if (!err){
 
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}
 
					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});
 
	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required information'});
		res.setHeader('Content-Type', 'application/json');
    	res.send(200, JSON.stringify(response));
	}
});

app.delete('/notes/delete/:id', function (req,res) {
	var id = req.params.id, response = [];
 
		connection.query('DELETE from notes_notes WHERE notes_id = ?', 
		[id], 
			function(err, result) {
		  		if (!err){
 
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}
 
					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});

});
 
http.createServer(app).listen(app.get('port'), function(){
	console.log('Server listening on port ' + app.get('port'));
});

