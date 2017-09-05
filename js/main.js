/***
KanguDashboard AngularJS App Main Script
***/

/* KanguDashboard App */
var KanguDashboard = angular.module("KanguDashboard", [
	"ui.router", 
	"ui.bootstrap", 
	"oc.lazyLoad",  
	"ngSanitize"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
KanguDashboard.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
	$ocLazyLoadProvider.config({
		// global configs go here
	});
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
KanguDashboard.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Capitalize filter */
KanguDashboard.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});

/* Setup global settings */
KanguDashboard.factory('settings', ['$rootScope', function($rootScope) {
	// supported languages
	var settings = {
		layout: {
			pageSidebarClosed: false, // sidebar menu state
			pageContentWhite: true, // set page content layout
			pageBodySolid: false, // solid body color state
			pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
		},
		assetsPath: '../assets',
		globalPath: '../assets/global',
		layoutPath: '../assets/layouts/layout',
	};

	$rootScope.settings = settings;
	return settings;
}]);

/* Setup App Main Controller */
KanguDashboard.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$scope.$on('$viewContentLoaded', function() {
		//App.initComponents(); // init core components
		//Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
	});
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
KanguDashboard.controller('HeaderController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initHeader(); // init header
	});
}]);

/* Setup Layout Part - Sidebar */
KanguDashboard.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initSidebar($state); // init sidebar
	});
}]);

/* Setup Layout Part - Quick Sidebar */
KanguDashboard.controller('QuickSidebarController', ['$scope', function($scope) {    
	$scope.$on('$includeContentLoaded', function() {
	   setTimeout(function(){
			QuickSidebar.init(); // init quick sidebar        
		}, 2000)
	});
}]);

/* Setup Layout Part - Theme Panel */
KanguDashboard.controller('ThemePanelController', ['$scope', function($scope) {    
	$scope.$on('$includeContentLoaded', function() {
		Demo.init(); // init theme panel
	});
}]);

/* Setup Layout Part - Footer */
KanguDashboard.controller('FooterController', ['$scope', function($scope) {
	$scope.$on('$includeContentLoaded', function() {
		Layout.initFooter(); // init footer
	});
}]);

/* Setup Login */
KanguDashboard.controller('LoginController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
	$scope.login = function($event, user){	// Login function
		$http({method: 'POST', url: $rootScope.server()+'users/login', data: user
		}).then(function successCallback(response) {
			$rootScope.storageUser(response.data);
			$scope.validateLogin();
		}, function errorCallback(response) {
			toastr.error('Datos invalidos');
		});
		$event.target.submit();
	}

	$scope.validateLogin = function(){
		if ($rootScope.loadUser() != null)
			window.location.href = "/dashboard/#/";
	}

	$scope.validateLogin();
}]);

