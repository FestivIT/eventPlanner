eventplanner.ui = {
	onlineState: true,
	// ETATS:
			// 100: Equipements
			// 	100 - 119: Préparation
			//	120 - 139: Installation
			//	140 - 159: Désinstallation
			// 200: Zone
			//	200 - 219: Installation
			//	220 - 239: Désinstallation
			// 300: Matériel
			//  300
	STATE: {
	  	100: {text: "En attente", colorClass:'active'},
	  	102: {text: "A Configurer", colorClass:'danger'},
	  	102: {text: "Configuré - non testé", colorClass:'warning'},
	  	103: {text: "Configuré - testé", colorClass:'success'},
	  	104: {text: "Livré sur site", colorClass:'active'},
	  	
	  	120: {text: "A installer", colorClass:'danger'},
	  	121: {text: "Installé - non opérationnel", colorClass:'warning'},
	  	122: {text: "Installé - opérationnel", colorClass:'success'},
	  	
	  	140: {text: "A Désinstaller", colorClass:'danger'},
	  	141: {text: "Désinstall", colorClass:'warning'},
	  	142: {text: "Au Stock", colorClass:'success'},
	  	
	  	  	
	  	200: {text: "En attente", colorClass:'active'},
	  	201: {text: "A installer", colorClass:'warning'},
	  	202: {text: "Terminé", colorClass:'success'},
	  	203: {text: "Probléme", colorClass:'danger'},
	  	  	
	  	220: {text: "A désinstaller", colorClass:'danger'},
	  	221: {text: "Probléme démontage", colorClass:'warning'},
	  	221: {text: "Démonté, matériel à récuperer", colorClass:'info'},
	  	221: {text: "Démontage terminé", colorClass:'success'},

	  	300: {text: "Au stock", colorClass:'success'},
	  	301: {text: "En Prêt", colorClass:'warning'},
	  	399: {text: "Hors service", colorClass:'danger'},
	  	  	
	  	'default': {text: "Inconnu", colorClass:'active'}
  	},

  	init: function() {
  		eventplanner.private.default_params.error = function(_data){
  			eventplanner.ui.notification('error', _data.message);
  		}
  		
		this.initselectors();
		this.search.init();
		this.configEventMenu();
		
		//NAV BAR
		$("#nav-btn").click(function() {
		  $(".navbar-collapse").collapse("toggle");
		  return false;
		});
		
		nbActiveAjaxRequest = 0;

		$(document)
		    .ajaxSend(function(event, jqxhr, settings) {
		        if (settings.url.split('?')[0] == "core/ajax/alive.txt") return;
		                
		        if (nbActiveAjaxRequest == 0) {
		        	$.showLoading();
			    }
			    
		    	nbActiveAjaxRequest++;
		    })
		    .ajaxComplete(function(event, jqxhr, settings) {
		        if (settings.url.split('?')[0] == "core/ajax/alive.txt") return;
		        
		        nbActiveAjaxRequest--;
			    if (nbActiveAjaxRequest <= 0) {
			        nbActiveAjaxRequest = 0;
			        $.hideLoading();
			    }
		    })
		
		setInterval(function(){ 
			$.ajax({url: "core/ajax/alive.txt",
			        type: "HEAD",
			        timeout:1000,
			        statusCode: {
			            200: function (response) {
			            	if(!eventplanner.ui.onlineState){
			            		eventplanner.ui.onlineState = true;
			            		$('.navbar').removeClass('navbar-inverse').addClass('navbar-default');
			                	eventplanner.ui.notification('success', "Connexion avec le serveur OK.");
			            	}
			            },
			            400: function (response) {
			            	if(eventplanner.ui.onlineState){
			            		eventplanner.ui.onlineState = false;
			                	$('.navbar').removeClass('navbar-default').addClass('navbar-inverse');
			                	eventplanner.ui.notification('error', "Perte de la connexion avec le serveur.");
			            	}
			            },
			            404: function (response) {
			            	if(eventplanner.ui.onlineState){
			            		eventplanner.ui.onlineState = false;
			                	$('.navbar').removeClass('navbar-default').addClass('navbar-inverse');
			                	eventplanner.ui.notification('error', "Perte de la connexion avec le serveur.");
			            	}
			            },
			            0: function (response) {
			                if(eventplanner.ui.onlineState){
			            		eventplanner.ui.onlineState = false;
			                	$('.navbar').removeClass('navbar-default').addClass('navbar-inverse');
			                	eventplanner.ui.notification('error', "Perte de la connexion avec le serveur.");
			            	}
			            }              
			        }
			 });
		}, 2000);

		$(".navBarBtn").click(function() {
		  eventplanner.ui.loadPage($(this).data('link'));
		});
		
		$.each(eventplanner.ui.STATE, function(index, value) {
			$('#selectStateModal .stateSelect').loadTemplate($("#templateStateSelectOptions"), {id: index, text: value.text} ,{append: true});
		});
		
		$("body").delegate('.msgForm', 'submit', function () {
		if($(this).find('.msgFormInput').val()==''){
		    return false;
		}
			var msgParam = {
				eventId: userProfils.eventId,
				userId: user_id,
				content: $(this).find('.msgFormInput').val()
			}
			
			if($(this).data("zone-id")==undefined){
				msgParam.zoneId = '';
			}else{
				msgParam.zoneId = $(this).data("zone-id");
			}
			
			if($(this).data("eqlogic-id")==undefined){
				msgParam.eqId = '';
			}else{
				msgParam.eqId = $(this).data("eqlogic-id");
			}

			$(this).find('.msgFormInput').val("");
			
		    eventplanner.msg.save({
		      msg: msgParam,
		      success: function(){
		        $(".msgTable").trigger("refreshMsgTable");
		        eventplanner.ui.notification('success', "Message enregistré.");
		      },
		      error: function(_data){
		        eventplanner.ui.notification('error', "Impossible d'enregistrer le message. " + _data.message);
		      }
		    });
		    
			return false;
		});

		/*
		
		$(document).on('show.bs.modal', '.modal', function (event) {
			var zIndex = Math.max.apply(null, Array.prototype.map.call(document.querySelectorAll('*'), function(el) {
			  return +el.style.zIndex;
			})) + 10;
	        //var zIndex = 1040 + (10 * $('.modal:visible').length);
	        $(this).css('z-index', zIndex);
	        setTimeout(function() {
	            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
	        }, 0);
	    });
	    
		*/
	},

	initselectors: function (){
		this.eventMenu = $("#eventDrop");
		this.pageContainer = $("#pageContainer");
		this.modalContainer = $("#modalContainer");
		this.searchBox = $("#searchbox");
	},

	configEventMenu: function() {
		if(userProfils.hasOwnProperty('eventId')){
			eventplanner.event.byId({id: userProfils.eventId, success: function(_data) {
				eventplanner.ui.eventMenu.empty();
				eventplanner.ui.eventMenu.append($('<i />', {
									class: "glyphicon glyphicon-cd"}
								));

				eventplanner.ui.eventMenu.append('&nbsp;&nbsp;' + _data.name);
				eventplanner.ui.eventMenu.append($('<b />', {
									class: "caret"}
								));
				eventplanner.ui.eventMenu.show();
			}});
		}else{
			eventplanner.ui.eventMenu.hide();
		}
	},

	openModal: function(title, name, data, callbacks){
		if(!callbacks.hasOwnProperty('preShow')){
			callbacks.preShow = function(){};
		}

		if(!callbacks.hasOwnProperty('postShow')){
			callbacks.postShow = function(){};
		}

		this.modalContainer.loadTemplate($("#templateModal"), {title: title, modalId: 'epModal' + '1'});

		var modal = this.modalContainer.find('#epModal' + '1');
		modal.on('show.bs.modal', {data: data, callbacks: callbacks}, function (e) {
		    e.data.callbacks.postShow(data);
		});

		modal.on('hide.bs.modal', function (e) {
		    this.remove();
		});

		modal.find('.modal-body').loadTemplate("desktop/modal/" + name + ".php", data, {
			success: function(){
				callbacks.preShow(data);
				modal.modal("show");
			}
		});
	},

	closeModal: function(){
		this.modalContainer.find('#epModal' + '1').modal("hide");
	},
	
	notification: function(type, text, title){
		if(type=='success'){
			toastr.success(text, title);
		}
		
		if(type=='error'){
			toastr.error(text, title);
		}
		
		if(type=='info'){
			toastr.info(text, title);
		}
		
		if(type=='warning'){
			toastr.warning(text, title);
		}		
	},

	loadPage: function(_page){
		this.pageContainer.load("desktop/php/" + _page + ".php", function(){
			eventplanner.ui[_page].init();
		});

		history.pushState(null, _page + ' - eventPlanner', "index.php?p=" + _page);
		document.title = _page + ' - eventPlanner';
	}
};



