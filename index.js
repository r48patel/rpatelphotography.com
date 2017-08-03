var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var logger = require('morgan');

// Which projects to exclud
var exclude_projects = ['Disney', '.DS_Store'];

var portfolio_details = {}

function read_portfolio_file(file_name){
	// console.log('Reading: ' + file_name);
	
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
	var info = {
		title: project_info[0],
		sub_title: project_info[1],
		thumb: project_info[2],
		link: 'portfolio/'+project_info[0],
		images: images
	};

	portfolio_details[project_info[0]] = info

	return info
}

function get_portfolio_info(location) {
	if (typeof location === 'undefined') {
		location = path.join(__dirname,'views','portfolio')
	}

	// console.log(location)

	var projects_info = fs.readdirSync(path.join(location));
	var portfolio_info=[];
	for (var i = 0; i < projects_info.length; i++) {
		var file_name = path.join(location, projects_info[i]);
		if (exclude_projects.indexOf(projects_info[i]) < 0 ) {
			if(fs.lstatSync(file_name).isDirectory()){
				// console.log(file_name + ' is a dir');
				multi_info = get_portfolio_info(file_name)
				// console.log(file_name.split("/").pop())
				portfolio_info.push({
					title: file_name.split("/").pop(),
					sub_title: 'Various',
					thumb: multi_info[0]['thumb'],
					link: '/' + file_name.split("/").pop()
				})
			}
			else {
				info = read_portfolio_file(file_name)
				portfolio_info.push(info)
			}
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
app.get('/:name', function(request, response) {
	var multiPortfolio = request.params.name;
	// console.log(multiPortfolio);
	info = get_portfolio_info(path.join(__dirname,'views','portfolio', multiPortfolio))
	// console.log(info)
	response.render('pages/index', {
		title: multiPortfolio,
		sub_title: 'Various pictures from ' + multiPortfolio,
		portfolio_info: info,
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
		portfolio_info: get_portfolio_info(),
		blog_info: get_blog_list()
	})
});

app.get('/portfolio/:name', function(request, response) {
	var name = request.params.name;
	portfolio_info = get_portfolio_info();
	
	asking_portfolio = portfolio_details[name];

	if (name != 'favicon.ico'){
		response.render('pages/portfolio', {
			title: asking_portfolio['title'],
			sub_title: asking_portfolio['sub_title'],
			thumb: asking_portfolio['thumb'],
			blog_exists: does_blog_exists(name),
			images: asking_portfolio['images'],
			portfolio_info: portfolio_info,
			blog_info: get_blog_list()
		});
	}
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


