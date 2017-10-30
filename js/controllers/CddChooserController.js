angular.module('KanguDashboard', ["angucomplete-alt"]).controller('CddChooserController', function($rootScope, $scope, $http, $timeout, $stateParams) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;
	$scope.cdds = [{name: 'Barranquilla - Centro'}];

	$scope.cdd_selected = function(value){
		// Cdd has been selected. Code here!
	}
	
});