angular.module('KanguDashboard').controller('CategoriesController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.getCategories = function(){
		$http({method: 'GET', url: $rootScope.server()+'categories/categories', params:{type: 0}, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.categories = response.data.model;
		}, function errorCallback(response) {
			console.log(response.data);
		});
	}

	$scope.createCategorie = function($event, categorie){
		$http({method: 'POST', url: $rootScope.server()+'categories/categories', data:categorie, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Categoria creada');
			$scope.getCategories();
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.getCategories();
	
});