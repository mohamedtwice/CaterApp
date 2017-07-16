var myApp = angular.module('myApp', ['ngRoute', '720kb.datepicker', 'ps.inputTime']);

myApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/partials/signin.html',
    controller: 'MainController as mc'
  }).when('/order', {
    templateUrl: 'views/partials/order.html',
  }).when('/workflow', {
    templateUrl: 'views/partials/workflow.html',
    controller: 'MainController as mc'
  }).when('/calendar', {
    templateUrl: "views/partials/calendar.html"
  }).when('/customers', {
    templateUrl: "views/partials/customers.html"
  }).when('/allorders', {
    templateUrl: "views/partials/allorders.html"
  }).when('/single', {
    templateUrl: "views/partials/single.html"
  }); //end submit
}); //end config

myApp.controller('MainController', function(allOrdersService, addOrderService, $location) {
  console.log('in main controller');

  var vm = this;
  vm.loggingIn = false;
  vm.registeredUser = false;
  vm.allOrders = [];
  // vm.singleOrder = {};
  // vm.singleOrderArray = {};
  vm.singleOrder = allOrdersService.singleOrder;

  vm.Math = window.Math;

  vm.date = new Date(2017, 7, 19);
  vm.time = new Date();

  vm.downloadPdf = function() {
    console.log('downloadPdf');
    // var docDefinition = {
    //   content: 'This is an sample PDF printed with pdfMake'
    // };
    html2canvas(document.getElementById('exportthis'), {
      onrendered: function(canvas) {
        var data = canvas.toDataURL();
        var docDefinition = {
          content: [{
            image: data,
            width: 500,
            // pageMargins: [40, 60, 40, 60],
          }]
        };
        // pdfMake.createPdf(docDefinition).download();
        pdfMake.createPdf(docDefinition).open();
      }
    });
  };


  vm.logIn = function() {
    console.log('in login');
    var userInfo = {
      username: vm.usernameInput,
      password: vm.passwordInput
    }; // end user info

    if (vm.usernameInput == undefined || vm.passwordInput == undefined || vm.usernameInput == '' || vm.passwordInput == '') {
      alert('No username or password entered');
    } //end if
    else {
      allOrdersService.sendLogIn(userInfo).then(function() {
        vm.name = vm.usernameInput;
        console.log(vm.name, vm.usernameInput);
        vm.usernameInput = '';
        vm.passwordInput = '';
        console.log(vm.name, vm.usernameInput);
        // Allows for order form to show when logged in
        vm.hasName = allOrdersService.loggedIn;
        vm.registeredUser = allOrdersService.registeredUser;
        // Allows toggle to show user is logged in
        addOrderService.nameIntake(vm.name);
      }); // end allOrdersService
    } //end else
  }; //end login

  //logout
  vm.logOut = function() {
    console.log('logging out:', vm.name);
    vm.registeredUser = !vm.registeredUser;
    vm.username = '';
  };
  //end logout

  vm.register = function() {
    console.log('in regiter');
    var userInfo = {
      username: vm.usernameRegister,
      password: vm.passwordRegister
    }; // end user info

    allOrdersService.sendRegister(userInfo).then(function() {
      vm.usernameRegister = '';
      vm.passwordRegister = '';
    }); // end allOrdersService
  }; // end register

  // start toggleLogin
  vm.toggleLogin = function() {
    vm.loggingIn = !vm.loggingIn;
  };

  vm.addOrder = function() {
    console.log('in add item', vm.usernameInput);
    var objectToSend = {
      // name: addOrderService.name,
      firstname: vm.firstname,
      lastname: vm.lastname,
      phone: vm.phone,
      email: vm.email,
      organization: vm.organization,
      numberofpeople: vm.numberofpeople,
      dorp: vm.dorp,
      date: vm.date,
      time: vm.time,
      streetaddress: vm.streetaddress,
      city: vm.city,
      zip: vm.zip,
      pickupfrom: vm.pickupfrom,
      cateringtypes: vm.cateringtypes,
      cateringpackage: vm.cateringpackage,
      appetizeroptions: vm.appetizeroptions,
      boxedlunchoptions: vm.boxedlunchoptions,
      buffetstyleoptions: vm.buffetstyleoptions,
      entreeselection: vm.entreeselection,
      entreeselection2: vm.entreeselection2,
      entreeselection3: vm.entreeselection3,
      additionalcomments: vm.additionalcomments,
      orderstatus: "New Order"

    };

    addOrderService.sendAddOrder(objectToSend).then(function() {
      console.log('back in addOrder from server');

      window.location.reload();
      // vm.formData = {}; // clear the form so our user is ready to enter another
      // // Clear form fields
      // vm.firstname = ' ';
      // vm.lastname = ' ';
      // vm.phone = ' ';
      // vm.email = ' ';
      // vm.organization = ' ';
      // vm.dorp = ' ';
      // vm.numberofpeople = ' ';
      // vm.date = ' ';
      // vm.time = ' ';
      // vm.streetaddress = ' ';
      // vm.city = ' ';
      // vm.zip = ' ';
      // vm.pickupfrom = '';
      // vm.getOrders();
    });
  }; //end addOrder

  vm.getOrders = function() {
    console.log('in getOrders');
    allOrdersService.getOrders().then(function(data) {
      vm.allOrders = data;
      console.log(vm.allOrders);
    });
  };

  vm.deleteOrder = function(id) {
    console.log('in deleteOrder function');
    console.log(id);
    allOrdersService.deleteOrder(id).then(function(data) {
      vm.getOrders();
    });
  };

  vm.viewthisOrder = function(id) {
    console.log('in viewthisOrder function');
    console.log(id);
    allOrdersService.getSingleOrder(id).then(function(data) {
      console.log(data);
      vm.singleOrder = data;
      console.log(vm.singleOrder);
    });
  };

  vm.viewthisCustomer = function(id) {
    console.log('in viewthisOrder function');
    console.log(id);
    allOrdersService.getSingleOrder(id).then(function(data) {
      console.log(data);
      vm.singleOrder = data;
      console.log(vm.singleOrder);
    });
  };


  vm.switchbtn = function() {
    console.log('in switchbtn');
    window.location.reload();
  };

  vm.startOrder = function(id) {
    console.log('in startOrder function');
    console.log(vm._id);
    var updatedOrder = {
      status: "Waiting for Approval"
    };
    addOrderService.updateOrders(id, updatedOrder).then(function(data) {
      vm.getOrders();
      // window.location.reload();
    });
  };
  vm.finalizeOrder = function(id) {
    console.log('in startOrder function');
    console.log(vm._id);
    var updatedOrder = {
      status: "Finalized Order"
    };
    addOrderService.updateOrders(id, updatedOrder).then(function(data) {
      vm.getOrders();
      // window.location.reload();
    });
  };

  vm.updateOrder = function() {
    console.log(vm.order._id);

    var updateToSend = {
      // name: addOrderService.name,
      firstname: vm.firstname,
      lastname: vm.lastname,
      phone: vm.phone,
      email: vm.email,
      organization: vm.organization,
      numberofpeople: vm.numberofpeople,
      dorp: vm.dorp,
      date: vm.date,
      time: vm.time,
      streetaddress: vm.streetaddress,
      city: vm.city,
      zip: vm.zip,
      pickupfrom: vm.pickupfrom,
      additionalcomments: vm.additionalcomments,
      cateringpackage: vm.cateringpackage,
      orderstatus: vm.orderstatus
    };

    addOrderService.sendUpdatedOrder(updateToSend).then(function() {
      console.log('back in updateOrder from server');
      window.location.reload();

    }); //end updateOrder



    // vm.finalizeOrder = function(id) {
    //   console.log('in startOrder function');
    //   console.log(vm.id);
    //
    //   var updatedOrder = {
    //     orderstatus: "Waiting for Payment"
    //   };
    //
    //   addOrderService.updateOrders(id, updatedOrder).then(function(data) {
    //
    //     vm.getOrders();
    //     // window.location.reload();
    //
    //   });
    // };
    //
    // vm.completeOrder = function(id) {
    //   console.log('in startOrder function');
    //   console.log(vm.id);
    //
    //   var updatedOrder = {
    //     orderstatus: "Order Completed"
    //   };
    //
    //   addOrderService.updateOrders(id, updatedOrder).then(function(data) {
    //
    //     vm.getOrders();
    //     // window.location.reload();
    //
    //   });
    // };
    // vm.requestFeedback = function(id) {
    //   console.log('in startOrder function');
    //   console.log(vm.id);
    //
    //   var updatedOrder = {
    //     orderstatus: "Feedback Requested"
    //   };
    //
    //   addOrderService.updateOrders(id, updatedOrder).then(function(data) {
    //     vm.getOrders();
    //     // window.location.reload();
    //
    //   });
    // };
    //
    // vm.receivedFeedback = function(id) {
    //   console.log('in startOrder function');
    //   console.log(vm.id);
    //
    //   var updatedOrder = {
    //     orderstatus: "Feedback Received"
    //   };
    //
    //   addOrderService.archiveOrder(id, updatedOrder).then(function(data) {
    //
    //     vm.getOrders();
    //     // window.location.reload();
    //
    //   });
    // };




    vm.toggleviewOrdersbtn = function() {
      console.log('in toggleviewOrdersbtn');
      window.location.reload();
    };

    vm.events = [{
      startDate: "Sun Nov 01 2015 00:00:00 GMT-0700 (PDT)", //Start Date of the event
      endDate: "Sun Nov 07 2015 13:00:00 GMT-0700 (PDT)", //End Date of the Event
      title: "Test Event", //Title of the event
      description: "Test Event is a test of all tests", // The Description of your event
      image: "http://techwarriorz.com/v2/wp-content/uploads/2014/03/logo-e1394897255145.png" //You can also include an image that will appear on the popover
    }];


    vm.toggleviewOrdersbtn = function() {

    };

    vm.gotoOrders = function() {
      $location.path('/orders');
    };

    vm.gotoaddOrder = function() {
      $location.path('/order');
    };

    vm.events = [{
      startDate: "Sun Nov 01 2015 00:00:00 GMT-0700 (PDT)", //Start Date of the event
      endDate: "Sun Nov 07 2015 13:00:00 GMT-0700 (PDT)", //End Date of the Event
      title: "Test Event", //Title of the event
      description: "Test Event is a test of all tests", // The Description of your event
      image: "http://techwarriorz.com/v2/wp-content/uploads/2014/03/logo-e1394897255145.png" //You can also include an image that will appear on the popover
    }];
  };
});
//end addOrder
// end controller









//spacer









//spacer



//spacer
