var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var logger = require('morgan');


function get_portfolio_info() {
	var exclude_projects = ['Disney'];
	var projects_info = fs.readdirSync(path.join(__dirname,'views','portfolio'));
	var portfolio_info=[];
	for (var i = 0; i < projects_info.length; i++) {
		var file_name = __dirname + '/views/portfolio/' + projects_info[i];
		if (exclude_projects.indexOf(projects_info[i]) < 0 ) {
			console.log('Reading: ' + file_name);
			var project_file = fs.readFileSync(file_name).toString().split('\n');
			var images = [];

			for (var j = 1; j < project_file.length; j++) {
				//img_url
				if (!project_file[j].startsWith('#')) {
					images.push(project_file[j]);
				}
			}

			//title;sub_title;thumb
			var project_info = project_file[0].split(';');
			portfolio_info.push({
				title: project_info[0],
				sub_title: project_info[1],
				thumb: project_info[2],
				images: images
			});
		}
		else {
			console.log('Excluding: ' + file_name)
		}
	}

	return portfolio_info
}

function does_blog_exists(portfolio_requsted) {
	return fs.existsSync(path.join('views','blogs', portfolio_requsted + '.ejs'));
}

function get_blog_list(){
	return fs.readdirSync(path.join('views', 'blogs'))
}


app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, '/public')));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(logger());
app.get('/', function(request, response) {
	response.render('pages/index', {
		title: 'Portfolio',
		sub_title: 'Sharing some of the moments captured on my travels',
		portfolio_info: get_portfolio_info(),
		blog_info: get_blog_list()
	});
});

// app.post('/', function(request, response) {
// 	console.log(request);
// 	console.log('  ');
// 	console.log('  ');
// 	console.log(request);
// 	response.send('<p> Will implement this soon... </p>');
// });

app.get('/blog/:name', function(request, response){
	var blogReq = request.params.name;

	response.render('blogs/' + blogReq, {
		portfolio_info: portfolio_info,
		blog_info: get_blog_list()
	})
});

app.get('/portfolio/:name', function(request, response) {
	var name = request.params.name;
	portfolio_info = get_portfolio_info();
	if (name != 'favicon.ico'){
		for(var i=0;i<portfolio_info.length;i++) {
			if(portfolio_info[i].title == name) {
				response.render('pages/blog', {
					title: portfolio_info[i]['title'],
					sub_title: portfolio_info[i]['sub_title'],
					thumb: portfolio_info[i]['thumb'],
					blog_exists: does_blog_exists(name),
					images: portfolio_info[i]['images'],
					portfolio_info: portfolio_info,
					blog_info: get_blog_list()
				});
			}
		}
	}
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


