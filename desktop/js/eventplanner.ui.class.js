eventplanner.ui = {
	onlineState: true,
	uiReady: $.Deferred(),
	STATE: {},

  	init: function() {
  		eventplanner.private.default_params.error = function(_data){
  			eventplanner.ui.notification('error', _data.message);
  		}
  		// chargement des data, puis initialisation de l'interface
  		$.when(this.initData()).done(function(){
	  		$.when(
	  			eventplanner.ui.initselectors(),
				eventplanner.ui.search.init(),
				eventplanner.ui.configEventMenu(),
				eventplanner.ui.serverListener(),
				eventplanner.ui.initNavBar(),
				eventplanner.ui.initTrigger()
				).done(
					function(){
						eventplanner.ui.uiReady.resolve();
					}
				);
  		});

		return this.uiReady;
	},

	initselectors: function (){
		this.eventMenu = $("#eventDrop");
		this.pageContainer = $("#pageContainer");
		this.modalContainer = $("#modalContainer");
		this.searchBox = $("#searchbox");

	},

	initData: function (){
		return $.when(
			eventplanner.event.load(),
			eventplanner.msg.load(),
			eventplanner.mission.load(),
			eventplanner.user.load(),
			eventplanner.zone.load(),
			eventplanner.eqLogic.load(),
			eventplanner.eqReal.load(),
			eventplanner.matType.load(),
			eventplanner.ui.initState()
		);
	},

	updateUI: function(_data){
		$(".msgTable").trigger("refreshMsgTable");

		if(_data.hasOwnProperty('event')){
			$(".eventTable").trigger("refreshEventTable");
		}

		if(_data.hasOwnProperty('user')){
			$(".userTable").trigger("refreshUserTable");
		}

		if(_data.hasOwnProperty('matType')){
			$(".matTypeTable").trigger("refreshMatTypeTable");
		}

		if(_data.hasOwnProperty('eqReal')){
			$(".eqRealTable").trigger("refreshEqRealTable");
		}

		if(_data.hasOwnProperty('zone')){
			$(".zoneTable").trigger("refreshZoneTable");
		}

		if(_data.hasOwnProperty('eqLogic')){
			$(".eqTable").trigger("refreshEqTable");
		}

		if(_data.hasOwnProperty('mission')){
			$(".missionTable").trigger("refreshMissionTable");
		}

		if(_data.hasOwnProperty('matType') || _data.hasOwnProperty('eqReal') || _data.hasOwnProperty('zone') || _data.hasOwnProperty('eqLogic')){
			eventplanner.ui.search.constructSearchData();
		}
	},

	initNavBar: function(){
		$("#nav-btn").click(function(e) {
		  $(".navbar-collapse").collapse("toggle");
		  return false;
		});
		
		$(".navBarBtn").click(function(e) {
		  eventplanner.ui.loadPage($(this).data('link'));
		  e.preventDefault();
		});
	},

	initTrigger: function(){
		$("body").delegate('.msgForm', 'submit', function () {
			if($(this).find('.msgFormInput').val()==''){
			    return false;
			}

			var msgParam = {
				eventId: userProfils.eventId,
				userId: user_id,
				content: $(this).find('.msgFormInput').val(),
				data:{}
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
		        //$(".msgTable").trigger("refreshMsgTable");
		        eventplanner.ui.checkNewMsg();
		        eventplanner.ui.notification('success', "Message enregistré.");
		      },
		      error: function(_data){
		        eventplanner.ui.notification('error', "Impossible d'enregistrer le message. " + _data.message);
		      }
		    });
		    
			return false;
		});
	},

	initState: function (){
		return $.getJSON( "core/config/stateList.json", function( data ) {
			eventplanner.ui.STATE = data;

			$.each(eventplanner.ui.STATE, function(i,item){
				$.each(item.groups, function(j, group){
					$.each(group.list, function(stateNbr, stateParam){
						eventplanner.ui.STATE.stateList[stateNbr] = stateParam;
					});
				});
			});
		});
	},

	checkNewMsg: function(){
		eventplanner.msg.getLastMsg({
		    success: function(_data, _date) {
		    	if(!eventplanner.ui.onlineState){
            		eventplanner.ui.onlineState = true;
            		$('.navbar').removeClass('navbar-inverse').addClass('navbar-default');
                	eventplanner.ui.notification('success', "Connexion avec le serveur OK.");
            	}
			},
			error: function(_data){
		        if(eventplanner.ui.onlineState){
            		eventplanner.ui.onlineState = false;
                	$('.navbar').removeClass('navbar-default').addClass('navbar-inverse');
                	eventplanner.ui.notification('error', "Perte de la connexion avec le serveur.");
            	}
		    }
		});
	},

	serverListener: function (){
		nbActiveAjaxRequest = 0;
		$(document)
		    .ajaxSend(function(event, jqxhr, settings) {
		        if (settings.hasOwnProperty('data') && settings.data.indexOf("action=sinceId") !== -1) return;
		                
		        if (nbActiveAjaxRequest == 0) {
		        	$.showLoading();
			    }
			    
		    	nbActiveAjaxRequest++;
		    })
		    .ajaxComplete(function(event, jqxhr, settings) {
		        if (settings.hasOwnProperty('data') && settings.data.indexOf("action=sinceId") !== -1) return;
		        
		        nbActiveAjaxRequest--;
			    if (nbActiveAjaxRequest <= 0) {
			        nbActiveAjaxRequest = 0;
			        $.hideLoading();
			    }
		    })
		
		setInterval(function(){ 
			eventplanner.ui.checkNewMsg();
		}, 5000);
	},

	configEventMenu: function() {
		if(userProfils.hasOwnProperty('eventId')){
			var currentEvent = eventplanner.event.byId(userProfils.eventId);

			eventplanner.ui.eventMenu.empty();
			eventplanner.ui.eventMenu.append($('<i />', {
								class: "glyphicon glyphicon-cd"}
							));

			eventplanner.ui.eventMenu.append('&nbsp;&nbsp;' + currentEvent.eventName);
			eventplanner.ui.eventMenu.append($('<b />', {
								class: "caret"}
							));
			eventplanner.ui.eventMenu.show();
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
		document.title = eventplanner.ui[_page].title + ' - eventPlanner';
	}
};



