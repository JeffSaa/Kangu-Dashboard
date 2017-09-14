angular.module('KanguDashboard').controller('CreditNoteController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.target_order = {};
    $scope.credit_note = {notes: [{}]};

    $scope.search_order = function(c){
    	$http({method: 'GET', url: $rootScope.server()+'orders/find_by_consecutive', params:{consecutive: c},
    		headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.target_order = response.data;
			$scope.credit_note.order_id = $scope.target_order.order.id;
			toastr.info('Orden encontrada');
		}, function errorCallback(response) {
			$scope.target_order = {};
			toastr.error('Orden no encontrada');
		});
    }

    $scope.searchPVariant = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'orders/search_orderproduct',
			params: {search: q, order_id: $scope.credit_note.order_id}, 
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.addNote = function(){
		$scope.credit_note.notes.push({});
	}

	$scope.delNote = function(index){
		$scope.credit_note.notes.splice(index, 1);
	}

	$scope.createCreditNote = function(n){
		if (n.order_id) {
			sw = true;
			for (var i = n.notes.length - 1; i >= 0; i--) {
				if (n.notes[i].variant) {
					n.notes[i].product_id = n.notes[i].variant.originalObject.order_product.id;
				}
				else{
					sw = false;
					toastr.error('Variante #'+(i+1)+" invalida");
				}
			}
			if (sw){
				$http({method: 'POST', url: $rootScope.server()+'creditnote/creditnote', data: n,
		    		headers:{"Authorization":$rootScope.loadUser().token}
				}).then(function successCallback(response) {
					toastr.success('Nota creada');
				}, function errorCallback(response) {
					toastr.error('Error creando orden');
				});
			}
		}
		else{
			toastr.error('Consecutivo invalido');
		}
	}

});