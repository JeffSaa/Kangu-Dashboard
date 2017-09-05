angular.module('KanguDashboard', ["angucomplete-alt"]).controller('BusinessPlaceController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.headers = {current_page: 0};
	$scope.business = {};

	$scope.searchUser = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'users/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.UserSelected = function($item){
		$scope.business.user_id = $item.originalObject.id;
		toastr.info('Usuario seleccionado');
	}

	$scope.getBusiness = function(page = 1){
		var x = Number($scope.headers.current_page) + Number(page);
		if (x > 0 && (!$scope.headers.pages_count || $scope.headers.pages_count >= x)) {
			$scope.headers.current_page = x;
			$http({method: 'GET', url: $rootScope.server()+'businessplace/businessplace', params:{page: $scope.headers.current_page}, 
					headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				$scope.business_places = response.data;
				$scope.headers.pages_count = response.headers('pages_count');
				$scope.headers.current_page = response.headers('current_page');
			}, function errorCallback(response) {
				toastr.error('Error obteniendo datos');
			});
		}
	}

	$scope.createBusiness = function($event, business){
		$http({method: 'POST', url: $rootScope.server()+'businessplace/businessplace/', data: business,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Negocio creado');
			$scope.getBusiness(0);
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
		$event.target.submit();
	}

	$scope.UpdateBusiness = function($event, business){
		$http({method: 'PUT', url: $rootScope.server()+'businessplace/businessplace/'+business.id, data: business,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Negocio actualizado');
			$scope.getBusiness(0);
		}, function errorCallback(response) {
			toastr.error('Error completando accion');
		});
		$event.target.submit();
	}

	$scope.selectBusiness = function(b){
		angular.copy(b, $scope.business);
	}

	$scope.getBusiness();
	
});