angular.module('KanguDashboard', ["dndLists", "angucomplete-alt"]).controller('SupervisorDashboardController', function($rootScope, $scope, $http, $timeout, $filter) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		App.initAjax();
	});

	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageContentWhite = true;
	$rootScope.settings.layout.pageBodySolid = false;
	$rootScope.settings.layout.pageSidebarClosed = false;

	$scope.orders = {received: [], shopping: [], delivering: [], completed: [], disabled: []};
	$scope.order_selected = {};
	$scope.add_variant = {model: {}};
	$scope.product_selected = {};

	$scope.get_orders = function(status, model){
		$http({method: 'GET', url: $rootScope.server()+'orders/orders', params: {status: status},
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			for (var i = response.data.length - 1; i >= 0; i--)
				model.push(response.data[i]);
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.move_order = function(index, item, external, type, status){
		type = parseInt(type);
		if (status - type == 1){
			$http({method: 'POST', url: $rootScope.server()+'orders/advance', data: {id: item.order.id},
				headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				$scope.get_all();
			}, function errorCallback(response) {
				toastr.error('Error obteniendo datos');
			});
		}
	}

	$scope.get_model_status = function(s){
		switch(s){
				case 0:
					return $scope.orders.received;
				break;
				case 1:
					return $scope.orders.shopping;
				break;
				case 2:
					return $scope.orders.delivering;
				break;
				case 3:
					return $scope.orders.completed;
				break;
				case 4:
					return $scope.orders.disabled;
				break;
		}
	}

	$scope.select_order = function(o){
		angular.copy(o, $scope.order_selected);
	}

	$scope.get_all = function(){
		$scope.orders = {received: [], shopping: [], delivering: [], completed: [], disabled: []};
		$scope.get_orders(0, $scope.orders.received);
		$scope.get_orders(1, $scope.orders.shopping);
		$scope.get_orders(2, $scope.orders.delivering);
		$scope.get_orders(3, $scope.orders.completed);
		$scope.get_orders(4, $scope.orders.disabled);
	}

	$scope.get_qr = function(o){
		var qrurl = "https://unitag-qr-code-generation.p.mashape.com/api?data=%7B%22TYPE%22%3A%22url%22%2C%22DATA%22%3A%7B%22URL%22%3A%22http%3A%2F%2Fkangu.com.co%22%7D%7D&setting=%7B%22LAYOUT%22%3A%7B%22GRADIENT_TYPE%22%3A%22DIAG1%22%2C%22COLOR1%22%3A%22000%22%2C%22COLOR2%22%3A%22000%22%7D%2C%22EYES%22%3A%7B%22EYE_TYPE%22%3A%22Sharp%22%7D%2C%2C%22LOGO%22%3A%7B%22L_NAME%22%3A%22https%3A%2F%2Fkanguco-my.sharepoint.com%2Fpersonal%2Fjeff_kangu_com_co%2F_layouts%2F15%2Fguestaccess.aspx%3Fdocid%3D1865c6b901c4d4c4caa05b3c4ff391f8c%26authkey%3DAR56GJgS_HAxyCJcnioQabw%22%2C%22L_WIDTH%22%3A128%2C%22L_LENGTH%22%3A128%2C%22EXCAVATE%22%3Atrue%7D%2C%22E%22%3A%22M%22%2C%22BODY_TYPE%22%3A1%2C%20%22ARRONDI%22%3A5%7D&size=500&T=%22png%22";
		$http({method: 'GET', url: qrurl, headers:{"X-Mashape-Key":'pjBDEcSuH9mshsyHjLSPlqRgz6CAp1a4pkjjsnSntapmc3pR2F'}, responseType: 'blob'
		}).then(function successCallback(response) {
			var blob = response.data;
			var contentType = response.headers("content-type");
			var fileURL = URL.createObjectURL(blob);
			$scope.savePDF($scope.order_selected, fileURL);
		}, function errorCallback(response) {
			console.log(response.data);
		});
	}

	$scope.savePDF = function(o){
		var d = new Date();
		d = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
		var divider = {table:{widths:['*'],body:[[" "],[" "]]},layout:{
			hLineWidth:function(i,node){return(i ===0 || i === node.table.body.length) ? 0 : 2;},vLineWidth:function(i,node)
				{return 0;},}};
		var order_total_stack = {stack: ['Total de la compra: '+$filter('currency')(o.order.total,'$','0')], style: 'subheader1'};
		if (o.order.pay_mode == 1){
			order_total_stack.stack.push({ text: 'Metodo de pago: Credito', style: 'subheader2' },
				{ text: 'Fecha de pago: '+o.order.pay_day,style: 'subheader2' });
		}
		else
			order_total_stack.stack.push({ text: 'Metodo de pago: Efectivo', style: 'subheader2' });
		if (o.order.order_type == 0) {
			var client_info = {
				stack: [
					'Datos del cliente',
					{ text: 'Nombre: '+o.place.name, style: 'subheader3' },
					{ text: 'Direccion: '+o.sucursal.address_description, style: 'subheader3' },
					{ text: 'Intrucciones: '+o.order.comment, style: 'subheader3' }
				], style: 'subheader1'
			};
		}
		else{
			var client_info = {
				stack: [
					'Datos del cliente',
					{ text: 'Nombre: '+o.order.wc_name + " "+ o.order.wc_lastname, style: 'subheader3' },
					{ text: 'Direccion: '+o.order.wc_address, style: 'subheader3' },
					{ text: 'Intrucciones: '+o.order.comment, style: 'subheader3' }
				], style: 'subheader1'
			};
		}
		var product_table = [[{text: 'Producto', style: 'tableHeader'}, {text: 'Cantidad', style: 'tableHeader'}, {text: 'Unidad', style: 'tableHeader'}, {text: 'Precio', style: 'tableHeader'}]];
		for (var i = o.products.length - 1; i >= 0; i--) {
			p = o.products[i];
			if (p.product.measurement_type == 1)
				var unit = 'Lb'
			else
				var unit = 'Unidad';
			var price = p.order_product.price * p.order_product.quantity;
			product_table.push([p.variant.name, p.order_product.quantity, unit, $filter('currency')(price,'$','0')])
		}
		product_table.push([{text: 'Items: '+o.products.length, style: 'subheader4'}, '', {text: 'Total:', style: 'subheader4'}, {text: $filter('currency')(o.order.total,'$','0'), style: 'subheader4'}]);
		var docDefinition = {
			content: [
				{
					stack: [
						'Kangu investments S.A.S',
						{ text: 'NIT: 901 089 623 - 1', style: 'subheader3' },
						{ text: 'Resolución Dian: 18762003826490', style: 'subheader3' },
						{ text: 'Barranquilla, Calle 9 No 43 - 28', style: 'subheader3' },
						{ text: 'Tel: 315 898 2043', style: 'subheader3' },
						{ text: '2017-07-10 - 16:01 PM', style: 'subheader3' },
						{ text: 'Numero de compra: KG-'+o.order.consecutive, style: 'subheader3' },
						{ text: 'Régimen común', style: 'subheader3' }
					], style: 'header'
				},
				divider,
				order_total_stack,
				divider,
				client_info,
				divider,
				{
				style: 'tableExample',
					table: {
						widths: ['*', '*', '*', '*'],
						headerRows: 1,
						body: product_table
					},
					layout: 'lightHorizontalLines'
				},
				divider,
				{
					text: 'Discriminacion del IVA', style: 'subheader2'
				},
				{
				style: 'tableExample',
					table: {
						widths: ['*', '*', '*'],
						headerRows: 1,
						body: [
							[{text: 'Base', style: 'tableHeader'}, {text: 'Compra', style: 'tableHeader'}, {text: 'Impuesto', style: 'tableHeader'}],
							['0%', $filter('currency')(o.iva[0][0],'$','0'), $filter('currency')(o.iva[0][1],'$','0')],
							['5%', $filter('currency')(o.iva[1][0],'$','0'), $filter('currency')(o.iva[1][1],'$','0')],
							['16%', $filter('currency')(o.iva[2][0],'$','0'), $filter('currency')(o.iva[2][1],'$','0')]
						]
					},
					layout: 'lightHorizontalLines'
				},
				divider
			],styles:{
				header:{fontSize: 16, bold: true, alignment: 'center'},
				subheader1:{fontSize: 14, bold: true, alignment: 'center'},
				subheader2:{fontSize: 12, bold: true, alignment: 'center'},
				subheader3:{fontSize: 11, bold: false, alignment: 'center'},
				subheader3:{fontSize: 12, bold: false, alignment: 'center'},
				subheader4:{fontSize: 11, bold: true, alignment: 'false'}
			}
		};
		pdfMake.createPdf(docDefinition).open();
	}

	$scope.delete_orderproduct = function(op, index){
		$http({method: 'POST', url: $rootScope.server()+'orders/remove_product', data: op,
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.order_selected.products.splice(index, 1);
			$scope.order_selected.order.total = response.data.total;
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.searchVariant = function(q, time){
		return $http({method: 'GET', url: $rootScope.server()+'variants/search', params: {search: q},
			headers:{"Authorization":$rootScope.loadUser().token}, timeout: time
		});
	}

	$scope.VariantSelected = function($item){
		$scope.add_variant.model.variant_id = $item.originalObject.variant.id;
		toastr.info('Variante seleccionado');
	}

	$scope.update_order_selected = function(){
		model = $scope.get_model_status($scope.order_selected.order.status);
		model = [];
		$scope.get_orders($scope.order_selected.order.status, model);
	}

	$scope.addVariant2Order = function($event, o){
		if ($scope.add_variant.model.variant_id){
			console.log(o);
			o.order_id = $scope.order_selected.order.id;
			$http({method: 'POST', url: $rootScope.server()+'orders/add_product', data: {model: o},
				headers:{"Authorization":$rootScope.loadUser().token}
			}).then(function successCallback(response) {
				angular.copy(response.data, $scope.order_selected);
				toastr.success('Variante agregada');
				$scope.get_all();
			}, function errorCallback(response) {
				toastr.error('Error obteniendo datos');
			});
		}
		else
			toastr.error('Variante invalida');
	}

	$scope.select_product = function(p){
		angular.copy(p, $scope.product_selected);
		$scope.product_selected.comment_t = $scope.product_selected.order_product.comment;
		$scope.product_selected.quantity_t = $scope.product_selected.order_product.quantity;
		$scope.product_selected.price_t = $scope.product_selected.order_product.price;
	}

	$scope.update_orderproduct = function($event, op){
		$http({method: 'PUT', url: $rootScope.server()+'orders/update_product', data: {comment: op.comment_t, quantity: op.quantity_t,
			id: $scope.product_selected.order_product.id, price: op.price_t},
			headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.order_selected = response.data;
			toastr.success('Producto de orden actualizado');
			$scope.get_all();
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.get_dayshop = function(){
		$http({method: 'GET', url: $rootScope.server()+'orders/day_shop', headers:{"Authorization":$rootScope.loadUser().token}
		}).then(function successCallback(response) {
			$scope.generate_dayshop(response.data);
		}, function errorCallback(response) {
			toastr.error('Error obteniendo datos');
		});
	}

	$scope.generate_dayshop = function(data){
		var d = new Date();
		d = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
		var product_table = [[{text: 'PROD', style: 'tableHeader'}, {text: 'CANT', style: 'tableHeader'}, {text: 'UND', style: 'tableHeader'}]];
		for (var i = data.length - 1; i >= 0; i--) {
			q = data[i].quantity + '('+data[i].variant.variant_stock+')';
			switch(data[i].product.measurement_type){
				case 0:
					u = 'Lb';
					break;
				case 1:
					u = 'Kg';
					break;
				case 2:
					u = 'Und';
					break;
			}
			product_table.push([data[i].variant.name,q,u]);
		}
		var docDefinition = {
			content: [
				{
					stack: [
						'Kangu consolidado de compras',
						{ text: d, style: 'subheader' }
					], style: 'header'
				},
				{
				style: 'tableExample',
					table: {
						widths: ['*', '*', '*'],
						headerRows: 1,
						body: product_table
					},
					layout: 'lightHorizontalLines'
				}
			],styles:{
				header:{fontSize: 13, bold: true, alignment: 'center'}
			}
		};
		pdfMake.createPdf(docDefinition).open();
	}

	$scope.getTotalPrice = $rootScope.getTotalPrice;
	
	$scope.get_all();

});