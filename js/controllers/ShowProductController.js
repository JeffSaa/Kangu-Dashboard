angular.module('KanguDashboard', ['ngFileUpload']).controller('ShowProductController', function($rootScope, $scope, $http, $timeout, $stateParams, Upload) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.get_product = function(){
		$http({method: 'GET', url: $rootScope.server()+'products/products/'+$stateParams.id, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.product = response.data;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.getTotalPrice = function(entry, percent, gain){
		return entry * percent / 100 + gain + entry;
	}

	$scope.createVariant = function($event, variant){
		variant.product_id = $stateParams.id;
		Upload.upload({
			url:  $rootScope.server()+'variants/variants',
			headers:{"Authorization":$rootScope.loadUser().token},
			data: variant
		}).then(function (resp) {
			toastr.success('Variante creada');
			$scope.get_product();
		}, function (resp) {
			toastr.error('Error creando variante');
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		});
	}

	$scope.editing = function(v){
		$scope.temp_variant = {};
		angular.copy(v, $scope.temp_variant);
	}

	$scope.updateVariant = function($event, variant){
		variant.product_id = $stateParams.id;
		Upload.upload({
			url:  $rootScope.server()+'variants/variants/'+variant.id,
			method: 'PUT',
			headers:{"Authorization":$rootScope.loadUser().token},
			data: variant
		}).then(function (resp) {
			toastr.success('Variante actualizada');
			$scope.get_product();
		}, function (resp) {
			toastr.error('Error actualizando variante');
		}, function (evt) {
			var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
		});
	}

	$scope.variantImageUrl = $rootScope.variantImageUrl;

	$scope.get_product();
	
});