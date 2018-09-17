var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');



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
		portfolio_info: 'get_portfolio_info()',
		blog_info: 'get_blog_list()'
	});
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