/////////////////////////////////////////////////
/// SEARCH //////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.search = {
	data: [],

	init: function(){
		eventplanner.ui.searchBox.typeahead('destroy');
		this.constructSearchData();
	},

	constructSearchData: function(){
		this.data = [];

		eventplanner.zone.byEventId({
		    eventId: userProfils.eventId,
		    success: function(_zonesData) {
		    	_zonesData.forEach(function(_zoneData){
		    		eventplanner.ui.search.data.push({
			    		title: _zoneData.name,
			    		type: 'Zone',
			    		id: _zoneData.id,
			    		content: 'Etat: ' + formatState(_zoneData.state)
			    	});
		    	});

		    	eventplanner.eqLogic.byEventId({
				    eventId: userProfils.eventId,
				    success: function(_eqLogicsData) {
				    	_eqLogicsData.forEach(function(_eqLogicData){
				    		
				    		eventplanner.ui.search.data.push({
					    		title: _eqLogicData.matTypeName + ' ' + _eqLogicData.eqRealName,
					    		type: 'Equipement',
					    		id: _eqLogicData.zoneId,
					    		content: 'Zone: ' +  _eqLogicData.zoneName + '<br>IP: ' + _eqLogicData.eqLogicIp + '<br>Etat: ' + formatState(_eqLogicData.eqLogicState)
					    	});
				    	});

						eventplanner.ui.searchBox.typeahead({
							debug: true,
						    minLength: 1,
						    maxItem: 8,
						    maxItemPerGroup: 6,
						    order: "asc",
						    hint: true,
						    group: {
						        key: "type"
						    },
						    display: ["title", "content"],
						    template: '<span>' +
						        '<span class="title">{{title}}</span><br>' +
						        '<span class="content" style="font-variant: small-caps;color: #777;">{{content}}</span>' +
						    '</span>',
						    correlativeTemplate: true,
						    source: {
						        items: {
						        	data: eventplanner.ui.search.data
						        }
						    },
						    callback: {
						    	onClickBefore: function (node, a, item, event) {
						    		//if(item.type == "Zone"){
						    			eventplanner.zone.byId({
								    		id: item.id,
								    		success: function(_data) {
												var zoneModal = new eventplanner.ui.modal.EpModalZone(_data);
												zoneModal.open();
											}
										});
						    		//}
						    	},
						    	onClickAfter: function (node, a, item, event) {
						    		node.val("");
						    		node.blur();
						    	},
						    	onShowLayout:function () {
								    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
								    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
								  },
						    	onHideLayout:function () {
								    $(".navbar-collapse.in").css("max-height", "");
								    $(".navbar-collapse.in").css("height", "");
								  }
						    }
						});
				    }
				});
		    }
		});
	}
}

