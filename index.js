var express = require('express');
var app = express();
// var fs = require('fs');
// var sleep = require('sleep');

// fs.readFile(__dirname + '/views/test.txt', 'utf8', function(err, data){
// 	if (err) {
// 		return console.log(err);
// 	}
// 	sleep.sleep(1)
// 	// console.log(data)
// });

// var file_gallery_info = fs.readFileSync(__dirname + '/views/test.txt').toString();
// console.log('test: ' + file_gallery_info)
// console.log(typeof file_gallery_info)


var gallery_info = [
  {
  	title: 'Vancouver', sub_title: 'Summer 2016', 
    images: {
  		thumb:'http://tinyurl.com/jason-one-jpg',
  		desc:'Jason Posing',
      thumb_width: 285
  	}
  },
  {
    title: 'Seattle', sub_title: 'Summer 2016', images: {
      thumb:'http://tinyurl.com/gnr7s6g',
      desc:'Andrew Posing',
      thumb_width: 285
    }
  }
];

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index', {
  	title: 'rpateltravels',
    sub_title: 'STILL UNDER CONSTRUCTION!',
    gallery_info: gallery_info
  });
});

app.get('/gallery-:type', function(request, response) {
  reqType = request.params.type

  if (reqType != 'favicon.ico'){
    for(var i=0;i<gallery_info.length;i++) {
      if(gallery_info[i].title == request.params.type) {
        response.render('pages/gallery', {
          gallery_info: gallery_info[i]
        });
      }
    }
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