/////////////////////////////////////////////////
/// SEARCH //////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.search = {
	data: [],

	init: function(){
		eventplanner.ui.searchBox.typeahead('destroy');
		return this.constructSearchData();
	},

	constructSearchData: function(){
		this.data = [];

		// Ajout des zones
		var _zonesData = eventplanner.zone.all();

		_zonesData.forEach(function(_zoneData){

    		eventplanner.ui.search.data.push({
	    		title: _zoneData.zoneName,
	    		type: 'Zone',
	    		id: _zoneData.zoneId,
	    		content: 'Etat: ' + formatState(_zoneData.zoneState)
	    	});
    	});

		// Ajout des eqLogics
		var _eqLogicsData = eventplanner.eqLogic.all(true);

		_eqLogicsData.forEach(function(_eqLogicData){
    		eventplanner.ui.search.data.push({
	    		title: _eqLogicData.matTypeName + ' ' + _eqLogicData.eqRealName,
	    		type: 'Equipement',
	    		id: _eqLogicData.eqLogicZoneId,
	    		content: 'Zone: ' +  _eqLogicData.zoneName + '<br>IP: ' + _eqLogicData.eqLogicIp + '<br>Etat: ' + formatState(_eqLogicData.eqLogicState)
	    	});
    	});

		// Initialisation du moteur de recherche
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
					var zoneModal = new eventplanner.ui.modal.EpModalZone(eventplanner.zone.byId(item.id));
						zoneModal.open();
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
}

/////////////////////////////////////////////////
/// DASHBOARD ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.dashboard = {
	title: 'Dashboard',
	init: function(){
		$('#dashboard').delegate('.selectEventBtn', 'click', function () {
			eventplanner.user.setOptions({key: 'eventId', value: $(this).attr('data-event-id') ,success: function(_data) {
				userProfils.eventId = _data.userOptions.eventId;
				eventplanner.ui.configEventMenu();
				eventplanner.ui.search.init();
				eventplanner.ui.loadPage('map');
			}});
		});

		$('#dashboard').delegate('.selectMissionBtn', 'click', function () {
			var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(eventplanner.mission.byId($(this).attr('data-mission-id'), true));
				missionConfModal.open();
		});

		$("#missionList").bind("refreshMissionTable", function(){
			eventplanner.ui.dashboard.constructMissionList();
		});

		$("#eventList").bind("refreshEventTable", function(){
			eventplanner.ui.configuration.constructEventList();
		});
		
		this.constructEventList();
		this.constructMissionList();
	},

	constructEventList: function(){
		eventplanner.event.byDayInterval({
			dayBefore: 360,
			dayAfter: 360,
			success: function(_data) {
				$("#eventList").loadTemplate($("#templateEventList"), _data);
			}});
	},

	constructMissionList: function (){
		$("#missionList").loadTemplate($("#templateMissionList"), eventplanner.mission.byUserIdMaxState(user_id ,498, true));
	}
};

