var express = require('express');
var app = express();
var fs = require('fs');

var gallery_info=[];
var projects_info = fs.readFileSync(__dirname + '/views/templates/projects.txt').toString().split('\n');

for(var repeat=0; repeat<1;repeat++){
	for(i in projects_info){ 
		var file_name = __dirname + '/views/templates/projects/' + projects_info[i];
		if(fs.existsSync(file_name)) {
			console.log('Reading: ' + file_name);
			var project_file = fs.readFileSync(file_name).toString().split('\n');
			var images=[];

		  	for(var j=1; j<project_file.length;j++){
				//img_url;img_msg
				if(!project_file[j].startsWith('#')) {
					var picture_info = project_file[j].split(';');
					images.push({
						url: picture_info[0],
						name: picture_info[1],
						msg: picture_info[2]
					});
				}
		  	}

		  	//title;sub_title;thumb;thumb_width
			var project_info = project_file[0].split(';');
		  	gallery_info.push({
		  		title: project_info[0],
		  		sub_title: project_info[1],
		  		thumb: project_info[2],
		  		thumb_width: project_info[3],
		  		images: images
		  	});
		}
		else {
			console.log("Can't find: " + file_name);
			gallery_info.push({
				title: projects_info[i].split('.')[0],
				sub_title:'Coming Soon!',
				thumb: 'http://www.booktrip4me.com/Content/images/Coming-Soon.png',
				thumb_width: '400',
				images: [{
					url: 'http://www.booktrip4me.com/Content/images/Coming-Soon.png',
					name: 'Coming Soon',
					msg: 'Coming Soon'
				}]
			})
		}
	}
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index', {
	  title: 'Portfolio',
	  sub_title: 'Sharing some of the moments captured on my travels',
	  main: true,
	  gallery_info: gallery_info
  });
});

app.post('/', function(request, response) {
	console.log(request);
	console.log('  ');
	console.log('  ');
	console.log(request);
	response.send('<p> Will implement this soon... </p>');
});

app.get('/blog-:name', function(request, response){
	blogReq = request.params.name;

	response.render('blogs/' + blogReq)
});

app.get('/gallery-:type', function(request, response) {
  reqType = request.params.type;

  if (reqType != 'favicon.ico'){
    for(var i=0;i<gallery_info.length;i++) {
      if(gallery_info[i].title == request.params.type) {
        response.render('pages/index', {
			title: gallery_info[i]['title'],
			sub_title: gallery_info[i]['sub_title'],
			main: false,
			gallery_info: gallery_info[i]
        });
      }
    }
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


