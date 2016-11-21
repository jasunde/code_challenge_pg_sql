var express = require('express');
var router = express.Router();
var pg = require('pg');

var pool = new pg.Pool({database: 'sigma'});

// Get all treats
router.get('/', function (req, res) {
  pool
    .connect()
    .then(function (client) {
      client.query('SELECT * FROM treats')
        .then(function (result) {
          client.release();
          res.send(result.rows);
        })
        .catch(function (err) {
          console.log('SELECT error:', err);
          res.sendStatus(500);
        });
    });
});

// Get certain treats
router.get('/:searchTerm', function (req, res) {
  pool
    .connect()
    .then(function (client) {
      client.query(
        'SELECT * FROM treats '+
        'WHERE name ILIKE $1',
        ['%'+req.params.searchTerm+'%']
      )
        .then(function (result) {
          client.release();
          res.send(result.rows);
        })
        .catch(function (err) {
          console.error('SELECT query error:', err.message, err.stack);
        });
    })
})

// Create a new treat
router.post('/', function (req, res) {
  pool
    .connect()
    .then(function (client) {
      var treat = req.body;
      client
        .query(
          'INSERT INTO treats (name, description, pic)'+
          'VALUES ($1, $2, $3)',
          [treat.name, treat.description, treat.url]
        )
        .then(function (result) {
          client.release();
          res.sendStatus(201);
        })
        .catch(function (err) {
          console.log('INSERT error:', err);
          res.sendStatus(500);
        });
  });
});

// Update a treat
router.patch('/:id', function (req, res) {
  var treat = req.body;
  pool
    .connect()
    .then(function (client) {
      var treat = req.body;
      client
        .query(
          'UPDATE treats SET name = $1, description = $2 '+
          'WHERE id = $3',
          [treat.name, treat.description, req.params.id]
        )
        .then(function (result) {
          client.release();
          res.sendStatus(204);
        })
        .catch(function (err) {
          console.log('INSERT error:', err);
          res.sendStatus(500);
        });
  });
});


module.exports = router;