/////////////////////////////////////////////////
/// UTILITAIRES ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.utilitaires = {
	title: 'Utilitaires',
	init : function(){}
};

/////////////////////////////////////////////////
/// CONFIGURATION ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.configuration = {
	title: 'Configuration',
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
					eventId: '',
					eventLocalisation: [48.856614, 2.352222],
					eventStartDate: today,
					eventEndDate: today
				}
				
				var eventModal = new eventplanner.ui.modal.EpModalEventConfiguration(eventData);
				eventModal.open();
			}else{
				var eventModal = new eventplanner.ui.modal.EpModalEventConfiguration(eventplanner.event.byId(eventId));
				eventModal.open();	
			}
		});

		$('#configuration').delegate('.editMatTypeBtn', 'click', function () {
			var matTypeId = $(this).attr('data-matType-id');
			
			if(matTypeId == 'new'){
				var matTypeData = {
					matTypeId: '',
					matTypeOptions: []
				}
				
				//eventplanner.ui.modal.matTypeConfiguration(matTypeData);
				var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(matTypeData);
				matTypeModal.open();
			}else{
				var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(eventplanner.matType.byId(matTypeId));
				matTypeModal.open();
			}
		});

		$('#configuration').delegate('.editUserBtn', 'click', function () {
			var userId = $(this).attr('data-user-id');
			
			if(userId == 'new'){
				var userData = {
					userId: '',
					userEnable: true
				}
				
				var userModal = new eventplanner.ui.modal.EpModalUserConfiguration(userData);
				userModal.open();
			}else{
				var userModal = new eventplanner.ui.modal.EpModalUserConfiguration(eventplanner.user.byId(userId));	
				userModal.open();
			}
		});
	},

	constructEventTable: function(){
		$("#eventTable > tbody").loadTemplate($("#templateEventTable"), eventplanner.event.all());
	},

	constructMatTypeTable: function(){
		$("#matTypeTable > tbody").loadTemplate($("#templateMatTypeTable"), eventplanner.matType.all());
	},

	constructUserTable: function(){
		$("#userTable > tbody").loadTemplate($("#templateUserTable"), eventplanner.user.all());
	}
};

/////////////////////////////////////////////////
/// INVENTAIRE  /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.inventaire ={
	title: 'Inventaire',
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
				var eqRealModal = new eventplanner.ui.modal.EpModalEqRealConfiguration(eventplanner.eqReal.byId(eqRealId));
				eqRealModal.open();
			}
		});

		$('#inventaire').delegate('.editStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('eqrealId')], 'eqReal', $(this).data('eqrealState')); 
			stateModal.open();

			return false;
		});

		$("#eqRealTable").bind("refreshEqRealTable", function(event){
			eventplanner.ui.inventaire.constructEqRealTable();
		});

		this.constructEqRealTable();
	},

	constructEqRealTable: function(){
		$("#eqRealTable > tbody").loadTemplate($("#templateEqRealTable"), eventplanner.eqReal.all(true));
		$('#eqRealTable').trigger('update');
	}
};

