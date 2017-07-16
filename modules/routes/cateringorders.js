var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var user = require('../user');
var path = require('path');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
// var twilio = require('twilio');

router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());

//orderSchema Schema
var orderSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  email: String,
  organization: String,
  numberofpeople: Number,
  date: {
    type: Date
  },
  time: String,
  dorp: String,
  streetaddress: String,
  city: String,
  zip: String,
  pickupfrom: String,
  cateringtypes: String,
  cateringpackage: String,
  appetizeroptions: String,
  boxedlunchoptions: String,
  buffetstyleoptions: String,
  entreeselection: String,
  entreeselection2: String,
  entreeselection3: String,
  additionalcomments: String,
  status: String,
  created: {
    type: Date,
    default: Date.now
  },
  ordernew: {
    type: Boolean,
    default: true
  }

}); //end Schema

var orderModel = mongoose.model('orderModel', orderSchema);


router.post('/', function(req, res) {
  // console.log(res);
  res.send('heres your shit');

  var orderToAdd = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phone: req.body.phone,
    email: req.body.email,
    organization: req.body.organization,
    numberofpeople: req.body.numberofpeople,
    date: req.body.date,
    time: req.body.time,
    dorp: req.body.dorp,
    streetaddress: req.body.streetaddress,
    city: req.body.city,
    zip: req.body.zip,
    pickupfrom: req.body.pickupfrom,
    cateringtypes: req.body.cateringtypes,
    cateringpackage: req.body.cateringpackage,
    appetizeroptions: req.body.appetizeroptions,
    boxedlunchoptions: req.body.boxedlunchoptions,
    buffetstyleoptions: req.body.buffetstyleoptions,
    entreeselection: req.body.entreeselection,
    entreeselection2: req.body.entreeselection2,
    entreeselection3: req.body.entreeselection3,
    additionalcomments: req.body.additionalcomments,
    status: "New Order",
    ordernew: true
  };

  var NewOrder = orderModel(orderToAdd);

  NewOrder.save();
  console.log(NewOrder);

});

router.get('/', function(req, res) {
  console.log('get hit');
  orderModel.find().then(function(data) {
    console.log(data);
    res.send(data);
  }); //end model
}); //end get

router.get('/:id', function(req, res) {
  console.log('/orders GET by id route hit');
  var id = req.params.id;
  orderModel.findOne({
    _id: id
  }).then(function(data) {
    res.send(data);
  }); // end findbyId
}); // end get

router.get("/:id", function(req, res) {
  console.log(req.params.id);
  orderModel.findById(req.params.id, function(err, data) {
    if (err)
      console.log(data);
    res.send(data);
  });
});

router.put('/:id', function(req, res) {
  var id = req.params.id;
  console.log(req.params);
  var updatedOrderDetails = req.body;
  console.log(req.body);
  orderModel.update({
    _id: id
  }, updatedOrderDetails).then(function() {
    res.sendStatus(200);
  });
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thecaterapp@gmail.com', //YOUR GMAIL USER HERE -> EXAMPLE@gmail.com
    pass: 'fillyourbelly' //YOUR GMAIL PASSWORD, DO NOT HOST THIS INFO ON GITHUB!
  }
});
//
// var client = twilio(config.accountSid, config.authToken);
// // var tmClient = new TMClient('USERNAME', 'API KEY');


router.post('/email', function(req, res) {
  var mailer = req.body;
  console.log(mailer);

  var mailOptions = {
    //example: from: '"Scott" scott@primeacademy.io',
    from: 'thecaterapp@gmail.com', // sender address -> //YOUR GMAIL USER HERE IN STRING + email not in string! -> EXAMPLE@gmail.com
    to: 'mohamedtwice@gmail.com', // list of receivers
    subject: 'CaterAPP: ' + mailer.subject, // Subject line
    text: mailer.customerName + mailer.customerEmail + mailer.message, // plain text body
    html: '<p>From:< br >' + mailer.customerName + ',' + mailer.customerEmail + ' < hr / > ' + mailer.message + ' < /p>' // html body
    // text: 'Your catering request has been received and we will be contacting you soon to confirm your order. Thank you!', // plain text body
    // html: '<b>Your catering request has been received and we will be contacting you soon to confirm your order.Thank you!</b>' // html body
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });

  res.send(200);
});
//
// router.post('/text', function(req, res) {
//   console.log("req body: ", req.body);
//   client.messages.create({
//     to: req.body.toNumber,
//     from: config.numberSRC,
//     body: 'A new catering request has been created.', // plain text body,
//   }, function(err, message) {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//     } else {
//       console.log(message.sid);
//       res.sendStatus(200);
//     }
//   });
// });

router.delete('/:id', function(req, res) {
  console.log('delete order in database', req.params.id);
  orderModel.remove({
    _id: req.params.id
  }).then(function(err) {
    if (!err) {
      res.send('');
    } else {
      res.send('error');
    }
  });
});


module.exports = router;
