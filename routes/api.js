var express = require('express');
var router = express.Router();

// Include Schema
var Game = require('../mongodb/game-schema');

// Middleware function to handle headers
router.use(function(req, res, next) {
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('access-control-allow-methods', 'GET, POST, PUT');
    res.header('access-control-allow-origin', '*');
    res.header('expires', new Date(Date.now()).toUTCString());
    next();
});

router.get('/', function (req, res, next) {
    res.send('API for Capillary Hiring challenge.');
});


router.get('/games', function (req, res, next) {
    Game.find({}, '', function (err, games) {
        if(err) return handleError(err);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(games));
    });
});

module.exports = router;