/////////////////////////////////////////////////
/// MAP /////////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.map = {
	title: 'Carte',
	llMap: {},
	zonesMarkers: {},
	stateToShow: {min: 0, max: 219},
	
	init: function(){
		var currentEvent = eventplanner.event.byId(userProfils.eventId);
		var llMap = this.initializeEventMap("map", currentEvent.eventId, currentEvent.eventLocalisation);
		
		var selectStateBtn = L.easyButton({
		  id: 'selectStateBtn',
		  states: [{
		    stateName: 'montage',
		    icon: 'glyphicon-resize-full',
		    title: 'En cours: suivi du montage et l\'exploitation',
		    onClick: function(control) {
		      control.state('demontage');
		      $('#selectStateBtn').addClass('llselectstatebtn-active');
		      eventplanner.ui.map.stateToShow = {min: 220, max: 299};
		      eventplanner.ui.map.refreshZoneMarkerState();
		    }
		  }, {
		    stateName: 'demontage',
		    icon: 'glyphicon-resize-small',
		    title: 'En cours: suivi du démontage',
		    onClick: function(control) {
		      control.state('montage');
		      $('#selectStateBtn').removeClass('llselectstatebtn-active');
		      eventplanner.ui.map.stateToShow = {min: 0, max: 219};
		      eventplanner.ui.map.refreshZoneMarkerState();
		    }
		  }]
		});
		selectStateBtn.addTo(llMap);
		
		
		this.zonesMarkers = {};
		
		var zones = eventplanner.zone.all();
		zones.forEach(function(zone) {
			  zoneMarker = eventplanner.ui.map.addZoneMarkerOnMap(this, zone);
			  eventplanner.ui.map.zonesMarkers[zone.zoneId] = zoneMarker;
			  zoneMarker.on({
			    click: function (e) {
			    	var zoneModal = new eventplanner.ui.modal.EpModalZone(eventplanner.zone.byId(this.zoneId, true));
					zoneModal.open();
			    }
			  });
			}, llMap);
		
		$('#map').bind("refreshZoneTable", this, function(event){
			eventplanner.ui.map.refreshZoneMarkerState();
		});
		this.refreshZoneMarkerState();

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
		
		var zoneMarker = L.marker(
				zone.zoneLocalisation, 
				{
					draggable:dragable, 
					title: zone.zoneName, 
					icon: eventplanner.ui.map.getIconFromType('zone')
				});

		zoneMarker.addTo(map);
		zoneMarker.zoneId = zone.zoneId;

		return zoneMarker;
	},

	addEqMarkerOnMap: function(map, eq, dragable){
		dragable = typeof dragable !== 'undefined' ? dragable : false;
		
		var eqMarker = L.marker(
				eq.eqLogicConfiguration.localisation, 
				{
					draggable:dragable, 
					title: eq.eqLogicName, 
					icon: eventplanner.ui.map.getIconFromType('eq')
				});

		eqMarker.addTo(map);
		eqMarker.eqData = eq;

		return eqMarker;
	},

	addEventMarkerOnMap: function(map, event, dragable){
		dragable = typeof dragable !== 'undefined' ? dragable : false;

		var eventMarker = L.marker(
				event.eventLocalisation, 
				{	
					draggable:dragable,
				 	title: event.eventName,
				 	icon: eventplanner.ui.map.getIconFromType('event')
				 });

		eventMarker.addTo(map);
		eventMarker.eventData = event;

		return eventMarker;
	},
	
	refreshZoneMarkerState: function(){
		$.each(this.zonesMarkers, function(zoneId, zoneMarker) {
			  var zone = eventplanner.zone.byId(zoneMarker.zoneId);
			  
			  if(zone.zoneState >= eventplanner.ui.map.stateToShow.min && zone.zoneState <= eventplanner.ui.map.stateToShow.max){
			  	zoneMarker.setIcon(eventplanner.ui.map.getIconFromState(zone.zoneState));
			  }else{
			  	zoneMarker.setIcon(eventplanner.ui.map.getIconFromState('default'));
			  }
			});
	},
	
	getIconFromState: function(state){
		if(state == 'default'){
			return L.AwesomeMarkers.icon({
	 			icon: eventplanner.ui.STATE.default.mapMarkerIcon,
	 			markerColor: eventplanner.ui.STATE.default.mapMarkerColor
	 		});
		}else{
			return L.AwesomeMarkers.icon({
	 			icon: eventplanner.ui.STATE.stateList[state].mapMarkerIcon,
	 			markerColor: eventplanner.ui.STATE.stateList[state].mapMarkerColor
	 		});
		}
		 
	},

	getIconFromType: function(type){
		return L.AwesomeMarkers.icon({
 			icon: eventplanner.ui.STATE[type].mapMarkerIcon,
 			markerColor: eventplanner.ui.STATE[type].mapMarkerColor
 		});
	}
};

/////////////////////////////////////////////////
/// MAIN COURANTE ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.maincourante = {
	title: 'Main courante',
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
		var msgList = eventplanner.msg.all(true); // Fulldata

		$("#msgTable > tbody").loadTemplate($("#templateMsgTable"), msgList);
		$('#msgTable').trigger('update');
	}
};

