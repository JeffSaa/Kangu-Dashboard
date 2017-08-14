angular.module('KanguDashboard').controller('ShowCategoriesController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.get_categorie = function(){
		$http({method: 'GET', url: $rootScope.server()+'categories/categories/'+$stateParams.id, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.categorie = response.data;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.create_subcategorie = function($event, sub){
		sub.categorie_type = 1;
		sub.categorie_id = $stateParams.id;
		$http({method: 'POST', url: $rootScope.server()+'categories/categories', data:sub, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Subcategoria creada');
			$scope.get_categorie();
		}, function errorCallback(response) {
			toastr.error('Error creando subcategoria');
		});
	}

	$scope.get_categorie();
	
});