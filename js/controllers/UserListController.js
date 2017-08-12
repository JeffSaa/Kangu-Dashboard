angular.module('KanguDashboard').controller('UserListController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.getUsers = function(){
		$http({method: 'GET', url: $rootScope.server()+'users/users/', headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.users = response.data.model;
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	$scope.getUsers();
	
});