/////////////////////////////////////////////////
/// PLANNING ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.planning = {
	title: 'Planning',
	init: function(){
	  	$.tablesorter.themes.bootstrap = {
		    table        : 'table table-condensed',
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
		
		$('#planning').delegate('.editMultipleStateBtn', 'click', function () {
			var eqList = [];
			var eqState = 0;

			$.each($('#planningTable .planningEqCb:checked'), function( index, eqCb) {
			  eqList.push($(eqCb).data('eqId'));
			  if(eqState < $(eqCb).data('eqlogicState')){
			  	eqState = $(eqCb).data('eqlogicState');
			  }
			});

			var stateModal = new eventplanner.ui.modal.EpModalState(eqList, 'eq', eqState); 
			stateModal.open();

			return false;
		});

		$('#planning').delegate('.editMultipleZoneStateBtn', 'click', function () {
			var zoneList = [];
			var zoneState = 0;

			$.each($('#planningTable .planningZoneCb:checked'), function( index, zoneCb) {
			  zoneList.push($(zoneCb).data('zoneId'));
			  if(zoneState < $(zoneCb).data('zoneState')){
			  	zoneState = $(zoneCb).data('zoneState');
			  }
			});

			var stateModal = new eventplanner.ui.modal.EpModalState(zoneList, 'zone', zoneState); 
			stateModal.open();

			return false;
		});

		$('#planning').delegate('.editStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('eqlogicId')], 'eq', $(this).data('eqlogicState')); 
			stateModal.open();

			return false;
		});

		$('#planning').delegate('.editZoneStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('zoneId')], 'zone', $(this).data('zoneState')); 
			stateModal.open();

			return false;
		});
		
		$('#planning .showAllZone').click(this, function (event) {
			event.data.showAllZone();
			return false;
		});

		$('#planning .hideAllZone').click(this, function (event) {
			event.data.hideAllZone();
			return false;
		});

		$('#planning').delegate('.zoneBtn', 'click', function () {
			var zoneModal = new eventplanner.ui.modal.EpModalZone(eventplanner.zone.byId($(this).data('zoneId')));
			zoneModal.open();

			return false;
		});

		$('#planningTable').delegate( '.planningZoneCb', 'change' ,function() {
			var zoneId = $(this).data('zone-id');
			$('#planningTable .planningEqCb[data-zone-id=' + zoneId + ']').prop('checked', $(this).prop('checked'));
		});

		$('#planningTable').bind("refreshEqTable", this, function(event){
			event.data.constructPlanningTable();
		});

		$('#planningTable').bind("refreshZoneTable", this, function(event){
			event.data.constructPlanningTable();
		});
		
		this.constructPlanningTable();
	},

	constructPlanningTable: function(){
		$("#planningTable > tbody").loadTemplate($("#templatePlanningTableZone"), eventplanner.zone.all(true));
    	
		var eqsData = eventplanner.eqLogic.all(true);

    	eqsData.forEach(function(_eqData) {
    		var eqRow = $("<div/>").loadTemplate($("#templatePlanningTableEq"), _eqData);
    		eqRow.find('tr').addClass(formatStateColorClass(_eqData.eqLogicState));

    		$("#planningTable tr[data-zone-id='" + _eqData.zoneId + "'] .planningZoneNbrEq").text($("#planningTable tr[data-zone-id='" + _eqData.zoneId + "']").find('td[rowspan]').attr( "rowspan") + ' équipement(s)');
    		
		    $("#planningTable tr[data-zone-id='" + _eqData.zoneId + "']")
		    	.after(eqRow.children())
		    	.find('td[rowspan]').attr( "rowspan", function(i, val ) {return parseInt(val)+1;});
		});
		
		$('#planningTable').trigger('update');
	},

	showAllZone: function(){
		$('#planningTable .toggle').closest('tr').nextUntil('tr:not(.tablesorter-childRow)').children('td').show();
		$('#planningTable .toggle .glyphicon-triangle-right').hide();
		$('#planningTable .toggle .glyphicon-triangle-bottom').show();
	},

	hideAllZone: function(){
		$('#planningTable .toggle').closest('tr').nextUntil('tr:not(.tablesorter-childRow)').children('td').hide();
		$('#planningTable .toggle .glyphicon-triangle-bottom').hide();
		$('#planningTable .toggle .glyphicon-triangle-right').show();
	}
};

/////////////////////////////////////////////////
/// EQUIPEMENTS /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.equipements = {
	title: 'Equipements',
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
				var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eventplanner.eqLogic.byId(eqId));
				eqModal.open();
			}
		});
		
		this.constructEqTable();
		
		$("#eqTable").bind("refreshEqTable", function(){
			eventplanner.ui.equipements.constructEqTable();
		});
	},

	constructEqTable: function(){
		$("#eqTable > tbody").loadTemplate($("#templateEqTable"), eventplanner.eqLogic.all(true));
		$('#eqTable').trigger('update');
	}
};

