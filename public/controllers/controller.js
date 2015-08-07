var myApp = angular.module('myApp', ['ngAutocomplete']);
'use_strict'

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Hello World from controller");
    
    /**
     * http://postmon.com.br/
     * http://avisobrasil.com.br/correio-control/api-de-consulta-de-cep/
     * http://plnkr.co/edit/il2J8qOI2Dr7Ik1KHRm8?p=preview
    */
/* Config para utilização do Autocomplete das cidades. */
$scope.result2 = '';
$scope.options2 = { country: 'br',
                    types: '(cities)'};   
$scope.details2 = '';


$scope.edit = function(doctorObj) {
  console.log(doctorObj);

  console.log(doctorObj);

  $scope.doctorFrm                   = doctorObj;
  $scope.doctorFrm.doctor.speciality = doctorObj.doctor.speciality;

  console.log($scope.doctorFrm.doctor.speciality);
  //$scope.details2.id                 = doctorObj.doctor.cityId;
  //$scope.details2.formatted_address  = doctorObj.doctor.cityState;

  /*$http.get('/contactlist/' + id).success(function(response) {
    $scope.contact = response;
  });*/
}; 

var getSpecialities = function() {  
  var urlApi = 'https://doctorappbknd.herokuapp.com/api/specialities/';  
  $http.get(urlApi).success(function(response){
    $scope.specialitieslist = response;
  });   
};
    
var refresh = function() {  
  //var urlApi = 'https://doctorappbknd.herokuapp.com/api/doctors/';
  var urlApi = '/api/doctors/';
  $http.get(urlApi).success(function(response){
    $scope.doctorlist = response;
  });   
};

getSpecialities();
refresh();


$scope.getAddressByZipcode = function(zipcode){
  
  //alert("Teste: " + zipcode );
  
 var urlApiZip = 'http://api.postmon.com.br/v1/cep/' + zipcode;
  
    $http.get(urlApiZip).success(function(response){
      console.log(response);
      $scope.address = response;
      //$scope.doctorlist = response;
    });
  
};

$scope.addDoctor = function() {
  var newDoctor = {};
  //console.log($scope.doctorFrm);
  //console.log($scope.details2);
  //console.log($scope.details2.formatted_address);

  newDoctor                  = $scope.doctorFrm;
  newDoctor.doctor.cityId    = $scope.details2.id;
  newDoctor.doctor.cityState = $scope.details2.formatted_address;
  //console.log(newDoctor);
 

  $http.post('/api/doctors', newDoctor).success(function(response){
    console.log(response);
    //refresh();    
  });
  /*$scope.doctorFrm.cityId = '4305108'; //ID cidade fixo (Caxias do Sul, ate ajustar processo de cidades.)
  $http.post('/doctor', $scope.doctorFrm).success(function(response) {
    console.log(response);
    refresh();
  });*/
};

$scope.update = function() {
  

  $scope.doctorFrm.doctor.cityId    = $scope.details2.id;
  $scope.doctorFrm.doctor.cityState = $scope.details2.formatted_address;

  //$scope.doctorFrm.doctor.speciality._id = $scope.doctor.speciality._id;
  console.log($scope.doctorFrm.doctor);


 /* $http.put('/api/doctors/' + $scope.doctorFrm;._id, $scope.doctorFrm).success(function(response) {
    refresh();
  })*/
};


/*
$scope.remove = function(id) {
  console.log(id);
  $http.delete('/contactlist/' + id).success(function(response) {
    refresh();
  });
};

$scope.update = function() {
  console.log($scope.contact._id);
  $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
    refresh();
  })
};

$scope.deselect = function() {
  $scope.contact = "";
}*/

}])

/*
myApp.controller("TestCtrl",function ($scope) {

    $scope.result1 = '';
    $scope.options1 = null;
    $scope.details1 = '';



    $scope.result2 = '';
    $scope.options2 = {
      country: 'ca',
      types: '(cities)'
    };   
    $scope.details2 = '';
    
    
    
    $scope.result3 = '';
    $scope.options3 = {
      country: 'gb',
      types: 'establishment'
    };
    $scope.details3 = '';
});*/