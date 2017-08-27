angular.module('KanguDashboard').controller('VariantProvidersController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.provider = {};

	$scope.get_providers = function(){
		$http({method: 'GET', url: $rootScope.server()+'variants/variants/'+$stateParams.variant_id, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.product = response.data.product;
			$scope.variant = response.data.variant;
			$scope.providers = response.data.providers;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.searchProvider = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'providers/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.ProviderSelected = function($item){
		$scope.provider.user_id = $item.originalObject.provider.id;
		$scope.provider.target_id = $stateParams.variant_id;
		toastr.info('Proveedor seleccionado');
	}

	$scope.assignProvider = function($event, p){
		$http({method: 'POST', url: $rootScope.server()+'providers/assign', data: p, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Proveedor asignado');
			$scope.get_providers();
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.get_providers();
	
});