/////////////////////////////////////////////////
/// ZONES ///////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.zones ={
	title: 'Zones',
	init: function(){
		$('#zones').delegate('.editZoneBtn', 'click', function () {
			var zoneId = $(this).attr('data-zone-id');
			
			if(zoneId == 'new'){
				var currentEvent = eventplanner.event.byId(userProfils.eventId);
				var zoneData = {
					zoneId: '',
					zoneEventId: currentEvent.eventId,
					zoneLocalisation: currentEvent.eventLocalisation,
					zoneInstallDate: currentEvent.eventStartDate,
					zoneUuninstallDate: currentEvent.eventEndDate,
					zoneState: 200
				}
				
				var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(zoneData);
				zoneConfModal.open();
			}else{
				var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(eventplanner.zone.byId(zoneId));
					zoneConfModal.open();
			}
		});
	
		$("#zoneTable").bind("refreshZoneTable", function(){
			eventplanner.ui.zones.constructZoneTable();
		});
		
		this.constructZoneTable();
	},
	
	constructZoneTable: function(){
		$("#zoneTable > tbody").loadTemplate($("#templateZoneTable"), eventplanner.zone.all(true));
		$('#zoneTable').trigger('update');
	}
}


/////////////////////////////////////////////////
/// MISSION /////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.mission ={
	title: 'Missions',
	init: function(){
		$('#mission').delegate('.editMissionBtn', 'click', function () {
			var missionId = $(this).attr('data-mission-id');
			
			if(missionId == 'new'){
				var currentEvent = eventplanner.event.byId(userProfils.eventId);
				var missionData = {
					missionId: '',
					missionEventId: currentEvent.eventId,
					missionState: 400
				}
				
				var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(missionData);
				missionConfModal.open();
			}else{
				var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(eventplanner.mission.byId(missionId, true));
				missionConfModal.open();
			}
		});

		$('#mission').delegate('.editStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('missionId')], 'mission', $(this).data('missionState')); 
			stateModal.open();

			return false;
		});
	
		$("#missionTable").bind("refreshMissionTable", function(){
			eventplanner.ui.mission.constructMissionTable();
		});
		
		this.constructMissionTable();
	},
	
	constructMissionTable: function(){
		$("#missionTable > tbody").loadTemplate($("#templateMissionTable"), eventplanner.mission.all(true));
		$('#missionTable').trigger('update');
	}
}

/////////////////////////////////////////////////
/// SCAN ////////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.scan = {
	title: 'Scan',
	init: function(){
	  	
	}
};

/////////////////////////////////////////////////
/// EVENT INFOS///////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.eventinfos = {
	title: 'Infos événement',
	init: function(){
	  	
	}
};


