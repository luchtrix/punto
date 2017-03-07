var myapp = angular.module('abcwelcome', [])
//var url_server = 'http://192.168.0.109:8080/';
var url_server = 'http://192.81.214.19:8080/';

/* Controlador para el login */
myapp.controller('loginCtrl', ['$scope', '$http', function($scope, $http){
	var usuario = localStorage.getItem('usuario');
	if (usuario != null) {
		window.location.href = 'views/home.html'
	}

	/* Funcion de login */
	$scope.login = function(){
		alert("Login II");
		$(".error").empty();
		/*$http.post(url_server+"home/loginabc", $scope.datalogin).then(function successCallback(response) {
		    // this callback will be called asynchronously
		    // when the response is available
		    alert("response status "+response.status+" user "+response.user);
		  }, function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    $(".error").empty();
            $(".error").append('<div class="alert alert-danger" style="font-size:9pt;"><i class="fa fa-thumbs-up"></i> Error de Autenticación, verifique bien sus datos.</div>');
		});*/
		$http.post(url_server+"home/loginabc", $scope.datalogin).then(function(response) {
            if(response.status || response.status == 200){
            	//alert("response status "+response.status+" data "+response.data+" user "+response.data.user+" id? "+response.data.user._id);
				// Alamcenamos la información del usuario
				localStorage.setItem("usuario", JSON.stringify(response.data.user));
				window.location.href = 'views/home.html';
            }else{
                $(".error").empty();
                $(".error").append('<div class="alert alert-danger" style="font-size:9pt;"><i class="fa fa-thumbs-up"></i> Error de Autenticación, verifique bien sus datos.</div>');
            }
        });
	}
}]);

//Contrlador principal
myapp.controller('homeCtrl', ['$scope', '$http', function($scope, $http){
	var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
	if (usuario == null) {
		window.location.href = '../index.html'
	}
    $scope.usuario = JSON.parse(usuario);// toda la informacion acerca del usuario
    //alert("User "+$scope.usuario._id);


    //traspaso
    $scope.traspasoSaldo = function(){
        $scope.traspaso.USUCEL1 = $scope.usuario.USUCEL;
        $scope.traspaso.USUTIP = $scope.usuario.USUTIP;
        var data2 = {
        	USUCEL1: $scope.traspaso.USUCEL2
        }
		$http.post(url_server+"home/traspaso/",$scope.traspaso).then(function(response) {
        	if(response.status || response.status == 200){
	            //localStorage.setItem("userabcwelcomesystem", JSON.stringify(response.user));
	            //$scope.user = response.user;
	            $(".message").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+response.data.message+'.</div>');
	            $(".message").css("display","block");
	            $scope.traspaso = {};
	            /*$http.get(url_server+"user/get/"+$scope.traspaso.USUCEL2).success(function(response){
					if(response.status){
						var mensaje = {
							iduser: response.user._id,
							title: "¡Abono de saldo!",
							message: "Has recargado $"+$scope.traspaso.USUSAL+" de saldo."
	                	}
						$http.post(url_server+"push/", mensaje);
					}
				});*/
          	}else{
            	$(".message").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+response.message+'.</div>');
            	$(".message").css("display","block");
          	}
        }).error(function(e){alert(JSON.stringify(e))});
    }
    verSaldo();
    function verSaldo(){
    	$http.get(url_server+"saldos_extern/"+$scope.usuario.USUCEL).then(function(response){
			if(response.status || response.status == 200){
	    		$scope.saldo = response.data.saldo;
	      	}else{
	        	$scope.saldo = null;
      		}
	    });
	}

	$scope.saldoschange = function() {
	    $scope.data.USUCEL = $scope.usuario.USUCEL;
	    $http.post(url_server+"saldos_extern", $scope.data).then(function(response){
	      if(response.status || response.status == 200){
	        $scope.saldo = response.data.saldo;
	      }else{
	        $scope.saldo = null;
	        if (response.data.message) {
	          $scope.message = response.data.message;
	        }
	      }
	    });
	  }

  $scope.veractual = function() {
    verSaldo();
  }
	vermovimientos();

  /* Ver saldos y movimientos */
  function vermovimientos() {
    $http.get(url_server+"movimientos_extern/"+$scope.usuario.USUCEL).then(function(response){
      if(response.status ||response.status == 200){
        $scope.movimientos = response.data.movimientos;
      }else{
        $scope.movimientos = null;
        if (response.data.message) {
          $scope.message = response.data.message;
        }
      }
    });
  }

  $scope.movimientoschange = function() {
    $scope.data.USUCEL = $scope.usuario.USUCEL;
    alert("mes "+$scope.data.mes);
    $http.get(url_server+"movimientos_extern/"+$scope.data.mes+"/"+$scope.data.anio+"/"+$scope.data.USUCEL).then(function(response){
      if(response.status || response.status == 200){
        $scope.movimientos = response.data.movimientos;
      }else{
        $scope.movimientos = null;
        if (response.data.message) {
          $scope.message = response.data.message;
        }
      }
    });
  }

  $scope.veractualm = function() {
    vermovimientos();
  }
    
$scope.logout = function(){
        localStorage.removeItem("usuario")
        window.location.href = '../../index.html'
}

}]);
