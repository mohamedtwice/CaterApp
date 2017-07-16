myApp.service('addOrderService', function($http) {
  console.log('in addOrderService');
  var sv = this;

  sv.name = '';
  sv.allOrders = []


  sv.sendAddOrder = function(data) {
    console.log('in sendAddOrder', data);

    return $http({
      method: 'POST',
      url: '/orders',
      data: data
    }).then(function(response) {
      console.log('back from add order post', response);
      return response
      response = allOrders
    }); //end then function

  }; //end sendAddOrder

  // sv.sendUpdatedOrder = function(data) {
  //   console.log('in sendUpdatedOrder', data);
  //
  //   // sv.putPost = function(path, id, its) {
  //   // console.log('its: ', its);
  //   // return $http.put(path + '/'+ id, its).then(function(response){
  //   return $http.put(data).then(function(response) {
  //     console.log('updated', response);
  //     return response;
  //   });
  // }; //end sendUpdatedOrder


  sv.updateOrders = function(id, updatedOrder) {
    sv.updateOrderDetails = function(id, updatedOrderDetails) {
      console.log(updatedOrderDetails);
      return $http({
        method: 'PUT',
        url: '/orders/' + id,
        data: updatedOrder
      }).then(function(response) {
        console.log('in service, back from server:', response.config.data);
        var singleUpdate = response.config.data;
      }); // end $http
    }; // end updateOrderDetails
  }; // end updateOrderDetails




  sv.nameIntake = function(data) {
    sv.name = data;
    console.log('in nameintake', sv.name);
  };


}); // end service
