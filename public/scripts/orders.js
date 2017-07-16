var myApp = angular.module('myApp', ['ngRoute', '720kb.datepicker', 'ps.inputTime', "xeditable", "ui.bootstrap"]);

myApp.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/partials/signin.html',
    controller: 'MainController as mc'
  }).when('/order', {
    templateUrl: 'views/partials/order.html',
    controller: 'MainController as mc'
  }).when('/ordercatering', {
    templateUrl: 'views/partials/ordercatering.html',
    controller: 'MainController as mc'
  }).when('/workflow', {
    templateUrl: 'views/partials/workflow.html',
    controller: 'MainController as mc'
  }).when('/calendar', {
    templateUrl: 'views/partials/calendar.html',
    controller: 'MainController as mc'
  }).when('/customers', {
    templateUrl: 'views/partials/customers.html',
    controller: 'MainController as mc'
  }).when('/allorders', {
    templateUrl: 'views/partials/allorders.html',
    controller: 'MainController as mc'
  }).when('/single', {
    templateUrl: 'views/partials/single.html',
    controller: 'MainController as mc'
  }).when('/detail/:id', {
    templateUrl: 'views/partials/detail.html',
    controller: 'MainController as mc'
  }).when('/users', {
    templateUrl: 'views/partials/users.html',
    controller: 'MainController as mc'
  }).when('/email', {
    templateUrl: 'views/partials/email.html',
    controller: 'MainController as mc'
  }); //end config
});

