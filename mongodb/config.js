
var mongoose = require('mongoose');

// Database connectivity
var mongoOptions = {
    user: '',
    pass: ''
};
var url = '127.0.0.1:27017/capillary';

mongoose.connect(url, mongoOptions);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function(){
    console.log('Connected to Database!');
});

module.exports = mongoose;

