angular.module('KanguDashboard').controller('BusinessSucursalController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.showBusinessPlace = function(){
		$http({method: 'GET', url: $rootScope.server()+'businessplace/businessplace/'+$stateParams.b_id, 
				headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.business_place = response.data;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.showBusinessPlace();
	
});