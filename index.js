var express = require('express');
var app = express();

var things = {
	title: 'Vancouver', sub_title: 'Summer 2016', images: {
		url:'http://tinyurl.com/jason-one-jpg',
		thumb:'http://localhost:5000/lens/images/thumbs/01.jpg',
		desc:'Jason Posing'
	}
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index', {
  	title: 'rpateltravels',
    sub_title: '(alltravelthings)',
    things: things
  });
});

app.get('/:type', function(request, response) {
  reqType = request.params.type
  if (reqType != 'favicon.ico'){
	  response.render('pages/' + request.params.type );
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


