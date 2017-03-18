var express = require('express');
var router = express.Router();

// Include Schema
var Game = require('../mongodb/game-schema');

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