/////////////////////////////////////////////////
/// DASHBOARD ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.dashboard = {
	init: function(){
		this.constructeventList();

		$('#dashboard').delegate('.selectEventBtn', 'click', function () {
			eventplanner.user.setOptions({key: 'eventId', value: $(this).attr('data-event-id') ,success: function(_data) {
				userProfils.eventId = _data.options.eventId;
				eventplanner.ui.configEventMenu();
				eventplanner.ui.search.init();
				eventplanner.ui.loadPage('map');
			}});
		});
	},

	constructeventList: function(){
		eventplanner.event.byDayInterval({
			dayBefore: 60,
			dayAfter: 60,
			success: function(_data) {
				$("#eventList").loadTemplate($("#templateEventList"), _data);
			}});
	}
};

/////////////////////////////////////////////////
/// UTILITAIRES ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.utilitaires = {
	init : function(){}
};

/////////////////////////////////////////////////
/// CONFIGURATION ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.configuration = {
	init : function(){
		this.constructEventTable();
		this.constructMatTypeTable();
		this.constructUserTable();

		$("#eventTable").bind("refreshEventTable", function(){
			eventplanner.ui.configuration.constructEventTable();
		});

		$("#matTypeTable").bind("refreshMatTypeTable", function(){
			eventplanner.ui.configuration.constructMatTypeTable();
		});

		$("#userTable").bind("refreshUserTable", function(){
			eventplanner.ui.configuration.constructUserTable();
		});

		$('#configuration').delegate('.selectEventBtn', 'click', function () {
			eventplanner.user.setOptions({key: 'eventId', value: $(this).attr('data-event-id') ,success: function(_data) {
				userProfils.eventId = _data.options.eventId;
				eventplanner.ui.configEventMenu();
				eventplanner.ui.search.init();
			}});
		});

		$('#configuration').delegate('.editEventBtn', 'click', function () {
			var eventId = $(this).attr('data-event-id');
			
			if(eventId == 'new'){
				var today = new Date().toISOString().slice(0,10); 
				
				var eventData = {
					id: '',
					localisation: [48.856614, 2.352222],
					startDate: today,
					endDate: today
				}
				
				//eventplanner.ui.modal.eventConfiguration(eventData);
				var eventModal = new eventplanner.ui.modal.EpModalEventConfiguration(eventData);
				eventModal.open();
			}else{
				eventplanner.event.byId({id: eventId, success: function(_data) {
					//eventplanner.ui.modal.eventConfiguration(_data);		
					var eventModal = new eventplanner.ui.modal.EpModalEventConfiguration(_data);
					eventModal.open();	
				}});
			}
		});

		$('#configuration').delegate('.editMatTypeBtn', 'click', function () {
			var matTypeId = $(this).attr('data-matType-id');
			
			if(matTypeId == 'new'){
				var matTypeData = {
					id: '',
					options: []
				}
				
				//eventplanner.ui.modal.matTypeConfiguration(matTypeData);
				var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(matTypeData);
				matTypeModal.open();
			}else{
				eventplanner.matType.byId({id: matTypeId, success: function(_data) {
					//eventplanner.ui.modal.matTypeConfiguration(_data);
					var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(_data);
					matTypeModal.open();		
				}});
			}
		});

		$('#configuration').delegate('.editUserBtn', 'click', function () {
			var userId = $(this).attr('data-user-id');
			
			if(userId == 'new'){
				var userData = {
					id: '',
					enable: true
				}
				
				eventplanner.ui.modal.userConfiguration(userData);
			}else{
				eventplanner.user.byId({id: userId, success: function(_data) {
					eventplanner.ui.modal.userConfiguration(_data);			
				}});
			}
		});
	},

	constructEventTable: function(){
		eventplanner.event.all({success: function(_data) {
			$("#eventTable > tbody").loadTemplate($("#templateEventTable"), _data);
		}});
	},

	constructMatTypeTable: function(){
		eventplanner.matType.all({success: function(_data) {
			$("#matTypeTable > tbody").loadTemplate($("#templateMatTypeTable"), _data);
		}});
	},

	constructUserTable: function(){
		eventplanner.user.all({success: function(_data) {
			$("#userTable > tbody").loadTemplate($("#templateUserTable"), _data);
		}});
	}
};

/////////////////////////////////////////////////
/// INVENTAIRE  /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.inventaire ={
	init: function(){
	  	$.tablesorter.themes.bootstrap = {
		    table        : 'table  table-bordered table-striped table-condensed',
		    caption      : 'caption',
		    header       : 'bootstrap-header',
		    iconSortNone : 'bootstrap-icon-unsorted',
		    iconSortAsc  : 'glyphicon glyphicon-chevron-up',
		    iconSortDesc : 'glyphicon glyphicon-chevron-down',
		  };

	  	$("#eqRealTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "filter", "zebra"],
			    widgetOptions : {
			      filter_reset : ".reset",
			      filter_cssFilter: "form-control",
			      filter_childRows  : true,
			    }
			})
			.tablesorterPager({
				container: $(".ts-pager"),
				cssGoto  : ".pagenum",
				removeRows: false,
				output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
			});

		$('#inventaire').delegate('.editEqRealBtn', 'click', function () {
			var eqRealId = $(this).attr('data-eqReal-id');
			
			if(eqRealId == 'new'){			
				var eqRealData = {
					eqRealId: '',
					eqRealState: 300
				}
				
				//eventplanner.ui.modal.eqRealConfiguration(eqRealData);
				var eqRealModal = new eventplanner.ui.modal.EpModalEqRealConfiguration(eqRealData);
				eqRealModal.open();
			}else{
				eventplanner.eqReal.byId({id: eqRealId, success: function(_data) {
					//eventplanner.ui.modal.eqRealConfiguration(_data);
					var eqRealModal = new eventplanner.ui.modal.EpModalEqRealConfiguration(_data);
					eqRealModal.open();
				}});
			}
		});

		$("#eqRealTable").bind("refreshEqRealTable", function(event){
			eventplanner.ui.inventaire.constructEqRealTable();
		});

		this.constructEqRealTable();
	},

	constructEqRealTable: function(){
		eventplanner.eqReal.all({
		    success: function(_data) {
				$("#eqRealTable > tbody").loadTemplate($("#templateEqRealTable"), _data);
				$('#eqRealTable').trigger('update');
		}});
	}
};

