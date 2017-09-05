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
			console.log(response.data);
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
	
});