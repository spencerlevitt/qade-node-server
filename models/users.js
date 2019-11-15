
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema;

var postSchema = new Schema({
    userID:{type : String , default: null},
    UUID:{type : String , default: null},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('users', postSchema);