/////////////////////////////////////////////////
/// MAP /////////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.map = {
	zonesMarkers: [],

	init: function(){
		eventplanner.event.byId({id: userProfils.eventId, success: function(_data) {
			map = eventplanner.ui.map.initializeEventMap("map", _data.id, _data.localisation);
			eventplanner.zone.byEventId({eventId: userProfils.eventId, success: function(_data) {
				_data.forEach(function(zone) {
				  zoneMarker = eventplanner.ui.map.addZoneMarkerOnMap(this, zone);
				  eventplanner.ui.map.zonesMarkers[zone.id] = zoneMarker;
				  zoneMarker.on({
				    click: function (e) {
				    	eventplanner.zone.byId({
				    		id: this.zoneData.id,
				    		success: function(_data) {
								var zoneModal = new eventplanner.ui.modal.EpModalZone(_data);
								zoneModal.open();
							}
						});
				    }
				  });
				}, map);
			}});
		}});

		$(window).resize(function() {
			$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
		});

		var container = $(".leaflet-control-layers")[0];
		if(container != undefined){
			if (!L.Browser.touch) {
			  L.DomEvent
			  .disableClickPropagation(container)
			  .disableScrollPropagation(container);
			} else {
			  L.DomEvent.disableClickPropagation(container);
			}
		}
	},

	initializeEventMap: function(mapContainer, eventId, locationCenter, zoom){
		zoom = typeof zoom !== 'undefined' ? zoom : 18;

	    /* Basemap Layers */
		var cartoLight = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		  maxZoom: 19,
		  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
		});

		var eventTiles = L.tileLayer.fallback('./ressources/eventPlan/' + eventId + '/tiles/{z}/{x}/{y}.png', {
		      minZoom: 14,
		      maxZoom: 22,
		      tms: true
		  });

		map = L.map(mapContainer, {
		  zoom: zoom,
		  maxZoom: 22,
		  center: locationCenter,
		  layers: [cartoLight, eventTiles],
		  zoomControl: false,
		  attributionControl: false
		});
		map.options.singleClickTimeout = 250;

		setTimeout(function(){
			map.invalidateSize();
		}, 500);

		return map;
	},

	addZoneMarkerOnMap: function(map, zone, dragable){
		dragable = typeof dragable !== 'undefined' ? dragable : false;
		
		var zoneMarker = L.marker(zone.localisation, {draggable:dragable, title: zone.name, icon: L.AwesomeMarkers.icon({icon: 'glyphicon-arrow-down',markerColor: 'red'})});
		zoneMarker.addTo(map);
		zoneMarker.zoneData = zone;

		return zoneMarker;
	},

	addEqMarkerOnMap: function(map, eq, dragable){
		dragable = typeof dragable !== 'undefined' ? dragable : false;
		
		eq.name = "";
		
		if(eq.hasOwnProperty('eqLogicConfiguration')){
			eq.configuration = eq.eqLogicConfiguration;
			eq.name = eq.eqRealName;
		}
		
		var eqMarker = L.marker(eq.configuration.localisation, {draggable:dragable, title: eq.name, icon: L.AwesomeMarkers.icon({icon: 'glyphicon-arrow-down',markerColor: 'green'})});
		eqMarker.addTo(map);
		eqMarker.eqData = eq;

		return eqMarker;
	},

	addEventMarkerOnMap: function(map, event, dragable){
		dragable = typeof dragable !== 'undefined' ? dragable : false;

		var eventMarker = L.marker(event.localisation, {draggable:dragable, title: event.name, icon: L.AwesomeMarkers.icon({icon: 'glyphicon-arrow-down',markerColor: 'blue'})});
		eventMarker.addTo(map);
		eventMarker.eventData = event;

		return eventMarker;
	}
};

/////////////////////////////////////////////////
/// MAIN COURANTE ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.maincourante = {
	init: function(){
	  	$.tablesorter.themes.bootstrap = {
		    table        : 'table  table-bordered table-striped table-condensed',
		    caption      : 'caption',
		    header       : 'bootstrap-header',
		    iconSortNone : 'bootstrap-icon-unsorted',
		    iconSortAsc  : 'glyphicon glyphicon-chevron-up',
		    iconSortDesc : 'glyphicon glyphicon-chevron-down',
		  };

	  	$("#msgTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "filter", "zebra"],
			    widgetOptions : {
			      filter_reset : ".reset",
			      filter_cssFilter: "form-control",
			      filter_childRows  : true,
			    }
			})
			.tablesorterPager({
				container: $(".ts-pager"),
				cssGoto  : ".pagenum",
				removeRows: false,
				output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
			});

		this.constructMsgTable();
		
		$("#msgTable").bind("refreshMsgTable", function(){
			eventplanner.ui.maincourante.constructMsgTable();
		});
	},

	constructMsgTable: function(){
		eventplanner.msg.byEventId({
		    eventId: userProfils.eventId,
		    success: function(_data) {
				$("#msgTable > tbody").loadTemplate($("#templateMsgTable"), _data);
				$('#msgTable').trigger('update');
		}});
	}
};

