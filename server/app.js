var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var connectionString = "postgres://localhost:5432/sigma";
var bodyParser = require('body-parser');

/*** Build out a module to manage our treats requests. ***/
var treats = require('./routes/treats');

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(path.resolve('./server/public/views/index.html'));
});

app.use(express.static('./server/public'));

app.use('/treats', treats);

app.listen(port, function() {
  console.log('Server running on port: ', port);
});
