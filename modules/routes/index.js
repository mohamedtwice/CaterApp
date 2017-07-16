var express = require('express');
var router = express.Router();
var path = require('path');
var user = require('../user');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

//base url hit
router.get('/', function(req, res) {
  console.log('base url hit');
  res.sendFile(path.resolve('public/views/index.html'));
});


router.post('/', function(req, res) {
  console.log('base url post hit:', req.body);
  user.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) {
      console.log('find user error:', err);
      res.sendStatus(400);
    } //end if err
    else {
      if (user != undefined) {
        console.log('comparing:', req.body.password, user.password);
        bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
          if (err) {
            console.log('compare error:', err);
            res.sendStatus(400);
          } //end if
          else {
            console.log('found u!');
            if (isMatch) {
              res.send('hooray');
            } else {
              res.send('bummer');
            }
          }
        }); //end bcrypt
      } //end if user defined
      else {
        console.log('no user found');
        res.sendStatus(400);
      }
    } // end of else
  }); //end findOne

}); //end post

// router.get('/', function(req, res) {
//   console.log('user get hit');
//   userModel.find().then(function(data) {
//     console.log(data);
//     res.send(data);
//   }); //end model
// }); //end get

router.get('/', function(req, res) {
  db.things.find('', function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.json(users);
    }
  });
});

module.exports = router;