/* Setup Rounting For All Pages */
KanguDashboard.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	// Redirect any unmatched url
	$urlRouterProvider.otherwise("/login");  

	$stateProvider

		// Dashboard
		.state('dashboard_menu', {
			url: "/",
			templateUrl: "../views/dashboard.html",            
			data: {pageTitle: 'Dashboards'},
			controller: "DashboardController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/morris/morris.css',                            
							'../assets/global/plugins/morris/morris.min.js',
							'../assets/global/plugins/morris/raphael-min.js',                            
							'../assets/global/plugins/jquery.sparkline.min.js',

							'../assets/pages/scripts/dashboard.min.js',
							'../js/controllers/DashboardController.js',
						] 
					});
				}]
			}
		})

		// Users
		.state('users_menu', {
			url: "/users",
			templateUrl: "../views/users_list.html",            
			data: {pageTitle: 'Users'},
			controller: "UserListController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',
							
							'../js/controllers/UserListController.js',
						] 
					});
				}]
			}
		})

		// Categories
		.state('categories_menu', {
			url: "/categories",
			templateUrl: "../views/categories.html",            
			data: {pageTitle: 'Categories'},
			controller: "CategoriesController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',
							
							'../js/controllers/CategoriesController.js',
						] 
					});
				}]
			}
		})

		// Show Categories
		.state('show_categories', {
			url: "/categories/:id",
			templateUrl: "../views/show_categories.html",            
			data: {pageTitle: 'Categorie'},
			controller: "ShowCategoriesController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',
							
							'../js/controllers/ShowCategoriesController.js',
						] 
					});
				}]
			}
		})

		// LogOut
		.state('logout_menu', {
			url: "/logout",
			templateUrl: "../views/logout.html",            
			data: {pageTitle: 'LogOut'},
			controller: "LogOutController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',
							
							'../js/controllers/LogOutController.js',
						] 
					});
				}]
			}
		})

		// Providers
		.state('providers_menu', {
			url: "/providers",
			templateUrl: "../views/providers.html",            
			data: {pageTitle: 'Providers'},
			controller: "ProvidersController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',
							
							'../js/controllers/ProvidersController.js',
						] 
					});
				}]
			}
		})

		// Inventory
		.state('inventory_menu', {
			url: "/inventory",
			templateUrl: "../views/inventory.html",            
			data: {pageTitle: 'Inventory'},
			controller: "InventoryController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
							'../assets/pages/scripts/components-date-time-pickers.min.js',
							'../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',	

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',						
							
							'../js/controllers/InventoryController.js',
						] 
					});
				}]
			}
		})

		// Products
		.state('products_menu', {
			url: "/products",
			templateUrl: "../views/products.html",            
			data: {pageTitle: 'Products'},
			controller: "ProductsController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
							'../assets/pages/scripts/components-date-time-pickers.min.js',
							'../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',	

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',						
							
							'../js/controllers/ProductsController.js',
						] 
					});
				}]
			}
		})

		// Show Product
		.state('show_product', {
			url: "/products/:id",
			templateUrl: "../views/show_product.html",            
			data: {pageTitle: 'Products'},
			controller: "ShowProductController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/pages/scripts/table-datatables-scroller.min.js',
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
							'../assets/pages/scripts/components-date-time-pickers.min.js',
							'../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',	

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',

							'../assets/pages/scripts/table-datatables-scroller.min.js',

							'../assets/global/scripts/FileAPI.min.js',
							'../assets/global/scripts/ng-file-upload-shim.min.js',
							'../assets/global/scripts/ng-file-upload.min.js',
							
							'../js/controllers/ShowProductController.js',
						] 
					});
				}]
			}
		})

		// Show ProductVariant Providers
		.state('variant_providers', {
			url: "/products/:product_id/:variant_id/providers",
			templateUrl: "../views/variant_providers.html",            
			data: {pageTitle: 'Products'},
			controller: "VariantProvidersController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/pages/scripts/table-datatables-scroller.min.js',
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',

							'../assets/pages/scripts/table-datatables-scroller.min.js',
							
							'../js/controllers/VariantProvidersController.js',
						] 
					});
				}]
			}
		})

		// Income Expenses
		.state('income_expenses', {
			url: "/income_expenses",
			templateUrl: "../views/income_expenses.html",            
			data: {pageTitle: 'Ingresos-Egresos'},
			controller: "IncomeExpensesController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/pages/scripts/table-datatables-scroller.min.js',
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',

							'../assets/pages/scripts/table-datatables-scroller.min.js',
							
							'../js/controllers/IncomeExpensesController.js',
						] 
					});
				}]
			}
		})

		// Business Place
		.state('business_places', {
			url: "/business",
			templateUrl: "../views/business_place.html",            
			data: {pageTitle: 'Negocios'},
			controller: "BusinessPlaceController",
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'KanguDashboard',
						insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
						files: [
							'../assets/global/plugins/datatables/datatables.min.css', 
							'../assets/pages/scripts/table-datatables-scroller.min.js',
							'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.css',

							'../assets/global/plugins/datatables/datatables.all.min.js',

							'../assets/pages/scripts/table-datatables-managed.min.js',

							'../assets/global/plugins/bootstrap-toastr/toastr.min.js',
							'../assets/pages/scripts/ui-toastr.min.js',

							'../assets/global/scripts/angucomplete-alt.js',						
							'../assets/global/css/angucomplete-alt.css',

							'../assets/pages/scripts/table-datatables-scroller.min.js',
							
							'../js/controllers/BusinessPlaceController.js',
						] 
					});
				}]
			}
		})

}]);

/* Init global settings and run the app */
KanguDashboard.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
	$rootScope.$state = $state; // state to be accessed from view
	$rootScope.$settings = settings; // state to be accessed from view
	$rootScope.server = function(){ // server address
		if (window.location.href.indexOf('localhost') == -1) // validate develop enviroment
			return "http://kanguserver.cloudapp.net/v1/";
		else
			return "http://localhost:3000/v1/";
	}
	$rootScope.storageUser = function(data){ // storage user credentials to localstorage
		window.localStorage.kanguDashboard = JSON.stringify(data);;
	}
	$rootScope.loadUser = function(){ // load user credentials from localstorage
		var t = window.localStorage.kanguDashboard;
		if (t)
			return JSON.parse(t);
		return t;
	}
	$rootScope.removeUser = function(){ // remove user credentials of localstorage
		window.localStorage.removeItem('kanguDashboard')
	}
	$rootScope.variantImageUrl = function(name){ // get product variant image url
		if (window.location.href.indexOf('localhost') == -1)
			return 'https://kangublobs.blob.core.windows.net/variant/'+name;
		else
			return 'https://kangublobdev.blob.core.windows.net/variant/'+name;
	}
	$rootScope.print = function(div){ // print a div
		var printContents = document.getElementById(div).innerHTML;
		var w = window.open();
		$(w.document.body).html(printContents);
		w.print();
	}
}]);