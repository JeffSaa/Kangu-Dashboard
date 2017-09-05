angular.module('KanguDashboard').controller('UserListController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.headers = {current_page: 0};

	$scope.getUsers = function(page = 1){
		var x = Number($scope.headers.current_page) + Number(page);
		if (x > 0 && (!$scope.headers.pages_count || $scope.headers.pages_count >= x)) {
			$scope.headers.current_page = x;
			$http({method: 'GET', url: $rootScope.server()+'users/users', params:{page: $scope.headers.current_page}, 
					headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				$scope.users = response.data;
				$scope.headers.pages_count = response.headers('pages_count');
				$scope.headers.current_page = response.headers('current_page');
			}, function errorCallback(response) {
				toastr.error('Error obteniendo datos');
			});
		}
	}

	$scope.register = function($event, user){
		$http({method: 'POST', url: $rootScope.server()+'users/register', data: user,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Usuario registrado');
			$scope.getUsers(0);
		}, function errorCallback(response) {
			toastr.error('Error registrando usuario');
		});
		$event.target.submit();
	}

	$scope.selectUser = function(user){
		$scope.target_user = {};
		angular.copy(user, $scope.target_user);
	}

	$scope.createCharge = function($event, user, charge){
		c = {user_id: user.id, type_id: charge};
		$http({method: 'POST', url: $rootScope.server()+'charge/charge', data:c, headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			toastr.success('Cargo creado');
		}, function errorCallback(response) {
			toastr.error('No se pudo crear cargo');
		});
		$event.target.submit();
	}

	$scope.getUsers();
	
});