myApp.controller('MainController', function(allOrdersService, addOrderService, $location, $routeParams, MailService) {
  console.log('in main controller');

  var vm = this;
  var mailer = this;
  vm.loggingIn = false;
  vm.registeredUser = false;
  vm.allOrders = [];
  // vm.singleOrder = {};
  // vm.singleOrderArray = {};
  vm.singleOrder = allOrdersService.singleOrder;
  vm.order = {};
  // vm.right = 1;
  vm.Math = window.Math;


  vm.date = new Date(2017, 7, 19);
  vm.time = new Date();




  vm.pageload = function() {
    vm.getLocalStorage();
    if (vm.right == 123) {
      vm.page = 'Load';
    } else {
      vm.page = 'Loads';
    }
    getOrders();
  };

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

  vm.displayOrderDetails = function(id) {
    // var id = $routeParams.id;
    console.log('in displayOrderDetails:', id);
    allOrdersService.displayOrderDetails(id).then(function(data) {
      console.log(data);
      vm.order = data;
    }); // end OrderService
  }; // end displayOrderDetails

  // vm.updateOrderDetails = function(id) {

  vm.updateOrderDetails = function() {
    // var plant = vm.plantsToDisplay[index];
    // var id = plant._id;
    var id = vm.singleOrder._id;

    updatedOrderDetails = {
      firstname: vm.singleOrder.firstname,
      lastname: vm.singleOrder.lastname,
      phone: vm.singleOrder.phone,
      email: vm.singleOrder.email,
      organization: vm.singleOrder.organization,
      numberofpeople: vm.singleOrder.numberofpeople,
      date: vm.singleOrder.date,
      time: vm.singleOrder.time,
      dorp: vm.singleOrder.dorp,
      streetaddress: vm.singleOrder.streetaddress,
      city: vm.singleOrder.city,
      zip: vm.singleOrder.zip,
      pickupfrom: vm.singleOrder.pickupfrom,
      cateringtypes: vm.singleOrder.cateringtypes,
      cateringpackage: vm.singleOrder.cateringpackage,
      entreeselection: vm.singleOrder.entreeselection,
      entreeselection2: vm.singleOrder.entreeselection2,
      entreeselection3: vm.singleOrder.entreeselection3,
      additionalcomments: vm.singleOrder.additionalcomments
    };
    console.log(updatedOrderDetails);
    allOrdersService.updateOrderDetails(id, updatedOrderDetails);
  }; // end updateOrderDetails

  //loggingIn
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
        vm.setLocalStorage();
        if (vm.name == 'Mohamed') {
          $location.path('/');
        } else {
          $location.path('/ordercatering');
        }
      }); // end allOrdersService
    } //end else
  }; //end login

  vm.getLocalStorage = function() {
    console.log('in LocalStorageController getLocalStorage');
    var tempy = localStorage.getItem('userInputTest');
    console.log('from localStorage:', tempy);
  }; //end setLocalStorage

  vm.setLocalStorage = function() {
    console.log('in LocalStorageController setLocalStorage:', vm.name);
    localStorage.setItem('userInputTest', vm.name + vm.right);
    vm.usernameInput = '';
  }; //end setLocalStorage


  //logout
  vm.logOut = function() {
    console.log('logging out:', vm.username);
    vm.registeredUser = !vm.registeredUser;
    vm.username = '';
    localStorage.removeItem('vm.name');
    localStorage.removeItem('vm.right');
  };
  //end logout

  vm.register = function() {
    console.log('in regiter');
    var userInfo = {
      name: vm.nameRegister,
      email: vm.emailRegister,
      username: vm.usernameRegister,
      password: vm.passwordRegister,
      right: vm.right
    }; // end user info

    allOrdersService.sendRegister(userInfo).then(function() {

      // window.location.reload();
      vm.nameRegister = '';
      vm.emailRegister = '';
      vm.usernameRegister = '';
      vm.passwordRegister = '';
      // $location.path('/');
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

  vm.getUsers = function() {
    console.log('in getUsers');
    allOrdersService.getUsers().then(function(data) {
      vm.allUsers = data;
      console.log(vm.allUsers);
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
    console.log(id);
    var updatedOrder = {
      status: "Waiting for Approval"
    };
    console.log(updatedOrder);
    allOrdersService.updateOrderDetails(id, updatedOrder);

    // addOrderService.updateOrders(id, updatedOrder);
  };

  vm.finalizeOrder = function(id) {
    console.log('in finalizeOrder function');
    console.log(id);
    var updatedOrder = {
      status: "Finalized Order"
    };
    allOrdersService.updateOrderDetails(id, updatedOrder).then(function(data) {
      window.location.reload();
    });
  };

  vm.completeOrder = function(id) {
    console.log('in finalizeOrder function');
    console.log(id);
    var updatedOrder = {
      status: "Waiting for Feedback"
    };
    allOrdersService.updateOrderDetails(id, updatedOrder).then(function(data) {
      window.location.reload();
    });
  };

  vm.archiveOrder = function(id) {
    console.log('in finalizeOrder function');
    console.log(id);
    var updatedOrder = {
      status: "Archived Order"
    };
    allOrdersService.updateOrderDetails(id, updatedOrder).then(function(data) {
      window.location.reload();
    });
  };

  vm.getLocalStorage = function() {
    console.log('in LocalStorageController getLocalStorage');
    var tempy = localStorage.getItem('vm.name');
    var alriaght = localStorage.getItem('vm.right');

    console.log('from localStorage:', tempy);
  }; //end setLocalStorage

  vm.setLocalStorage = function() {
    localStorage.setItem('userInputTest', vm.name);
    localStorage.setItem('userInputTest', vm.username);
    localStorage.setItem('userInputTest', vm.right);
    console.log('in LocalStorageController setLocalStorage:', vm.name);
    console.log('in LocalStorageController setLocalStorage:', vm.usernameRegister);
    console.log('in LocalStorageController setLocalStorage:', vm.right);
    // vm.usernameInput = '';
  }; //end setLocalStorage

  vm.gotoWorkflow = function() {
    $location.path('/workflow');
  };

  vm.gotoCustomers = function() {
    $location.path('/customers');
  };

  vm.gotoOrders = function() {
    $location.path('/orders');
  };

  vm.gotoaddOrder = function() {
    $location.path('/order');
  };



  mailer.submitForm = function(info) {
    MailService.sendEmail(info);
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




  };
});
//end addOrder
// end controller



myApp.factory('MailService', ['$http', function($http) {
  return {
    sendEmail: function(info) {
      $http.post('/mail', info).then(function(response) {
        console.log("Email has been sent: ", response.data);
      });
    }
  };
}]);
