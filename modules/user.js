var mongoose = require('mongoose');

// mongoose.connect('mongodb://heroku_m74f1pc9:57fraqcjsdjcrjcuh1lb83pedi@ds161099.mlab.com:61099/heroku_m74f1pc9');
mongoose.connect('localhost:27017/myorderapp');


var userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  right: {
    type: String,
    default: '1'
  }
});

var userModel = mongoose.model('userModel', userSchema);
// var orderModel = mongoose.model('orderModel', orderSchema);

module.exports = userModel;
