angular.module('KanguDashboard').controller('ProvidersController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.get_providers = function(){
		$http({method: 'GET', url: $rootScope.server()+'providers/providers', headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.providers = response.data.model;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.get_providers();
	
});