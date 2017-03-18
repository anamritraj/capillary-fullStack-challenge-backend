var Mongoose = require('./config');
var Schema = Mongoose.Schema;

var gameSchema = new Schema({
    title:  String,
    platform: String,
    score:   String,
    genere: String,
    editors_choice: String
});

var Game = Mongoose.model('Game', gameSchema);

module.exports = Game;
