var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var logger = require('morgan');

var gallery_info=[];

function update_gallery_info() {
	var projects_info = fs.readFileSync(path.join(__dirname,'views','templates','projects.txt')).toString().split('\n');
	gallery_info=[];
	for (var i = 0; i < projects_info.length; i++) {
		var file_name = __dirname + '/views/templates/projects/' + projects_info[i];
		if (fs.existsSync(file_name)) {
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
			gallery_info.push({
				title: project_info[0],
				sub_title: project_info[1],
				thumb: project_info[2],
				images: images
			});
		}
		else {
			console.log("Can't find: " + file_name);
			gallery_info.push({
				title: projects_info[i].split('.')[0],
				sub_title: 'Coming Soon!',
				thumb: 'http://www.booktrip4me.com/Content/images/Coming-Soon.png',
				images: ['http://www.booktrip4me.com/Content/images/Coming-Soon.png']
			})
		}
	}
}

function does_blog_exists(gallery_requsted) {
	return fs.existsSync(path.join('views','blogs', gallery_requsted + '.ejs'));
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
	update_gallery_info();
	response.render('pages/index', {
		title: 'Portfolio',
	  	sub_title: 'Sharing some of the moments captured on my travels',
		gallery_info: gallery_info,
		blog_info: get_blog_list()
  	});
});

app.post('/', function(request, response) {
	console.log(request);
	console.log('  ');
	console.log('  ');
	console.log(request);
	response.send('<p> Will implement this soon... </p>');
});

app.get('/blog/:name', function(request, response){
	var blogReq = request.params.name;

	response.render('blogs/' + blogReq, {
		gallery_info: gallery_info,
		blog_info: get_blog_list()
	})
});

app.get('/gallery/:name', function(request, response) {
  	var name = request.params.name;
	update_gallery_info();
	if (name != 'favicon.ico'){
    	for(var i=0;i<gallery_info.length;i++) {
      		if(gallery_info[i].title == name) {
        		response.render('pages/blog', {
					title: gallery_info[i]['title'],
					sub_title: gallery_info[i]['sub_title'],
					thumb: gallery_info[i]['thumb'],
					main: false,
					blog_exists: does_blog_exists(name),
					images: gallery_info[i]['images'],
					gallery_info: gallery_info,
					blog_info: get_blog_list()
        		});
      	}
    }
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