/////////////////////////////////////////////////
/// USER INFOS///////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.userinfos = {
	title: 'Infos utilisateur',
	init: function(){
	  	
	}
};


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
	eventplanner.ui.modal.EpModal.call(this, _zone.zoneName, "zone");
	
	this.data = _zone;
	
	this.preShow = function(){
		this.constructMsgTable();
		this.constructEqTable();
		this.addTriggers();
	}

	this.postShow = function(){
		this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.zoneEventId, this.data.zoneLocalisation, 20);
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

		this.modal.find("#zone").bind("refreshZoneTable", this, function(event){
			//event.data.constructEqTable();
			// PROBLEME POUR NE RAFRAICHIR QUE LA DONNEE QUI VA BIEN...
			event.data.constructMsgTable();
		});

		this.modal.find('#zone').delegate('.editStateBtn', 'click', this, function (event) {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('zoneId')], 'zone', $(this).data('zoneState')); 
			stateModal.open();

			return false;
		});
		
		this.modal.find('.editMultipleStateBtn').on('click', function () {
			var eqList = [];
			var eqState = 0;

			$.each($(this).closest('#equipements').find('.editStateBtn'), function( index, eqStateBtn) {
			  eqList.push($(eqStateBtn).data('eqlogicId'));
			  if(eqState < $(eqStateBtn).data('eqlogicState')){
			  	eqState = $(eqStateBtn).data('eqlogicState');
			  }
			});
			
			var stateModal = new eventplanner.ui.modal.EpModalState(eqList, 'eq', eqState); 
			stateModal.open();

			return false;
		});
		
		this.modal.find('#equipements').delegate('.editStateBtn', 'click', this, function (event) {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('eqlogicId')], 'eq', $(this).data('eqlogicState')); 
			stateModal.open();

			return false;
		});
	}

	this.constructMsgTable = function(){
		this.modal.find("#zoneMsgTable tbody").loadTemplate($("#templateZoneMsgTable"), eventplanner.msg.byZoneId(this.data.zoneId));
	}

	this.constructEqTable = function(){
		this.modal.find("#zoneEqTable").loadTemplate($("#templateZoneEqTable"), eventplanner.eqLogic.byZoneId(this.data.zoneId, true));
	}

	this.constructEqMarkers = function(){
		var eqLogics = eventplanner.eqLogic.byZoneId(this.data.zoneId, true);

		eqLogics.forEach(function(eq){
			if(eq.eqLogicConfiguration.hasOwnProperty('hasLocalisation') && eq.eqLogicConfiguration.hasLocalisation){
				var eqMarker = eventplanner.ui.map.addEqMarkerOnMap(this.mapZone, eq);
				eqMarker.bindPopup('<div><b>' + eq.matTypeName + ' - ' + eq.eqRealName + '</b>');
			}
		}, this);
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


		this.modal.find("#eqLogicZoneId").loadTemplate($("#templateEqZoneOptions"), eventplanner.zone.all(true), {success: function(thisModal){
			return function() {
				thisModal.modal.find('#eqLogicZoneId option[value="' + thisModal.data.eqLogicZoneId + '"]').prop('selected', true);
			}
		}(this)});


		this.modal.find("#eqLogicMatTypeId").loadTemplate($("#templateEqMatTypeOptions"), eventplanner.matType.all(true), {success: function(thisModal){
			return function() {
				thisModal.modal.find('#eqLogicMatTypeId option[value="' + thisModal.data.eqLogicMatTypeId + '"]').prop('selected', true);
			}
		}(this)});
		
		this.constructAndSelectEqReal();
	}

	this.postShow = function(){
			this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.eqLogicEventId, this.data.eqLogicConfiguration.localisation);
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
									eventplanner.ui.checkNewMsg();
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

	  this.modal.find("#eqLogicEqRealId").loadTemplate($("#templateEqRealOptions"), eventplanner.eqReal.byMatTypeId($('#eqLogicMatTypeId option:selected').val()), {append: true});
	  this.modal.find('#eqLogicEqRealId option[value="' + this.data.eqLogicEqRealId + '"]').prop('selected', true);
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
					var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eventplanner.eqLogic.byId(eqId));
					eqModal.open();
				}
			});
			
			this.modal.find(".eqTable").bind("refreshEqTable", this, function(event){
				event.data.constructEqTable();
			});
		}
	
	this.postShow = function(){
			this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.zoneEventId, this.data.zoneLocalisation);
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
									eventplanner.ui.checkNewMsg();
									if(thisModal.data.zoneId==""){
										thisModal.data.zoneId=_data.zoneId;
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
		this.modal.find("#eqTableZone tbody").loadTemplate($("#templateZoneConfigurationEqTable"), eventplanner.eqLogic.byZoneId(this.data.zoneId, true));
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
			this.mapEvent = eventplanner.ui.map.initializeEventMap('mapEvent' + this.id, this.data.eventId, this.data.eventLocalisation, 14);
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
									eventplanner.ui.checkNewMsg();
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
									eventplanner.ui.checkNewMsg();
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

/// MODAL MISSION CONFIGURATION /////////////

eventplanner.ui.modal.EpModalMissionConfiguration = function(_mission){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'une mission", "missionConfiguration");
	
	this.data = _mission;
	
	this.preShow = function(){
		// Chargement de la liste des zones
		this.modal.find("#missionZoneSelect").loadTemplate($("#templateZoneOptions"), eventplanner.zone.all(), {
			success: function(thisModal){
				return function() {
					$.each(thisModal.data.missionZones, function(thisModal){
						return function(i,item){
							thisModal.modal.find('#missionZoneSelect option[value="' + item.zoneId + '"]').prop('selected', true);
						}
					}(thisModal));
				}
			}(this)});

		// Chargement de la liste des users
		this.modal.find("#missionUserSelect").loadTemplate($("#templateUserOptions"), eventplanner.user.all(), {
			success: function(thisModal){
				return function() {
					$.each(thisModal.data.missionUsers, function(thisModal){
						return function(i,item){
							thisModal.modal.find('#missionUserSelect option[value="' + item.userId + '"]').prop('selected', true);
						}
					}(thisModal));
				}
			}(this)});

		$.each(eventplanner.ui.STATE, function(thisModal){
				return function(i,item){
					if(i == "mission"){
						$.each(item.groups, function(thisModal){
							return function(j,group){
								thisModal.modal.find('#stateSelect').loadTemplate(thisModal.modal.find("#templateStateSelectOptgroup"), {id: j, text: group.text} ,{append: true});
							
								$.each(group.list, function(thisModal, groupId){
									return function(stateNbr, stateParam){
										thisModal.modal.find('optgroup[id=' + groupId + ']').loadTemplate(thisModal.modal.find("#templateStateSelectOptions"), {id: stateNbr, text: stateParam.text} ,{append: true});
									}
								}(thisModal, j));
							}
						}(thisModal));
					}
				}
			}(this));

		this.modal.find('#stateSelect option[value="' + this.data.missionState + '"]').prop('selected', true);
	}
	
	this.postShow = function(){
			this.modal.find('#missionForm').submit(this, function(event) {
			    var missionParam = {
			        id: $(this).find("#missionId").val(),
			        name: $(this).find("#missionName").val(),
			        comment: $(this).find("#missionComment").val(),
			        eventId: $(this).find("#missionEventId").val(),
			        state: $(this).find("#stateSelect").val(),
			        zones: [],
			        users: [],
			        configuration: {}
			    };

			    $(this).find("#missionZoneSelect option:selected" ).each(function() {
			      missionParam.zones.push(this.value);
			    });

			    $(this).find("#missionUserSelect option:selected" ).each(function() {
			      missionParam.users.push(this.value);
			    });
			   
			   	eventplanner.mission.save({
			      mission: missionParam,
			      success: function(thisModal){
								return function(_data) {
									eventplanner.ui.checkNewMsg();
							        thisModal.close();
									eventplanner.ui.notification('success', "Mission enregistrée.");	
								}
							}(event.data),
				  error: function(_data){
			        eventplanner.ui.notification('error', "Impossible d'enregistrer la mission. " + _data.message);
			      }			  
			    });
				
			    return false;
			});
			
		}
}

eventplanner.ui.modal.EpModalMissionConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalMissionConfiguration,
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
			this.data.matTypeOptions.forEach(function(option){
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
									eventplanner.ui.checkNewMsg();
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
					state: !!parseInt(this.data.userEnable),
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
									eventplanner.ui.checkNewMsg();
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

/// MODAL STATE ////////////////////////////////
eventplanner.ui.modal.EpModalState = function(_listId, _type, _presetState){
	eventplanner.ui.modal.EpModal.call(this, "Modifier l'état", "state");
	this.data = {};
	this.listId = _listId;
	this.type = _type;
	this.presetState = _presetState;

	this.preShow = function(){
			$.each(eventplanner.ui.STATE, function(thisModal){
				return function(i,item){
					if(i == thisModal.type){
						$.each(item.groups, function(thisModal){
							return function(j,group){
								thisModal.modal.find('#stateSelect').loadTemplate(thisModal.modal.find("#templateStateSelectOptgroup"), {id: j, text: group.text} ,{append: true});
							
								$.each(group.list, function(thisModal, groupId){
									return function(stateNbr, stateParam){
										thisModal.modal.find('optgroup[id=' + groupId + ']').loadTemplate(thisModal.modal.find("#templateStateSelectOptions"), {id: stateNbr, text: stateParam.text} ,{append: true});
									}
								}(thisModal, j));
							}
						}(thisModal));
					}
				}
			}(this));

			this.modal.find('#stateSelect option[value="' + this.presetState + '"]').prop('selected', true);
		}
	
	this.postShow = function(){
			this.modal.find('#stateForm').submit(this, function(event) {
				var newState = $(this).find("#stateSelect").val();

			    //console.log(event.data.type + ': ' + newState + ' sur ');
			    //console.log(event.data.listId);

			    switch(event.data.type){
			    	case 'eq':
			    		eventplanner.eqLogic.updateState({
							listId: event.data.listId,
							state: newState,
							success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Etat modifié.");	
										}
									}(event.data),
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de modifier l'état. " + _data.message);
							}	
							});
			    	break;

			    	case 'eqReal':
			    		eventplanner.eqReal.updateState({
							listId: event.data.listId,
							state: newState,
							success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Etat modifié.");	
										}
									}(event.data),
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de modifier l'état. " + _data.message);
							}	
							});
			    	break;

			    	case 'zone':
			    		eventplanner.zone.updateState({
							listId: event.data.listId,
							state: newState,
							success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Etat modifié.");	
										}
									}(event.data),
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de modifier l'état. " + _data.message);
							}	
							});
			    	break;

			    	case 'mission':
			    		eventplanner.mission.updateState({
							listId: event.data.listId,
							state: newState,
							success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Etat modifié.");	
										}
									}(event.data),
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de modifier l'état. " + _data.message);
							}	
							});
			    	break;
			    }
			    return false;
			});

		}
}

eventplanner.ui.modal.EpModalState.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalState,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