/////////////////////////////////////////////////
/// PLANNING ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.planning = {
	init: function(){
	  	$.tablesorter.themes.bootstrap = {
		    table        : 'table  table-bordered table-condensed',
		    caption      : 'caption',
		    header       : 'bootstrap-header',
		    iconSortNone : 'bootstrap-icon-unsorted',
		    iconSortAsc  : 'glyphicon glyphicon-chevron-up',
		    iconSortDesc : 'glyphicon glyphicon-chevron-down',
		  };

	  	$("#planningTable").tablesorter({
			    theme : "bootstrap",
			    cssChildRow : "tablesorter-childRow",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "filter"],
			    widgetOptions : {
			      filter_reset : ".reset",
			      filter_cssFilter: "form-control",
			      filter_childRows  : true,
			    }
			});
		
		$('#planningTable').delegate( '.toggle', 'click' ,function() {
			$(this).closest('tr').nextUntil('tr:not(.tablesorter-childRow)').find('td').toggle();
			$(this).find('span').toggle();
			return false;
		});
		
		$('#planningTable').delegate( '.planningZoneCb', 'change' ,function() {
			var zoneId = $(this).data('zone-id');
			$('#planningTable .planningEqCb[data-zone-id=' + zoneId + ']').prop('checked', $(this).prop('checked'));
		});
		
		this.constructPlanningTable();
	},

	constructPlanningTable: function(){
		eventplanner.zone.byEventId({
		    eventId: userProfils.eventId,
		    success: function(_zonesData) {
				$("#planningTable > tbody").loadTemplate($("#templatePlanningTableZone"), _zonesData);
		    	
		    	eventplanner.eqLogic.byEventId({
		    		eventId: userProfils.eventId,
				    success: function(_eqsData) {
				    	_eqsData.forEach(function(_eqData) {
				    		var eqRow = $("<div/>").loadTemplate($("#templatePlanningTableEq"), _eqData);
				    		eqRow.find('tr').addClass(formatStateColorClass(_eqData.eqLogicState));
				    		
						    $("#planningTable tr[data-zone-id='" + _eqData.zoneId + "']")
						    	.after(eqRow.children())
						    	.find('td[rowspan]').attr( "rowspan", function(i, val ) {return parseInt(val)+1;})
						});
						
						$('#planningTable').trigger('update');
				}});			
		}});
	}
};

/////////////////////////////////////////////////
/// EQUIPEMENTS /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.equipements = {
	init: function(){
	  	$.tablesorter.themes.bootstrap = {
		    table        : 'table  table-bordered table-striped table-condensed',
		    caption      : 'caption',
		    header       : 'bootstrap-header',
		    iconSortNone : 'bootstrap-icon-unsorted',
		    iconSortAsc  : 'glyphicon glyphicon-chevron-up',
		    iconSortDesc : 'glyphicon glyphicon-chevron-down',
		  };

	  	$("#eqTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "filter", "zebra"],
			    widgetOptions : {
			      filter_reset : ".reset",
			      filter_cssFilter: "form-control",
			      filter_childRows  : true,
			    }
			})
			.tablesorterPager({
				container: $(".ts-pager"),
				cssGoto  : ".pagenum",
				removeRows: false,
				output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'
			});

		$('#equipements').delegate('.editEqBtn', 'click', function () {
			var eqId = $(this).attr('data-eq-id');
			
			if(eqId == 'new'){			
				var eqData = {
					eqLogicId: '',
					eqLogicEventId: userProfils.eventId,
					eqLogicState: 100,
					eqLogicConfiguration: {hasLocalisation: false}
				}
				
				var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eqData);
				eqModal.open();
			}else{
				eventplanner.eqLogic.byId({id: eqId, success: function(_data) {
					var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(_data);
					eqModal.open();
				}});
			}
		});
		
		this.constructEqTable();
		
		$("#eqTable").bind("refreshEqTable", function(){
			eventplanner.ui.equipements.constructEqTable();
		});
	},

	constructEqTable: function(){
		eventplanner.eqLogic.byEventId({
		    eventId: userProfils.eventId,
		    success: function(_data) {
				$("#eqTable > tbody").loadTemplate($("#templateEqTable"), _data);
				$('#eqTable').trigger('update');
		}});
	}
};

/////////////////////////////////////////////////
/// ZONES ///////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.zones ={
	init: function(){
		$('#zones').delegate('.editZoneBtn', 'click', function () {
			var zoneId = $(this).attr('data-zone-id');
			
			if(zoneId == 'new'){
				eventplanner.event.byId({
				    id: userProfils.eventId,
				    success: function(_data) {
						var zoneData = {
							id: '',
							eventId: _data.id,
							localisation: _data.localisation,
							installDate: _data.startDate,
							uninstallDate: _data.endDate,
							state: 200
						}
						
						var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(zoneData);
						zoneConfModal.open();
				}});
			}else{
				eventplanner.zone.byId({id: zoneId, success: function(_data) {
					var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(_data);
						zoneConfModal.open();		
				}});
			}
		});
	
		$("#zoneTable").bind("refreshZoneTable", function(){
			eventplanner.ui.zones.constructZoneTable();
		});
		
		this.constructZoneTable();
	},
	
	constructZoneTable: function(){
		eventplanner.zone.byEventId({
		    eventId: userProfils.eventId,
		    success: function(_data) {
				$("#zoneTable > tbody").loadTemplate($("#templateZoneTable"), _data);
				$('#zoneTable').trigger('update');
		}});
	}
}

/////////////////////////////////////////////////
/// MODAL////////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.modal = {};

eventplanner.ui.modal.EpModal = function(_title, _name){
	this.title = _title;
	this.name = _name;
	this.modalContainer = $("#modalContainer");
	
	this.id = ++eventplanner.ui.modal.EpModal.prototype.lastId;
	
	this.modalContainer.loadTemplate($("#templateModal"), {title: this.title, modalId: 'epModal' + this.id}, {append: true});
	this.modal = this.modalContainer.find('#epModal' + this.id);
}

eventplanner.ui.modal.EpModal.prototype.lastId = 1;

eventplanner.ui.modal.EpModal.prototype.open = function(){
	if(!this.hasOwnProperty('preShow')){
		this.preShow = function(){};
	}

	if(!this.hasOwnProperty('postShow')){
		this.postShow = function(){};
	}
	
	if(!this.hasOwnProperty('data')){
		this.data = {};
	}
	
	this.modal.on('show.bs.modal', this, function (e) {
		e.data.postShow();
	});

	this.modal.on('hide.bs.modal', function (e) {
		this.remove();
	});

	this.data.modalId = this.id;
	this.modal.find('.modal-body').loadTemplate("desktop/modal/" + this.name + ".php", this.data, {
		success: function(thisModal){
			return function(){
				thisModal.preShow();
				thisModal.modal.modal("show");
			}
		}(this)
	});
}

