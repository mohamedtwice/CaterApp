myApp.service('allOrdersService', function($http, $location) {
  console.log('in allOrdersService');

  var sv = this;

  var orderList = {
    orders: []
  };

  var userList = {
    users: []
  };

  //selected order from list
  sv.singleOrder = {};

  sv.sendLogIn = function(data) {
    console.log('in sendlogin', data);
    return $http({
      method: 'POST',
      url: '/',
      data: data
    }).then(function(response) {
      console.log('back from register attempt:', response);
      if (response.data == 'hooray') {
        console.log('logged in');
        sv.loggedIn = true;
        sv.registeredUser = !sv.registeredUser;
        console.log('registeredUser in service', sv.registeredUser);
        console.log('registeredUser in service', sv.registeredUser);
        return sv.registeredUser;
      } //end logged in
      else {
        sv.loggedIn = false;
        return sv.error;

      }
    }); // end http
  };

  sv.sendRegister = function(data) {
    console.log('in sendRegister', data);
    return $http({
      method: 'POST',
      url: '/register',
      data: data
    }).then(function(response) {
      console.log('back from register attempt:', response);
    }); // end http
  };

  sv.getUsers = function() {
    console.log('in get item in service');
    return $http.get('/').then(function(response) {
      console.log('back from getUsers with', response);
      return response;
    });
  };


  sv.displayOrderDetails = function(id) {
    return $http.get('/orders/' + id).then(function(data) {
      console.log('back from db:', data.data);
      return data.data;
    }); // end $http
  }; // end displayOrderDetails

  sv.updateOrderDetails = function(id, updatedOrderDetails) {
    console.log(updatedOrderDetails);
    return $http({
      method: 'PUT',
      url: '/orders/' + id,
      data: updatedOrderDetails
    }).then(function(response) {
      console.log('in service, back from server:', response.config.data);
      var singleUpdate = response.config.data;
    }); // end $http
  }; // end updateOrderDetails

  sv.getOrders = function() {
    console.log('in get item in service');
    return $http.get('/orders').then(function(response) {
      console.log('back from getOrders with', response);
      return response.data;
    });
  };

  sv.getSingleOrder = function(id) {
    console.log('in get item in service');
    return $http.get('/orders' + '/' + id).then(function(response) {
      console.log('back from the single get with', response.data);
      // $location.path('/singleorder');
      singleOrder = response.data;
      return singleOrder;
    });
  };

  sv.deleteOrder = function(id) {
    return $http.delete('/orders' + '/' + id).then(function(response) {
      console.log('deleted', response);
      return response;
    });
  };


});
