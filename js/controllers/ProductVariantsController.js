angular.module('KanguDashboard').controller('ProductVariantsController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.product = {measurement_type: 1};

	$scope.headers = {current_page: 0};

	$scope.getVariants = function(page = 1){
		var x = Number($scope.headers.current_page) + Number(page);
		if (x > 0 && (!$scope.headers.pages_count || $scope.headers.pages_count >= x)) {
			$scope.headers.current_page = x;
			$http({method: 'GET', url: $rootScope.server()+'variants/variants', params:{page: $scope.headers.current_page}, 
				headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				$scope.variants = response.data;
				$scope.headers.pages_count = response.headers('pages_count');
				$scope.headers.current_page = response.headers('current_page');
			}, function errorCallback(response) {
				toastr.error('Error obteniendo datos');
			});
		}
	}

	$scope.updateVariant = function(v){
		$http({method: 'PUT', url: $rootScope.server()+'variants/variants/'+v.id, data: v, 
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Variante actualizada');
			$scope.getVariants(0);
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.getVariants();
	
});