eventplanner.ui.modal.EpModal.prototype.close = function(){
	this.modal.modal("hide");
}

///// MODAL ZONE /////////////////////////////////////////

eventplanner.ui.modal.EpModalZone = function(_zone){
	eventplanner.ui.modal.EpModal.call(this, _zone.name, "zone");
	
	this.data = _zone;
	
	this.preShow = function(){
		this.constructMsgTable();
		this.constructEqTable();
		this.addTriggers();
	}

	this.postShow = function(){
		this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.eventId, this.data.localisation, 20);
		this.zoneMarker = eventplanner.ui.map.addZoneMarkerOnMap(this.mapZone, this.data);
		this.constructEqMarkers();
		
		this.modal.on('shown.bs.tab', this, function(event) {
		  event.data.mapZone.invalidateSize();
		});
	}
	
	this.addTriggers = function(){
		this.modal.find("#zoneMsgTable").bind("refreshMsgTable", this, function(event){
			event.data.constructMsgTable();
		});
		
		this.modal.find("#zoneEqTable").bind("refreshEqTable", this, function(event){
			event.data.constructEqTable();
		});
	}

	this.constructMsgTable = function(){
		eventplanner.msg.byZoneId({
			zoneId: this.data.id,
			success: function(thisModal){
				return function(_data) {
					thisModal.modal.find("#zoneMsgTable tbody").loadTemplate($("#templateZoneMsgTable"), _data);
				}
			}(this)			
		});
	}

	this.constructEqTable = function(){
		eventplanner.eqLogic.byZoneId({
			zoneId: this.data.id,
			success: function(thisModal){
				return function(_data) {
					thisModal.modal.find("#zoneEqTable").loadTemplate($("#templateZoneEqTable"), _data);
				}
			}(this)
		});
	}

	this.constructEqMarkers = function(){
		eventplanner.eqLogic.byZoneId({
			zoneId: this.data.id,
			success: function(thisModal){
				return function(_data) {
					_data.forEach(function(eq){
						if(eq.eqLogicConfiguration.hasOwnProperty('hasLocalisation') && eq.eqLogicConfiguration.hasLocalisation){
							var eqMarker = eventplanner.ui.map.addEqMarkerOnMap(thisModal.mapZone, eq);
							eqMarker.bindPopup('<div><b>' + eq.matTypeName + ' - ' + eq.eqRealName + '</b>');
						}
					}, thisModal);
					
				}
			}(this)
		});
	}
}

eventplanner.ui.modal.EpModalZone.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalZone,
        enumerable: false,
        writable: true,
        configurable: true
    }
});


/// MODAL EQUIPEMENT CONFIGURATION /////////////
eventplanner.ui.modal.EpModalEqConfiguration = function(_eqLogic){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un équipement", "eqConfiguration");
	
	this.data = _eqLogic;
	
	this.preShow = function(){
		this.modal.find("#eqLogicMatTypeId").change(this, function(event) {
			event.data.constructAndSelectEqReal();
		});

		if(this.data.eqLogicConfiguration.hasLocalisation){
			this.modal.find("#mapDiv").show();
		}else{
			this.modal.find("#mapDiv").hide();
		}

		eventplanner.zone.byEventId({
			eventId: userProfils.eventId,
			success: function(thisModal){
						return function(_data) {
							thisModal.modal.find("#eqLogicZoneId").loadTemplate($("#templateEqZoneOptions"), _data, {success: function(thisModal){
								return function() {
									thisModal.modal.find('#eqLogicZoneId option[value="' + thisModal.data.eqLogicZoneId + '"]').prop('selected', true);
								}
							}(thisModal)});
						}
					}(this)
			});

		eventplanner.matType.all({
			success: function(thisModal){
						return function(_data) {
							thisModal.modal.find("#eqLogicMatTypeId").loadTemplate($("#templateEqMatTypeOptions"), _data, {success: function(thisModal){
								return function() {
									thisModal.modal.find('#eqLogicMatTypeId option[value="' + thisModal.data.eqLogicMatTypeId + '"]').prop('selected', true);
								}
							}(thisModal)});
							
							thisModal.constructAndSelectEqReal();
						}
					}(this)
			});
	}

	this.postShow = function(){
			this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.eventId, this.data.eqLogicConfiguration.localisation);
			this.eqMarker = eventplanner.ui.map.addEqMarkerOnMap(this.mapZone, this.data, true);
						
			this.modal.on('shown.bs.tab', this, function(event) {
			  event.data.mapZone.invalidateSize();
			});

			this.mapZone.on('singleclick', function(thisModal){
				return function(event) {
					thisModal.eqMarker.setLatLng(event.latlng);
				}
			}(this));

			this.modal.find("#eqLogicZoneId").on('change', this, function() {
			  	event.data.mapZone.panTo(event.data.modal.find('#eqLogicZoneId option:selected').data('zone-loc'));
			});
			
			this.modal.find("#eqLocalisation")
				.bootstrapSwitch({
					state: this.data.eqLogicConfiguration.hasLocalisation,
					onText: "Oui",
					offText: "Non"
				})			
				.on('switchChange.bootstrapSwitch', this, function(event, state) {
					if(state){
						event.data.modal.find("#mapDiv").show();
						event.data.mapZone.invalidateSize();
						event.data.eqMarker.setLatLng(event.data.modal.find('#eqLogicZoneId option:selected').data('zone-loc'));
						event.data.mapZone.panTo(event.data.modal.find('#eqLogicZoneId option:selected').data('zone-loc'));
					}else{
						event.data.modal.find("#mapDiv").hide();
					}
				});

			this.modal.find('#eqLogicForm').submit(this, function(event) {
			    var eqParam = {
			        id: $(this).find("#eqLogicId").val(),
			        eventId: $(this).find("#eqLogicEventId").val(),
			        zoneId: $(this).find("#eqLogicZoneId").val(),
			        matTypeId: $(this).find("#eqLogicMatTypeId").val(),
			        eqRealId: $(this).find("#eqLogicEqRealId").val(),
			        ip: $(this).find("#eqLogicIp").val(),
			        comment: $(this).find("#eqLogicComment").val(),
			        state: $(this).find("#eqLogicState").val(),
			        configuration: {
			        	hasLocalisation: $(this).find("#eqLocalisation").bootstrapSwitch('state'),
			        	localisation: event.data.eqMarker.getLatLng()
			        }
			    };
			    
			    eventplanner.eqLogic.save({
			      eqLogic: eqParam,
			      success: function(thisModal){
								return function() {
									$(".eqTable").trigger("refreshEqTable");
									thisModal.close();
									eventplanner.ui.notification('success', "Equipement enregistré.");
								}
							}(event.data),
			      error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer l'équipement. " + _data.message);
			      }
			    });
			    
			    return false;
			});
		}
	
	
	this.constructAndSelectEqReal = function(){
	  this.modal.find('#eqLogicEqRealId option').remove();
	  
	  this.modal.find('#eqLogicEqRealId').append($("<option></option>")
						.attr("value", 'None')
						.text("Aucun"));

	  eventplanner.eqReal.byMatTypeId({
		matTypeId: $('#eqLogicMatTypeId option:selected').val(),
		success: function(thisModal){
					return function(_data) {
						thisModal.modal.find("#eqLogicEqRealId").loadTemplate($("#templateEqRealOptions"), _data, {append: true});
						thisModal.modal.find('#eqLogicEqRealId option[value="' + thisModal.data.eqRealId + '"]').prop('selected', true);
					}
				}(this)
	  });
	}
}

