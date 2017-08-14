angular.module('KanguDashboard').controller('LogOutController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.logout = function(){
		$http({method: 'DELETE', url: $rootScope.server()+'users/logout/'+$rootScope.loadUser().token
		}).then(function successCallback(response) {
			$rootScope.removeUser();
			window.location.href = "/#/login";
		}, function errorCallback(response) {
			toastr.error('Error cerrando sesion');
		});
	}

	$scope.logout();
	
});