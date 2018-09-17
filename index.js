var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
const { Client } = require('pg')
var shell = require('shelljs');

if(!process.env.DATABASE_URL) {
	var DATABASE_URL = shell.exec("heroku config:get DATABASE_URL --app rpateltravels")
}
else {
	var DATABASE_URL = process.env.DATABASE_URL
}

async function read_database() {
	var projects = []
	const client = new Client({
	  connectionString: DATABASE_URL.toString(),
	  ssl: true,
	});

	client.connect();
	await client.query('select * from rpateltravels order by taken_date DESC;')
		.then(res => {
			for (var i = 0; i < res.rows.length; i++) {
				projects.push(res.rows[i])
			}
		})
  		.catch(e => console.error(e.stack))
  		.then(() => client.end());
  	return projects
}


app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '/public')));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(logger());
app.get('/', function(request, response) {
	read_database().then(res => {
		response.render('pages/index', {
			info: res
		});
	})
	.catch(e => console.error(e.stack))
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


