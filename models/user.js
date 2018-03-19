var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect("mongodb://localhost/discovery_feed_login");

var db = mongoose.connection;

var UserSchema = mongoose.Schema({

    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }

});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    // Hash password
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback ) {
    bcrypt.compare(candidatePassword, hash, function (error, isMatch) {
        if(error) { throw error }
        callback(null, isMatch);
    })
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}