var express = require('express');
var router = express.Router();

// Include Schema
var Game = require('../mongodb/game-schema');

console.log(Game);

router.get('/', function (req, res, next) {
    res.send('API for Capillary Hiring challenge.');
});


router.get('/games', function (req, res, next) {
    console.log(req.body);
    Game.findOne({}, 'title, platform, score', function (err, games) {
        if(err) return handleError(err);
        console.log(games);
    });
    res.send('respond with a resource');
});

module.exports = router;
