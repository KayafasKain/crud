
var app = angular.module('myApp', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);

app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('[{');
	$interpolateProvider.endSymbol('}]');
});

app.factory('exchange', function(){
    return { 
    			updPersonal: '',
				socket:'',
				dltPersonal:''
    	   };
});

app.controller('CRUD', function($scope, $http, $modal, exchange) {
	DATA = this;
	$scope.exchange = exchange;


	//connecting
	try{
   		$scope.socket = io.connect('http://localhost:3000');
   		$scope.exchange.socket = $scope.socket;
   		console.log("connection set up!");
   	} catch(e) {
		alert("connection lost");
	}
    $scope.socket.on('news', function (data) {
    	console.log(data);
    	$scope.socket.emit('my other event', { my: 'data' });
    });

	//Arrays for colelcting data from server
	DATA.Personal = [];
	//A variable for pagination
	DATA.CurrentPage = 0;
	

	if($scope.socket !== undefined){
		console.log("all well");

		//gathering Personal list from the database
		$scope.socket.on('outputPersonal', function( data ){			
				DATA.Personal = data.docs;
				console.log(data);
				$scope.$apply();
				console.log("recivingData");
				console.log(DATA.Personal);
				$scope.$apply();
		});
	}
	
//Personal base work==========================================
	//Pager
	DATA.nextPage = function(){
		DATA.CurrentPage++;
			$scope.socket.emit('getPage',{
				page: DATA.CurrentPage
			});		
	}

	DATA.pervPage = function(){
		if(DATA.CurrentPage >= 1){
			DATA.CurrentPage--;
			$scope.socket.emit('getPage',{
				page: DATA.CurrentPage
			});			
		}
	}


// MODAL Controllers! =====================================

	//upd modal controller
	function editController( $scope, exchange ){
	    $scope.title = 'Update employee';
	    $scope.content = 'Please, enter a correct data';
	    $scope.exchange = exchange;

		console.log($scope.exchange.updPersonal);
		$scope.oldFname = $scope.exchange.updPersonal.fname;
		$scope.oldPhone = $scope.exchange.updPersonal.phone;
		$scope.recordID = $scope.exchange.updPersonal.id;

		$scope.ubdatePersonal = function( ){
				console.log("sended_id "+$scope.recordID);
				var updObject = {
					recID: $scope.recordID,
					name: $scope.exchange.updPersonal.name,
					fname: $scope.exchange.updPersonal.fname,
					phone: $scope.exchange.updPersonal.phone,
					salary: $scope.exchange.updPersonal.salary
				};


				$scope.exchange.socket.emit('pushPersonalToUpdate',{
					updObject: updObject
				});	

			myUpdModal.$promise.then(myUpdModal.hide);

		}		

	}

   	editController.$inject = ['$scope','exchange'];
	var myUpdModal = $modal({controller: editController, templateUrl: 'modals/updUser.html', show: false});

    $scope.showUpdModal = function( personal ) {
    	exchange.updPersonal = personal; 
	  	myUpdModal.$promise.then(myUpdModal.show);
    };
    $scope.hideUpdModal = function() {
    	myUpdModal.$promise.then(myUpdModal.hide);
    };

    //delete Controller
	function deleteController( $scope, exchange ){
	    $scope.title = 'Delete employee';
	    $scope.content = 'Please, enter a correct data';
	    $scope.exchange = exchange;

	    $scope.recordID = $scope.exchange.dltPersonal.id;

		$scope.deletePersonal = function( ){
				console.log("push delete");
				var dltObject = {
					recID: $scope.recordID 
				};

				$scope.exchange.socket.emit('PersonalToDelete',{
					dltObject: dltObject
				});	

			myDltModal.$promise.then(myDltModal.hide);

		}
		
	    $scope.hideDltModal = function() {
	    	console.log("hide ");
	    	myDltModal.$promise.then(myDltModal.hide);
	    };				

	}

   	deleteController.$inject = ['$scope','exchange'];
	var myDltModal = $modal({controller: deleteController, templateUrl: 'modals/dltUser.html', show: false});

    $scope.showDltModal = function( personal ) {
    	exchange.dltPersonal = personal;
    	console.log("first steap to delete");
	  	myDltModal.$promise.then(myDltModal.show);
    };
    $scope.hideDltModal = function() {
    	console.log("hide ");
    	myDltModal.$promise.then(myDltModal.hide);
    };

})




//ADD MODAL
app.controller('ModalDemoCtrl', function($scope, $modal) {
  $scope.modal = {title: 'Title', content: 'Hello Modal<br />This is a multiline message!'};

	//connecting
	try{
   		$scope.socket = io.connect('http://localhost:3000');
   		console.log("connection set up!");
   	} catch(e) {
		alert("connection lost");
	}
    $scope.socket.on('news', function (data) {
    	console.log(data);
    	$scope.socket.emit('my other event', { my: 'data' });
    });



    //ADD modal controller
    function MyModalController( $scope ) {
	    $scope.title = 'Some Title';
	    $scope.content = 'Hello Modal<br />This is a multiline message from a controller!';


		$scope.AddPersonal = function ( Personal ){

				$scope.socket.emit('pushPersonal',{
					name: Personal.name,
					fname: Personal.fname,
					phone: Personal.phone,
					salary: Personal.salary
				});
				//document.forms['PersonalInput'].reset();
				myModal.$promise.then(myModal.hide);
		}	    

    }
    MyModalController.$inject = ['$scope'];
    var myModal = $modal({controller: MyModalController, templateUrl: 'modals/addUser.html', show: false});
    $scope.showModal = function() {
   		myModal.$promise.then(myModal.show);
    };
    $scope.hideModal = function() {
    	myModal.$promise.then(myModal.hide);
    };

});
