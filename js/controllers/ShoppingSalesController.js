angular.module('KanguDashboard', ["angucomplete-alt"]).controller('ShoppingSalesController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.date_target = new Date();

	$scope.get_movements = function(date){
		$http({method: 'GET', url: $rootScope.server()+'administration/inventory_movements', params:{date: date},
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.movements = response.data;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.get_measurementtype = function(p){
		switch(p.measurement_type){
			case 0:
				return 'lb';
				break;
			case 1:
				return 'kg';
				break;
			case 2:
				return 'und';
				break;
		}
	}
	
});