eventplanner.ui.modal.EpModalEqConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalEqConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

/// MODAL ZONE CONFIGURATION /////////////
eventplanner.ui.modal.EpModalZoneConfiguration = function(_zone){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'une zone", "zoneConfiguration");
	
	this.data = _zone;
	
	this.preShow = function(){
			this.modal.find('.input-daterange').datepicker({
			    format: "dd/mm/yyyy",
			    todayBtn: true,
			    language: "fr"
			}).on('hide', function(event) {
				event.preventDefault();
				event.stopPropagation();
			});
			
			if(this.data.id==''){
				this.modal.find('.eqZoneConf').hide();
			}
			
			this.constructEqTable();
			
			this.modal.find('#zoneForm').delegate('.editEqBtn', 'click', this, function (event) {
				var eqId = $(this).attr('data-eq-id');
				
				if(eqId == 'new'){			
					var eqData = {
						eqLogicId: '',
						eqLogicZoneId: event.data.data.id,
						eqLogicEventId: userProfils.eventId,
						eqLogicState: 100,
						eqLogicConfiguration: {hasLocalisation: false}
					}
					
					var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eqData);
					eqModal.open();
				}else{
					eventplanner.eqLogic.byId({id: eqId, success: function(_data) {
						var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(_data);
						eqModal.open();
					}});
				}
			});
			
			this.modal.find(".eqTable").bind("refreshEqTable", this, function(event){
				event.data.constructEqTable();
			});
		}
	
	this.postShow = function(){
			this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.eventId, this.data.localisation);
			this.zoneMarker = eventplanner.ui.map.addZoneMarkerOnMap(this.mapZone, this.data, true);
						
			this.modal.on('shown.bs.tab', this, function(event) {
			  event.data.mapZone.invalidateSize();
			});

			this.mapZone.on('singleclick', function(thisModal){
				return function(event) {
					thisModal.zoneMarker.setLatLng(event.latlng); 
				}
			}(this));

			this.modal.find('#zoneForm').submit(this, function(event) {
			    var zoneParam = {
			        id: $(this).find("#zoneId").val(),
			        eventId: $(this).find("#zoneEventId").val(),
			        name: $(this).find("#zoneName").val(),
			        localisation: event.data.zoneMarker.getLatLng(),
			        installDate: formatDateDmy2Ymd($(this).find("#zoneInstallDate").val()),
			        uninstallDate: formatDateDmy2Ymd($(this).find("#zoneUninstallDate").val()),
			        state: $(this).find("#zoneState").val(),
			        configuration: {}
			    };

			    eventplanner.zone.save({
			      zone: zoneParam,
			      success: function(thisModal){
								return function(_data) {
									$(".zoneTable").trigger("refreshZoneTable");
									if(thisModal.data.id==""){
										thisModal.data.id=_data.id;
										thisModal.modal.find('.eqZoneConf').show();
									}else{
										thisModal.close();
									}
									eventplanner.ui.notification('success', "Zone enregistrée.");	
								}
							}(event.data),
				  error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer la zone. " + _data.message);
			      }			  
			    });
			    return false;
			});
		}
			
	this.constructEqTable = function(){
		eventplanner.eqLogic.byZoneId({
		zoneId: this.data.id,
		success: function(thisModal){
					return function(_data) {
						thisModal.modal.find("#eqTableZone tbody").loadTemplate($("#templateZoneConfigurationEqTable"), _data);
					}
				}(this)
		});
	}
}

eventplanner.ui.modal.EpModalZoneConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalZoneConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});


/// MODAL EVENT CONFIGURATION ///////////////////

