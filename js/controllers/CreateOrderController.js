angular.module('KanguDashboard').controller('CreateOrderController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.cart = {total: 0, pay_mode: 0, status: 0, order_type: 0, products: []};

	$scope.get_businessplace = function(){
		$http({method: 'GET', url: $rootScope.server()+'businessplace/businessplace/'+$stateParams.b_id,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.business = response.data;
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
	}

	$scope.search_variant = function(q){
		$http({method: 'GET', url: $rootScope.server()+'variants/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.variants = response.data;
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
	}

	$scope.add2Cart = function(v){
		if (v.quantity && v.quantity > 0) {
			var temp = {};
			angular.copy(v, temp);
			temp.variant_id = temp.id;
			$scope.cart.products.push(temp);
			$scope.cart.total += temp.business_price * temp.quantity;
			toastr.info('Agregado al carrito');
		}
	}

	$scope.delFromCart = function(index){
		$scope.cart.products.splice(index, 1);
		$scope.update_total();
	}

	$scope.update_total = function(){
		$scope.cart.total = 0;
		for (var i = $scope.cart.products.length - 1; i >= 0; i--) {
			var temp = $scope.cart.products[i];
			$scope.cart.total += temp.business_price;
		}
	}

	$scope.create_order = function(){
		$scope.cart.datehour = $scope.toUTC($scope.cart.datehour_t);
		$http({method: 'POST', url: $rootScope.server()+'orders/orders', data: $scope.cart,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Orden creada');
			console.log(response.data);
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
	}

	$scope.toUTC = function(date) {
		return new Date(
			date.getFullYear()
			, date.getMonth()
			, date.getDate()
			, date.getHours()-5
			, date.getMinutes()
			, date.getSeconds()
			, date.getMilliseconds()
		).toISOString();
	}

	$scope.getTotalPrice = $rootScope.getTotalPrice;

	$scope.get_businessplace();


});