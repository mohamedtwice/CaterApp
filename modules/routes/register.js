var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var user = require('../user');
var bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

router.post('/', function(req, res) {
  console.log('in register post', req.body);

  bcrypt.genSalt(12, function(err, salt) {
    if (err) {
      console.log('salt err:', err);
      res.sendStatus(400);
    } //end error
    else {
      console.log('salt:', salt);
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        if (err) {
          console.log('hash err:', err);
          res.sendStatus(400);
        } //end error
        else {
          console.log('hash:', hash);
          var newUser = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: hash,
            right: req.body.right
          };
          console.log('saving user:', newUser);
          // save newUser to DB
          user(newUser).save();
          res.sendStatus(201);
        } // end no error
      }); // end bcrypt hash
    } // end no error
  }); // end bcrypt salt
}); // end of post


module.exports = router;