eventplanner.ui.modal.EpModalEventConfiguration = function(_event){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un événement", "eventConfiguration");
	
	this.data = _event;
	
	this.preShow = function(){
			this.modal.find('.input-daterange').datepicker({
			    format: "dd/mm/yyyy",
			    todayBtn: true,
			    language: "fr"
			}).on('hide', function(event) {
				event.preventDefault();
				event.stopPropagation();
			});
		}
	
	this.postShow = function(){
			this.mapEvent = eventplanner.ui.map.initializeEventMap('mapEvent' + this.id, this.data.id, this.data.localisation, 14);
			this.eventMarker = eventplanner.ui.map.addEventMarkerOnMap(this.mapEvent, this.data, true);

			this.modal.find('#placeOnMap').on('click', this, function (event) {
			  $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + event.data.modal.find("#eventVille").val(), function(thisModal){
					return function(data){
						$.each(data, function(key, val) {
					        var newLatLng = new L.LatLng(val.lat, val.lon);
					        thisModal.eventMarker.setLatLng(newLatLng); 
					        thisModal.mapEvent.setZoom(14);
					        thisModal.mapEvent.panTo(newLatLng);
					    });
					}
				}(event.data));
			});


			this.mapEvent.on('singleclick', function(thisModal){
				return function(event) {
					thisModal.eventMarker.setLatLng(event.latlng); 
				}
			}(this));
			
			this.modal.find('#eventForm').submit(this, function(event) {
			    var eventParam = {
			        id: $(this).find("#eventId").val(),
			        name: $(this).find("#eventName").val(),
			        ville: $(this).find("#eventVille").val(),
			        localisation: event.data.eventMarker.getLatLng(),
			        startDate: formatDateDmy2Ymd($(this).find("#eventStartDate").val()),
			        endDate: formatDateDmy2Ymd($(this).find("#eventEndDate").val()),
			        configuration: {}
			    };

				eventplanner.event.save({
			      event: eventParam,
			      success: function(thisModal){
								return function(_data) {
									$(".eventTable").trigger("refreshEventTable");
							        thisModal.close();
									eventplanner.ui.notification('success', "Zone enregistrée.");	
								}
							}(event.data),
				  error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer l'événement. " + _data.message);
			      }			  
			    });
			    return false;

			});
		}
}

eventplanner.ui.modal.EpModalEventConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalEventConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

/// MODAL INVENTAIRE CONFIGURATION /////////////

eventplanner.ui.modal.EpModalEqRealConfiguration = function(_eqReal){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un matériel", "eqRealConfiguration");
	
	this.data = _eqReal;
	
	this.preShow = function(){
			eventplanner.matType.all({
				success: function(thisModal){
					return function(_data) {
						thisModal.modal.find("#eqRealMatTypeId").loadTemplate(thisModal.modal.find("#templateEqMatTypeOptions"), _data, {
							success: function(thisModal){
								return function() {
									thisModal.modal.find('#eqRealMatTypeId option[value="' + thisModal.data.eqRealMatTypeId + '"]').prop('selected', true);
								}
							}(thisModal)
						});
					}
				}(this)
			});
		}
	
	this.postShow = function(){
			this.modal.find('#eqRealForm').submit(this, function(event) {
			    var eqRealParam = {
			        id: $(this).find("#eqRealId").val(),
			        matTypeId: $(this).find("#eqRealMatTypeId").val(),
			        name: $(this).find("#eqRealName").val(),
			        comment: $(this).find("#eqRealComment").val(),
			        state: $(this).find("#eqRealState").val(),
			        configuration: {localisation: ""}
			    };
			   
			    eventplanner.eqReal.save({
			      eqReal: eqRealParam,
			      success: function(thisModal){
								return function(_data) {
									$(".eqRealTable").trigger("refreshEqRealTable");
							        thisModal.close();
									eventplanner.ui.notification('success', "Matériel enregistrée.");	
								}
							}(event.data),
				  error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer le matériel. " + _data.message);
			      }			  
			    });

			    return false;
			});
			
		}
}

eventplanner.ui.modal.EpModalEqRealConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalEqRealConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

/// MODAL MAT TYPE CONFIGURATION ///////////////
eventplanner.ui.modal.EpModalMatTypeConfiguration = function(_matType){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un type de matériel", "matTypeConfiguration");
	
	this.data = _matType;
	
	this.preShow = function(){
			this.data.options.forEach(function(option){
	    		this.modal.find("#optionList").loadTemplate(this.modal.find("#templateMatTypeOption"), {option: option}, {append: true});
	    	}, this);

	    	this.modal.find("#optionList").loadTemplate(this.modal.find("#templateMatTypeAddOption"), {} , {append: true});
		}
	
	this.postShow = function(){
			this.modal.find('#matTypeForm').submit(this, function(event) {
			    var matTypeParam = {
			        id: $(this).find("#matTypeId").val(),
			        name: $(this).find("#matTypeName").val(),
			        options: {}
			    };

			    eventplanner.matType.save({
			      matType: matTypeParam,
			      success: function(thisModal){
								return function(_data) {
									$(".matTypeTable").trigger("refreshMatTypeTable");
							        thisModal.close();
									eventplanner.ui.notification('success', "Type de matériel enregistrée.");	
								}
							}(event.data),
				  error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer le type de matériel. " + _data.message);
			      }	
			    });
			    return false;
			});			
		}
}

eventplanner.ui.modal.EpModalMatTypeConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalMatTypeConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

/// MODAL USER CONFIGURATION ///////////////
eventplanner.ui.modal.EpModalUserConfiguration = function(_user){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un utilisateur", "userConfiguration");
	
	this.data = _user;
	
	this.preShow = function(){
		}
	
	this.postShow = function(){
			this.modal.find("#userEnable")
				.bootstrapSwitch({
					state: !!parseInt(this.data.enable),
					onText: "Oui",
					offText: "Non"
				})

			this.modal.find('#userForm').submit(this, function(event) {
			    var userParam = {
			        id: $(this).find("#userId").val(),
			        login: $(this).find("#userLogin").val(),
			        name: $(this).find("#userName").val(),
			        options: {},
			        rights: {},
			        enable: $(this).find("#userEnable").bootstrapSwitch('state')
			    };
			    
			    if(userParam.id == ''){
			    	userParam.password = userParam.login;
			    }

			    eventplanner.user.save({
			      user: userParam,
			      success: function(thisModal){
								return function(_data) {
									$(".userTable").trigger("refreshUserTable");
							        thisModal.close();
									eventplanner.ui.notification('success', "Utilisateur enregistré.");	
								}
							}(event.data),
				  error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer l'utilisateur. " + _data.message);
			      }	
			    });
			    return false;
			});			
		}
}

eventplanner.ui.modal.EpModalUserConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalUserConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});