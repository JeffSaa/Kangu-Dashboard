angular.module('KanguDashboard').controller('ProductsController', function($rootScope, $scope, $http, $timeout) {
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

	$scope.getProducts = function(page = 1){
		var x = Number($scope.headers.current_page) + Number(page);
		if (x > 0 && (!$scope.headers.pages_count || $scope.headers.pages_count >= x)) {
			$scope.headers.current_page = x;
			$http({method: 'GET', url: $rootScope.server()+'products/products', params:{page: $scope.headers.current_page}, 
				headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				$scope.products = response.data;
				$scope.headers.pages_count = response.headers('pages_count');
				$scope.headers.current_page = response.headers('current_page');
			}, function errorCallback(response) {
				toastr.error('Error obteniendo datos');
			});
		}
	}

	$scope.searchSubcategorie = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'categories/search', params: {search: q, type: 1},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.SubcategorieSelected = function($item){
		$scope.product.subcategorie_id = $item.originalObject.id;
		toastr.info('Subcategoria seleccionada');
	}

	$scope.createProduct = function($event, product){
		$http({method: 'POST', url: $rootScope.server()+'products/products', data: product,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Producto creado');
			$scope.getProducts();
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.getProducts();
	
});