angular.module('KanguDashboard', ["angucomplete-alt"]).controller('InventoryController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.entry = {entries: [{}], date: new Date(), pay_day: new Date()}

	$scope.addEntry = function(){
		$scope.entry.entries.push({pay_day: new Date()})
	}

	$scope.removeEntry = function(index){
		$scope.entry.entries.splice(index, 1);
	}

	$scope.searchProvider = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'providers/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.providerSelected = function($item){
		$scope.entry.provider_id = $item.originalObject.provider.id;
	}

	$scope.searchPVariant = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'variants/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.saveEntries = function($event, entry){
		sw = true;
		for (var i = entry.entries.length - 1; i >= 0; i--) {
			if (entry.entries[i].variant)
				entry.entries[i].variant_id = entry.entries[i].variant.originalObject.variant.id;
			else{
				toastr.error('Variante #'+(i+1)+' es invalida');
				sw = false
			}
		}
		if (sw) {
			$http({method: 'POST', url: $rootScope.server()+'administration/inventory_entry', data: entry,
				headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				toastr.options = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": false,
					"progressBar": false,
					"positionClass": "toast-top-right",
					"preventDuplicates": false,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": 0,
					"extendedTimeOut": 0,
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut",
					"tapToDismiss": false
				}
				toastr.success('Entrada de inventario creada No. '+response.data.group.id);
			}, function errorCallback(response) {
				toastr.error('Error completando accion');
			});
		}
		$event.target.submit();
	}
	
});