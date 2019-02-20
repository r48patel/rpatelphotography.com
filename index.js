var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
const { Client } = require('pg')
var shell = require('shelljs');

if(!process.env.DATABASE_URL) {
	var DATABASE_URL = shell.exec("heroku config:get DATABASE_URL --app rpatelphotography")
}
else {
	var DATABASE_URL = process.env.DATABASE_URL
}

function get_recent_less_than_3d() {
	return read_database('select * from rpatelphotography where EXTRACT(DAY FROM now() - updated_at) <= 3 and term != \'Ongoing\' order by updated_at DESC NULLS FIRST, taken_date DESC NULLS FIRST;')
}

function get_other_projects() {
	return read_database('select * from rpatelphotography where EXTRACT(DAY FROM now() - updated_at) > 3 or term = \'Ongoing\' order by updated_at DESC NULLS FIRST, taken_date DESC NULLS FIRST;')
}


async function read_database(query) {
	var projects = []
	const client = new Client({
	  connectionString: DATABASE_URL.toString(),
	  ssl: true,
	});

	client.connect();
	await client.query(query)
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
	get_recent_less_than_3d().then(recent_projects => {
		get_other_projects().then(other_projects => {
			response.render('pages/index', {
				recent_projects: recent_projects,
				other_projects: other_projects
			});
		})
	})
	.catch(e => console.error(e.stack))
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


