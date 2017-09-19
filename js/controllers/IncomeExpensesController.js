angular.module('KanguDashboard', ["angucomplete-alt"]).controller('IncomeExpensesController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.register = {date: new Date()};
	$scope.get_date = new Date();

	$scope.searchUser = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'users/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.searchBusiness = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'businessplace/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.createRegister = function($event, register){
		$http({method: 'POST', url: $rootScope.server()+'administration/income_expenses', data: register,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Registro creado');
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
		$event.target.submit();
	}

	$scope.ThirdSelected = function($item){
		$scope.register.third_id = $item.originalObject.id;
		toastr.info('Tercero seleccionado');
	}

	$scope.get_movements = function(date){
		$http({method: 'GET', url: $rootScope.server()+'administration/income_expenses_movements', params: {date: date},
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.movements = response.data;
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
	}

	$scope.search_order = function(c){
    	$http({method: 'GET', url: $rootScope.server()+'orders/find_by_consecutive', params:{consecutive: c},
    		headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.target_order = response.data;
			toastr.info('Orden encontrada');
		}, function errorCallback(response) {
			$scope.target_order = {};
			toastr.error('Orden no encontrada');
		});
    }

    $scope.searchProvider = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'providers/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.providerSelected = function($item){
		$scope.register.third_id = $item.originalObject.provider.id;
	}
	
});