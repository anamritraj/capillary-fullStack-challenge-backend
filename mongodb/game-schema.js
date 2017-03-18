var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new mongoose.Schema({
    title:  String,
    platform: String,
    score:   String,
    genere: String,
    editors_choice: String
});

var Game = mongoose.model('Game', gameSchema);
module.exports = Game;
