eventplanner.ui = {
	onlineState: true,
	uiReady: $.Deferred(),
	currentUser: false,
	currentPage: 'dashboard',
	STATE: {},

  	init: function() {
  		this.uiReady = $.Deferred();
  		
  		eventplanner.private.default_params.error = function(_data){
  			eventplanner.ui.notification('error', _data.message);
  		}
  		// chargement des data, puis initialisation de l'interface
  		try{
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
  		}catch (e){
  			eventplanner.ui.notification('error', "Impossible d'initialiser l'interface.<br>" + e.message);
  		}
  		
  		// Gestion du multimodal: afficher le fond noir entre la dernière modal et l'avant dernière
  		$(document).on('show.bs.modal', '.modal', function () {
		    var zIndex = 1040 + (10 * $('.modal:visible').length);
		    $(this).css('z-index', zIndex);
		    setTimeout(function() {
		        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
		    }, 0);
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
			eventplanner.organisation.load(),
			eventplanner.discipline.load(),
			eventplanner.event.load(),
			eventplanner.plan.load(),
			eventplanner.eventLevel.load(),
			eventplanner.msg.load(),
			eventplanner.mission.load(),
			eventplanner.user.load(),
			eventplanner.zone.load(),
			eventplanner.eqLogic.load(),
			eventplanner.eqLink.load(),
			eventplanner.eqReal.load(),
			eventplanner.matType.load(),
			eventplanner.contact.load(),
			eventplanner.ui.initState()
		);
	},

	updateUI: function(_data){
		// Liste les types
		$.each(_data, function(_type, _ops){
			// Liste les opérations (add, update, del)
			for(var _op in _ops) {
				// Liste les ID
				_ops[_op].forEach(function(_id){
					if(_op == 'add'){
						$("." + _type + "Table").trigger("addItem", [_id, _type]);
					}else{
						$("." + _type + "Item[data-id=" + _id + "]").trigger(_op + "Item");
					}
				});
			}
		});
		
		// RAFRAICHISSEMENT DE MASSE
		if(_data.hasOwnProperty('event')){
			$(".eventTable").trigger("refreshEventTable");
		}

		if(_data.hasOwnProperty('user')){
			$(".userTable").trigger("refreshUserTable");
		}

		if(_data.hasOwnProperty('mission')){
			$(".missionTable").trigger("refreshMissionTable");
		}

		if(_data.hasOwnProperty('matType')){
			$(".matTypeTable").trigger("refreshMatTypeTable");
		}

		if(_data.hasOwnProperty('eqLink')){
			$(".eqLinkTable").trigger("refreshEqLinkTable");
		}
		
		if(_data.hasOwnProperty('eqLogic')){
			$(".eqLogicTable").trigger("refreshEqLogicTable");
		}

		if(_data.hasOwnProperty('plan')){
			$(".planTable").trigger("refreshPlanTable");
		}

		// RAFRAICHISSEMENT DE LA CARTE
		if(_data.hasOwnProperty('zone')){
			$("#map").trigger("refreshZone");
		}

		// RAFRAICHISSEMENT DU MOTEUR DE RECHERCHE
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
	
	setScreenContainerHeight: function (){
	    /*var h = $(window).height()
	    var p = $(".screenContainer").position()
	    if(p != undefined && p.hasOwnProperty('top')){
	    	$(".screenContainer").height(h-p.top);
	    }*/
	},

	initTrigger: function(){
		$(window).resize(this.setScreenContainerHeight);

		$("body").delegate('.msgForm', 'submit', function () {
			if($(this).find('.msgFormInput').val()==''){
			    return false;
			}

			var msgParam = {
				id: '',
				organisationId: eventplanner.ui.currentUser.getDiscipline().disciplineOrganisationId,
				disciplineId: eventplanner.ui.currentUser.userDisciplineId,
				eventId: eventplanner.ui.currentUser.userEventId,
				userId: eventplanner.ui.currentUser.userId,
				content: $(this).find('.msgFormInput').val(),
				data:{}
			}
			
			if($(this).data("zone-id")==undefined){
				msgParam.zoneId = null;
			}else{
				msgParam.zoneId = $(this).data("zone-id");
			}
			
			if($(this).data("eqlogic-id")==undefined){
				msgParam.eqId = null;
			}else{
				msgParam.eqId = $(this).data("eqlogic-id");
			}

			$(this).find('.msgFormInput').val("");
			
		    eventplanner.msg.save({
		      msg: msgParam,
		      success: function(){
		        eventplanner.ui.checkNewMsg();
		        eventplanner.ui.notification('success', "Message enregistré.");
		      },
		      error: function(_data){
		        eventplanner.ui.notification('error', "Impossible d'enregistrer le message.<br>" + _data.message);
		      }
		    });
		    
			return false;
		});

		// MENU
		/*
		$( ".epNavBtn" )
		  .mouseenter(function() {
		    $( this ).find( ".epNavTitle" ).show();
		  })
		  .mouseleave(function() {
		    $( this ).find( ".epNavTitle" ).hide();
		  });
		*/
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

	checkNewMsgReady: $.Deferred(),
	checkNewMsg: function(){
		eventplanner.ui.checkNewMsgReady = $.Deferred();
		eventplanner.msg.getLastMsg({
		    success: function(_data, _date) {
		    	eventplanner.ui.checkNewMsgReady.resolve();
		    	if(!eventplanner.ui.onlineState){
            		eventplanner.ui.onlineState = true;
            		$('#epNavBar').removeClass('navbar-inverse').addClass('navbar-default');
                	eventplanner.ui.notification('success', "Connexion avec le serveur OK.");
            	}
			},
			error: function(_data){
				eventplanner.ui.checkNewMsgReady.resolve();
		        if(eventplanner.ui.onlineState){
            		eventplanner.ui.onlineState = false;
                	$('#epNavBar').removeClass('navbar-default').addClass('navbar-inverse');
                	eventplanner.ui.notification('error', "Perte de la connexion avec le serveur.");
            	}
		    }
		});
		return eventplanner.ui.checkNewMsgReady;
	},

	serverListener: function (){
		nbActiveAjaxRequest = 0;
		/*
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
		*/
		
		setInterval(function(){ 
			eventplanner.ui.checkNewMsg();
		}, 5000);
	},

	configEventMenu: function() {
		if(eventplanner.ui.currentUser.userEventId != null){
			var currentEvent = eventplanner.ui.currentUser.getEvent();

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

	loadPage: function(_page, _option = {}){
		$(".navbar-collapse").collapse("hide");
		
		$('#pageContainer').empty();
		$('#loadingContainer').show();

		this.pageContainer.load("desktop/php/" + _page + ".php", function(){
			eventplanner.ui[_page].init(_option);
			eventplanner.ui.setScreenContainerHeight();
			$('#loadingContainer').hide();
		});

		if(_page != 'dashboard'){
			history.pushState(null, _page + ' - eventPlanner', "index.php?p=" + _page);
		}else{
			history.pushState(null, _page + ' - eventPlanner', "index.php");
		}
		
		eventplanner.ui.currentPage = _page;
		localStorage.setItem('lastPage', _page);
		
		document.title = eventplanner.ui[_page].title + ' - eventPlanner';

		if(_page == 'map'){
			$('.mapModeMenu').show();
		}else{
			$('.mapModeMenu').hide();
		}

		$(".epNavBtn").removeClass('active');
		$(".epNavBtn [data-link=" + _page + "]").closest(".epNavBtn").addClass('active');
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
		var _eqLogicsData = eventplanner.eqLogic.all();

		_eqLogicsData.forEach(function(_eqLogicData){
			var title = '';
			if(_eqLogicData.getEqReal()){
				title = _eqLogicData.getMatType().matTypeName + ' ' + _eqLogicData.getEqReal().eqRealName;
			}else{
				title = _eqLogicData.getMatType().matTypeName;
			}
			
			var eqLogicAttr = '';
			_eqLogicData.getEqLogicAttributes().forEach(function(_attrData){
				if(_attrData.eqLogicAttributeViewOnPlanning == '1'){
					eqLogicAttr += '<br>' + _attrData.getMatTypeAttribute().matTypeAttributeName + ':' + _attrData.eqLogicAttributeValue;
				}
			});
			
			var eqData = {
	    		title: title,
	    		type: 'Equipement',
	    		id: _eqLogicData.eqLogicId,
	    		content: 'Zone: ' +  _eqLogicData.getZone().zoneName + '<br>Etat: ' + formatState(_eqLogicData.eqLogicState) + eqLogicAttr
	    	};
	    	
    		eventplanner.ui.search.data.push(eqData);
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
		    		if(item.type=="Zone"){
						var zone = eventplanner.zone.byId(item.id);
						var zoneModal = new eventplanner.ui.modal.EpModalZone(zone);
					}
					
					if(item.type=="Equipement"){
						var eqLogic = eventplanner.eqLogic.byId(item.id);
						var zone = eventplanner.zone.byId(eqLogic.eqLogicZoneId);
						
						var zoneModal = new eventplanner.ui.modal.EpModalZone(zone, eqLogic.eqLogicId);
					}
					
		    		zoneModal.open();
		    	},
		    	onClickAfter: function (node, a, item, event) {
		    		node.val("");
		    		node.blur();
		    	},
		    	onMouseEnter: function (node, a, item, event) {
		    		if(item.type=="Zone"){
						var zone = eventplanner.zone.byId(item.id);
					}
					
					if(item.type=="Equipement"){
						var eqLogic = eventplanner.eqLogic.byId(item.id);
						var zone = eventplanner.zone.byId(eqLogic.eqLogicZoneId);
					}
					
					eventplanner.ui.map.llMap.flyTo(zone.zoneLocalisation, 20);
		    	},
		    	onShowLayout:function (node) {
				    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
				    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
				    
				    if(eventplanner.ui.currentPage == 'map'){
				    	eventplanner.ui.map.lastBounds = eventplanner.ui.map.llMap.getBounds();
				    	eventplanner.ui.map.lastZoom = eventplanner.ui.map.llMap.getZoom();
				    }
				  },
		    	onHideLayout:function (node) {
				    $(".navbar-collapse.in").css("max-height", "");
				    $(".navbar-collapse.in").css("height", "");
				    
				    if(eventplanner.ui.currentPage == 'map'){
				    	eventplanner.ui.map.llMap.fitBounds(eventplanner.ui.map.lastBounds);
				    	eventplanner.ui.map.llMap.setZoom(eventplanner.ui.map.lastZoom);
				    }
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
		$('#dashboard').delegate('.selectEventBtn', 'click', function (event) {
			if($(this).attr('data-event-id') != eventplanner.ui.currentUser.userEventId){
				var eventSelected = eventplanner.event.byId($(this).attr('data-event-id'));
				
				var newUser = eventplanner.ui.currentUser.clone();
				
				newUser.userEventId = eventSelected.eventId;
				newUser.userEventLevelId = eventSelected.eventDefaultEventLevelId;
			    				
				try{
					newUser.save({
						success: function(_data) {
								eventplanner.ui.currentUser = new eventplanner.user.userItem(_data);
								eventplanner.ui.notification('success', "Changement enregistré.");
								$.when(eventplanner.ui.init()).then(function(){
									eventplanner.ui.loadPage('map');
								});
							},
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer la modification.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
			}else{
				eventplanner.ui.loadPage('map');
			}

			event.preventDefault();
			return false;
		});

		$('#dashboard').delegate('.selectMissionBtn', 'click', function (event) {
			var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(eventplanner.mission.byId($(this).attr('data-mission-id')));
				missionConfModal.open();

			event.preventDefault();
			return false;
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
		$("#missionList").loadTemplate($("#templateMissionList"), eventplanner.mission.byUserIdMaxState(eventplanner.ui.currentUser.userId ,498, true));
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
	}
};

/////////////////////////////////////////////////
/// INVENTAIRE  /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.inventaire ={
	title: 'Inventaire',
	init: function(){
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
			    },
			    sortList: [[0,0],[1,0],[2,0]]
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
				try{
					var eqRealItem = new eventplanner.eqReal.eqRealItem({
				   		eqRealDisciplineId: eventplanner.ui.currentUser.userDisciplineId
					});
				}catch (e) {
					eventplanner.ui.notification('error', "Impossible de créer le matériel.<br>" + e.message);
				}
				
				if(eqRealItem != undefined){
					var eqRealModal = new eventplanner.ui.modal.EpModalEqRealConfiguration(eqRealItem);
					eqRealModal.open();
				}
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

		$('#eqRealTable').delegate('.deleteEqRealBtn', 'click', function (event) {
			var eqReal = eventplanner.eqReal.byId($(this).attr('data-eqReal-id'));
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression du matériel " + eqReal.eqRealName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		eqReal.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Matériel supprimé! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer le matériel.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});			

			event.preventDefault();
			return false;
		});

		$("#eqRealTable").bind("addItem", function(event, _eqRealId){
			var newItem = $('<div>').loadTemplate($("#templateEqRealTable"), eventplanner.eqReal.byId(_eqRealId, true));
			$(this).find('tbody').append($(newItem).contents());

			$('#eqRealTable').trigger('update');
		});

		$("#eqRealTable").delegate(".eqRealItem", "updateItem", function(){
			var eqRealId = $(this).attr('data-id');
			var newItem = $('<div>').loadTemplate($("#templateEqRealTable"), eventplanner.eqReal.byId(eqRealId, true));
			$(this).replaceWith($(newItem).contents());

			$('#eqRealTable').trigger('update');
		});

		$("#eqRealTable").delegate(".eqRealItem", "removeItem", function(){
			$(this).remove();
			$('#eqRealTable').trigger('update');
		});

		this.constructEqRealTable();
	},

	constructEqRealTable: function(){
		$("#eqRealTable > tbody").loadTemplate($("#templateEqRealTable"), eventplanner.eqReal.all(true));
		$('#eqRealTable').trigger('update');
	}
};

/////////////////////////////////////////////////
/// Type de matériel ////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.mattype = {
	title: 'Types de matériels',
	init: function(){
		this.constructMatTypeTable();

		$('#matTypeTable').delegate('.deleteMatTypeBtn', 'click', function (event) {
			var matType = eventplanner.matType.byId($(this).attr('data-matType-id'));
			bootbox.confirm({
			    message: "Attention, cela va supprimer l'ensemble des attributs liés à ce type et déprogrammer les équipements ainsi que les matériels qui utilisent ce type.<br><br><strong>Confirmer la suppression du type " + matType.matTypeName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		matType.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Type de matériel supprimé! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer le type de matériel.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});

			event.preventDefault();
			return false;
		});

		$("#matTypeTable").bind("refreshMatTypeTable", function(thisModal){
			return function(){
				thisModal.constructMatTypeTable();
			}	
		}(this));

		$('#mattype').delegate('.editMatTypeBtn', 'click', function () {
			var matTypeId = $(this).attr('data-matType-id');
			
			if(matTypeId == 'new'){
				try {
				   	var matTypeItem = new eventplanner.matType.matTypeItem({
				   		matTypeDisciplineId: eventplanner.ui.currentUser.userDisciplineId
				   	});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer le type de matériel.<br>" + e.message);
				}
				
				if(matTypeItem != undefined){
					var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(matTypeItem);
					matTypeModal.open();
				}
			}else{
				var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(eventplanner.matType.byId(matTypeId));
				matTypeModal.open();
			}
		});

	},

	constructMatTypeTable: function(){		
		var matTypeList = eventplanner.matType.all();
		var matTypeByParentId = {};

		// On commence par construire une liste selon l'objet parent
		matTypeList.forEach(function(matType){
			if(matType.matTypeParentId == null){
				var parentId = 0;
			}else{
				var parentId = matType.matTypeParentId;
			}

			if(!is_array(matTypeByParentId[parentId])){
				matTypeByParentId[parentId] = [];
			}
			matTypeByParentId[parentId].push(matType);
		});

		// Fonction qui va construire un noeud et ses fils selons on ID de manière itérative
		var constructNodes = function(id){
			var nodes = [];

			if(matTypeByParentId[id] != undefined){
				matTypeByParentId[id].forEach(function(matType){
					var node = {
							text: matType.matTypeName + '<button type="button" class="btn btn-danger btn-xs deleteMatTypeBtn pull-right" data-matType-id="' + matType.matTypeId + '" title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>',
							matType: matType,
							selectable: true
						}
					var childs = constructNodes(matType.matTypeId);

					// Si le noeud à des enfants
					if(childs.length > 0){
						node.nodes = childs;
					}

					nodes.push(node);
				});
			}

			return nodes;
		}

		// On construire l'arbre depuis la base: 0 (= null --> sans parent)
		var matTypeTree = constructNodes(0);

		$('#matTypeTable').treeview({
			data: matTypeTree,
			levels: 1,
			onNodeSelected: function(event, data) {
				$('#matTypeTable').treeview('unselectNode', [data.nodeId, { silent: true } ]);
		    	var matTypeModal = new eventplanner.ui.modal.EpModalMatTypeConfiguration(data.matType);
				matTypeModal.open();
		  	}
		});

	},
}


/////////////////////////////////////////////////
/// USERS       /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.users = {
	title: 'Utilisateurs',
	init: function(){
		$("#userTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "zebra"],
			    sortList: [[0,0]]
			});

		this.constructUserTable();

		$('#userTable').delegate('.deleteUserBtn', 'click', function (event) {
			var user = eventplanner.user.byId($(this).attr('data-user-id'));
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression de l'utilisateur " + user.userName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		user.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Utilisateur supprimé! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer l'utilisateur.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});

			event.preventDefault();
			return false;
		});

		$("#userTable").bind("addItem", function(event, _userId){
			var newItem = $('<div>').loadTemplate($("#templateUserTable"), eventplanner.user.byId(_userId, true));
			$(this).find('tbody').append($(newItem).contents());

			$('#userTable').trigger('update');
		});

		$("#userTable").delegate(".userItem", "updateItem", function(){
			var userId = $(this).attr('data-id');
			var newItem = $('<div>').loadTemplate($("#templateUserTable"), eventplanner.user.byId(userId, true));
			$(this).replaceWith($(newItem).contents());

			$('#userTable').trigger('update');
		});

		$("#userTable").delegate(".userItem", "removeItem", function(){
			$(this).remove();
			$('#userTable').trigger('update');
		});

		$('#users').delegate('.editUserBtn', 'click', function () {
			var userId = $(this).attr('data-user-id');
			
			if(userId == 'new'){
				try {
				   	var userItem = new eventplanner.user.userItem({
				   		userDisciplineId: eventplanner.ui.currentUser.userDisciplineId
				   	});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer l'utilisateur.<br>" + e.message);
				}
				
				if(userItem != undefined){
					var userModal = new eventplanner.ui.modal.EpModalUserConfiguration(userItem);
					userModal.open();
				}
			}else{
				var userModal = new eventplanner.ui.modal.EpModalUserConfiguration(eventplanner.user.byId(userId));	
				userModal.open();
			}
		});
	},

	constructUserTable: function(){
		$("#userTable > tbody").loadTemplate($("#templateUserTable"), eventplanner.user.all());
		$('#userTable').trigger('update');
	}
}


/////////////////////////////////////////////////
/// EVENEMENTS /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.events = {
	title: 'Evenements',
	init: function(){
		$("#eventTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "zebra"],
			    sortList: [[2,1]]
			});

		this.constructEventTable();

		$('#eventTable').delegate('.deleteEventBtn', 'click', function (e) {
			var event = eventplanner.event.byId($(this).attr('data-event-id'));
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression de l'événement " + event.eventName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		event.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Evenement supprimé! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer l'événement.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});

			e.preventDefault();
			return false;
		});

		$("#eventTable").bind("addItem", function(event, _eventId){
			var newItem = $('<div>').loadTemplate($("#templateEventTable"), eventplanner.event.byId(_eventId, true));
			$(this).find('tbody').append($(newItem).contents());

			$('#eventTable').trigger('update');
		});

		$("#eventTable").delegate(".eventItem", "updateItem", function(){
			var eventId = $(this).attr('data-id');
			var newItem = $('<div>').loadTemplate($("#templateEventTable"), eventplanner.event.byId(eventId, true));
			$(this).replaceWith($(newItem).contents());

			$('#eventTable').trigger('update');
		});

		$("#eventTable").delegate(".eventItem", "removeItem", function(){
			$(this).remove();
			$('#eventTable').trigger('update');
		});

		$('#events').delegate('.selectEventBtn', 'click', function () {
			if($(this).attr('data-event-id') != eventplanner.ui.currentUser.userEventId){
				var eventSelected = eventplanner.event.byId($(this).attr('data-event-id'));
				var newUser = eventplanner.ui.currentUser.clone();
				
				newUser.userEventId = eventSelected.eventId;
				newUser.userEventLevelId = eventSelected.eventDefaultEventLevelId;
			    				
				try{
					newUser.save({
						success: function(_data) {
								eventplanner.ui.currentUser = new eventplanner.user.userItem(_data);
								eventplanner.ui.notification('success', "Changement enregistré.");
								$.when(eventplanner.ui.init()).then(function(){
									//eventplanner.ui.loadPage('map');
								});
							},
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer la modification.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
			}
		});

		$('#events').delegate('.editEventBtn', 'click', function () {
			var eventId = $(this).attr('data-event-id');
			
			if(eventId == 'new'){
				try {
				   	var eventItem = new eventplanner.event.eventItem({
				   		eventOrganisationId: eventplanner.ui.currentUser.getDiscipline().getOrganisation().organisationId,
				   	});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer l'événement.<br>" + e.message);
				}
				
				if(eventItem != undefined){
					var eventModal = new eventplanner.ui.modal.EpModalEventConfiguration(eventItem);
					eventModal.open();
				}
			}else{
				var eventModal = new eventplanner.ui.modal.EpModalEventConfiguration(eventplanner.event.byId(eventId));
				eventModal.open();	
			}
		});
	},

	constructEventTable: function(){
		$("#eventTable > tbody").loadTemplate($("#templateEventTable"), eventplanner.event.all());
		$('#eventTable').trigger('update');
	}
}

/////////////////////////////////////////////////
/// PLANS ///////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.plans = {
	title: 'Plans',
	init: function(){
		$("#planTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "zebra"],
			    sortList: [[0,0]]
			});

		this.constructPlanTable();

		$("#planTable").bind("refreshPlanTable", function(thisModal){
			return function(){
				thisModal.constructPlanTable();
			}	
		}(this));

		$('#plans').delegate('.editPlanBtn', 'click', function () {
			var planId = $(this).attr('data-plan-id');
			
			if(planId == 'new'){
				try {
				   	var planItem = new eventplanner.plan.planItem({
				   		planOrganisationId: eventplanner.ui.currentUser.getDiscipline().disciplineOrganisationId,
				   	});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer le plan.<br>" + e.message);
				}
				
				if(planItem != undefined){
					var planModal = new eventplanner.ui.modal.EpModalPlanConfiguration(planItem);
					planModal.open();
				}
			}else{
				var planModal = new eventplanner.ui.modal.EpModalPlanConfiguration(eventplanner.plan.byId(planId));
				planModal.open();
			}
		});

		
	},

	constructPlanTable: function(){
		$("#planTable > tbody").loadTemplate($("#templatePlanTable"), eventplanner.plan.all());
		$('#planTable').trigger('update');
	}
}

/////////////////////////////////////////////////
/// Disciplines /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.disciplines = {
	title: 'Discplines',
	init: function(){
		$("#disciplineTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : [ "uitheme", "zebra"],
			    sortList: [[0,0]]
			});

		this.constructDisciplineTable();

		$("#disciplineTable").bind("refreshDisciplineTable", function(thisModal){
			return function(){
				thisModal.constructDisciplineTable();
			}	
		}(this));

		
	},

	constructDisciplineTable: function(){
		$("#disciplineTable > tbody").loadTemplate($("#templateDisciplineTable"), eventplanner.discipline.all());
		$('#disciplineTable').trigger('update');
	}
}

/////////////////////////////////////////////////
/// MAP /////////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.map = {
	title: 'Carte',
	llMap: {},
	zonesMarkers: {},
	eqLinkLayer: L.layerGroup(),
	stateToShow: {min: 0, max: 999},
	currentMode: 'global',
	
	init: function(){
		var currentEvent = eventplanner.ui.currentUser.getEvent();
		
		this.llMap = this.initializeEventMap("map", currentEvent.eventId, currentEvent.eventLocalisation);
	    this.llMap.contextmenu.addItem({
	        text: 'Ajouter une zone',
	        callback: function(e) {
		      	var currentEvent = eventplanner.ui.currentUser.getEvent();
				
				try {
				   	var zoneItem = new eventplanner.zone.zoneItem({
				   		zoneEventLevelId: currentEvent.eventDefaultEventLevelId,
						zoneEventId: currentEvent.eventId,
						zoneLocalisation: e.latlng,
						zoneInstallDate: currentEvent.eventStartDate,
						zoneUninstallDate: currentEvent.eventEndDate,
					});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer la zone.<br>" + e.message);
				}
				
				if(zoneItem != undefined){
					var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(zoneItem);
					zoneConfModal.open();
				}
		    }
	    });
	    
	    // BOUTON DE CHANGEMENT DE MODE (Visible qu'en mode mobile)
	    this.stateChangingButton = L.easyButton({
		    states: [{
		            stateName: 'global',
		            icon:      'glyphicon-record',
		            title:     'Global', 
		            onClick: function(btn, map) {
		                eventplanner.ui.map.setMode('montage');
		            }
		        }, {
		            stateName: 'montage',
		            icon:      'glyphicon-arrow-down',
		            title:     'Montage', 
		            onClick: function(btn, map) {
		                eventplanner.ui.map.setMode('demontage');
		            }
		        }, {
		            stateName: 'demontage',
		            icon:      'glyphicon-arrow-up',
		            title:     'Démontage', 
		            onClick: function(btn, map) {
		                eventplanner.ui.map.setMode('global');
		            }
		        }]
		});
		this.stateChangingButton.addTo(this.llMap);
		$('.easy-button-container').addClass('visible-xs');
		this.setMode(this.currentMode);
		
		// BOUTON DE LOCALISATION
		L.control.locate().addTo(this.llMap);

		$('.mapModeMenuBtn').click(function(event){
			var mode = $(this).attr('data-mapmode');

			eventplanner.ui.map.setMode(mode);
		});
		
		this.zonesMarkers = {};
		this.refreshZoneMarker();
		$('#map').bind("refreshZone", this, function(event){
			eventplanner.ui.map.refreshZoneMarker();
		});

		this.eqLinkLayer.addTo(this.llMap);
		this.addEqLinksLinesOnMap();

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

	setMode: function(mode){
		$('.mapModeMenuLabel').html($('.mapModeMenuBtn[data-mapmode=' + mode + ']').html());
		this.stateChangingButton.state(mode);
		this.currentMode = mode;
		
		switch(mode){
			case "global":
				eventplanner.ui.map.stateToShow = {min: 0, max:299};
			break;

			case "montage":
				eventplanner.ui.map.stateToShow = {min: 0, max:219};
			break;

			case "demontage":
				eventplanner.ui.map.stateToShow = {min: 220, max:299};
			break;
		}

		eventplanner.ui.map.refreshZoneMarker();
		
	},

	initialiseMap: function (mapContainer, locationCenter, zoom){
		zoom = typeof zoom !== 'undefined' ? zoom : 18;

		baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		  maxZoom: 19,
		  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
		});

		map = L.map(mapContainer, {
			zoom: zoom,
			maxZoom: 21,
			center: locationCenter,
			layers: [baseLayer],
			zoomControl: false,
			attributionControl: false,
			contextmenu: true
		});
		map.options.singleClickTimeout = 250;
		
		setTimeout(function(){
			map.invalidateSize();
		}, 500);

		return map;
	},

	initializeEventMap: function(mapContainer, eventId, locationCenter, zoom){
		map = this.initialiseMap(mapContainer, locationCenter, zoom);
		
		eventplanner.eventLevel.all().forEach(function(item){
			map.addLayer(L.tileLayer.fallback('./ressources/eventPlan/' + item.eventLevelPlanId + '/tiles/{z}/{x}/{y}.png', {
			      minZoom: 14,
			      maxZoom: 21,
			      tms: false
			  }));
		});

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
				eq.eqLogicLocalisation, 
				{
					draggable:dragable, 
					title: eq.eqLogicName, 
					icon: eventplanner.ui.map.getIconFromType('eqLogic')
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
	
	addEqLinksLinesOnMap: function(map){
		this.eqLinkLayer.clearLayers();

		eventplanner.eqLink.all().forEach(function(eqLink){
			eventplanner.ui.map.eqLinkLayer.addLayer(L.polyline(eqLink.getPointsLocalisation(), {opacity: 0.2, weight: 2, }));
		});
	},
	
	refreshZoneMarker: function(){
		var zones = eventplanner.zone.all();
		zones.forEach(function(zone) {
				if(eventplanner.ui.map.zonesMarkers.hasOwnProperty(zone.zoneId)){
				  	var zoneMarker = eventplanner.ui.map.zonesMarkers[zone.zoneId];
				  	
				  	zoneMarker.setLatLng(zone.zoneLocalisation);
				}else{
					var zoneMarker = eventplanner.ui.map.addZoneMarkerOnMap(this, zone);
					eventplanner.ui.map.zonesMarkers[zone.zoneId] = zoneMarker;
					
					zoneMarker.on({
					    click: function (e) {
					    	var zoneModal = new eventplanner.ui.modal.EpModalZone(eventplanner.zone.byId(this.zoneId, true));
							zoneModal.open();
					    }
					});
					
					zoneMarker.bindContextMenu({
						contextmenu: true,
						contextmenuInheritItems: false,
						contextmenuItems: [
							{
						        text: 'Changer l\'état',
						        callback: function(e) {
							      	var currentZone = eventplanner.zone.byId(e.relatedTarget.zoneId);
							      	var stateModal = new eventplanner.ui.modal.EpModalState([currentZone.zoneId], 'zone', currentZone.zoneState); 
								  	stateModal.open();
							    }
						    },{
						        text: 'Créer une mission',
						        callback: function(e) {
						        	try {
										var missionItem = new eventplanner.mission.missionItem({
											missionDisciplineId: eventplanner.ui.currentUser.userDisciplineId,
											missionEventId: eventplanner.ui.currentUser.userEventId,
											missionZones: [e.relatedTarget.zoneId.toString()],
										});
									}
									catch (e) {
									   eventplanner.ui.notification('error', "Impossible de créer la mission.<br>" + e.message);
									}
									
									if(missionItem != undefined){
										var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(missionItem);							      
										missionConfModal.open();
									}
							    }
						    },  {
						        text: 'Configurer',
						        callback: function(e) {
						        	var currentZone = eventplanner.zone.byId(e.relatedTarget.zoneId);
							      	var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(currentZone);
									zoneConfModal.open();
							    }
						    }]
				    	});
				}
				
				// Mise à jour de l'état
			  	if(zone.zoneState >= eventplanner.ui.map.stateToShow.min && zone.zoneState <= eventplanner.ui.map.stateToShow.max){
				  	zoneMarker.setIcon(eventplanner.ui.map.getIconFromState(zone.zoneState));
				}else{
				  	zoneMarker.setIcon(eventplanner.ui.map.getIconFromState('default'));
				}
			}, this.llMap);
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
	currentPage: 1,
	resultsPerPage: 20,

	init: function(){
		this.currentPage = 1;

		$('#maincourante .previous').click(this, function (event) {
			event.data.currentPage--;
			if(event.data.currentPage < 1){
				event.data.currentPage = 1;
			}
			event.data.constructMsgTable();
			return false;
		});

		$('#maincourante .next').click(this, function (event) {
			
			if (event.data.currentPage * event.data.resultsPerPage < eventplanner.msg.all().length) {
				event.data.currentPage++;
				event.data.constructMsgTable();
			}
			
			return false;
		});

		$("#msgTable").bind("addItem", function(event, _msgId){
			eventplanner.ui.maincourante.constructMsgTable();
		});

		$('#searchMsgInput')
			.keyup(this, debounce(function (event) {
				eventplanner.ui.maincourante.constructMsgTable(true);

				if($(this).val().length < 2){
					$(this).parent().removeClass('has-error');
				}else{
					$(this).parent().addClass('has-error');
				}
			}, 500))
			.closest('form').submit(function (event) {
				event.preventDefault();
				return false;
			});

		$('#searchMsgClear').click(function(){
			$('#searchMsgInput')
				.val('')
				.parent().removeClass('has-error');

			eventplanner.ui.maincourante.constructMsgTable(true);
		});

		this.constructMsgTable();
	},

	constructMsgTable: function(_searchKey = false){
		var searchVal = $('#searchMsgInput').val();
		if(searchVal.length >= 2){
			if(_searchKey){
				this.currentPage = 1;
			}
			var msgList = eventplanner.msg.searchAll(searchVal);
		}else{
			var msgList = eventplanner.msg.all(true);
		}

		if (this.currentPage <= 1) {
            $('#maincourante .previous').attr('disabled','disabled');
        } else {
            $('#maincourante .previous').prop("disabled", false);
        }

        if (this.currentPage * this.resultsPerPage > msgList.length) {
            $('#maincourante .next').attr('disabled','disabled');
        } else {
            $('#maincourante .next').prop("disabled", false);
        }

		$("#msgTable").loadTemplate(
			$("#templateMsgTable"), 
			msgList, 
			{
				paged: true, 
				pageNo: this.currentPage, 
				elemPerPage: this.resultsPerPage
			});
	},
};

/////////////////////////////////////////////////
/// PLANNING ///////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.planning = {
	title: 'Planning',
	sortBy: 'zoneInstallDate',
	sortOrder: 'asc',
	zoneEqListSelector: {},

	init: function(){
		$('#planning .showAllZone').click(this, function (event) {
			event.data.showAllZone();
			return false;
		});

		$('#planning .hideAllZone').click(this, function (event) {
			event.data.hideAllZone();
			return false;
		});
		
		$('.planningSortBy').click(this, function (event) {
			event.data.sortBy = $(this).attr('data-sortby');
			event.data.sortOrder = $(this).attr('data-sortorder');
			event.data.sortPlanning();
			event.preventDefault();
		});
		
		$('#planningSearch').keyup(this, debounce(function (event) {
			eventplanner.ui.planning.searchVal($(this).val());
		}, 500));

		$('#planningSearchClear').click(function(){
			$('#planningSearch')
				.val('')
				.parent().removeClass('has-error');
				
			eventplanner.ui.planning.searchVal('');
		});

		$('#planning').delegate('.editZoneBtn', 'click', function () {
			var zoneId = $(this).attr('data-zone-id');
			
			if(zoneId == 'new'){
				var currentEvent = eventplanner.ui.currentUser.getEvent();
				
				try {
				   	var zoneItem = new eventplanner.zone.zoneItem({
				   		zoneEventLevelId: currentEvent.eventDefaultEventLevelId,
						zoneEventId: currentEvent.eventId,
						zoneLocalisation: currentEvent.eventLocalisation,
						zoneInstallDate: currentEvent.eventStartDate,
						zoneUninstallDate: currentEvent.eventEndDate,
					});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer la zone.<br>" + e.message);
				}
				
				if(zoneItem != undefined){
					var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(zoneItem);
					zoneConfModal.open();
				}
			}else{
				var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(eventplanner.zone.byId(zoneId));
					zoneConfModal.open();
			}
		});
		
		$('#planning').delegate('.editEqBtn', 'click', function () {
			var eqId = $(this).attr('data-eqlogic-id');
			
			if(eqId == 'new'){
				try {
				   	var eqLogicItem = new eventplanner.eqLogic.eqLogicItem({
				   		eqLogicDisciplineId: eventplanner.ui.currentUser.userDisciplineId,
						eqLogicEventId: eventplanner.ui.currentUser.userEventId
					});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer l'équipement.<br>" + e.message);
				}
				
				if(eqLogicItem != undefined){
					var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eqLogicItem);
					eqModal.open();
				}
			}else{
				var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eventplanner.eqLogic.byId(eqId));
				eqModal.open();
			}
		});
		
		$('#planning').delegate('.editMultipleStateBtn', 'click', function () {
			var eqList = [];
			var eqState = 0;

			$.each($('#planningTable .planningEqCb:checked'), function( index, eqCb) {
			  eqList.push($(eqCb).data('eqlogicId'));
			  if(eqState < $(eqCb).data('eqlogicState')){
			  	eqState = $(eqCb).data('eqlogicState');
			  }
			});

			var stateModal = new eventplanner.ui.modal.EpModalState(eqList, 'eqLogic', eqState); 
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
		
		$('#planning').delegate('.addMissionBtn', 'click', function () {
			var zoneList = [];

			$.each($('#planningTable .planningZoneCb:checked'), function( index, zoneCb) {
			  zoneList.push($(zoneCb).data('zoneId'));
			});

			try {
			   	var missionItem = new eventplanner.mission.missionItem({
			   		missionDisciplineId: eventplanner.ui.currentUser.userDisciplineId,
					missionEventId: eventplanner.ui.currentUser.userEventId,
					missionZones: zoneList,
				});
			}
			catch (e) {
			   eventplanner.ui.notification('error', "Impossible de créer la mission.<br>" + e.message);
			}
			
			if(missionItem != undefined){
				var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(missionItem);
				missionConfModal.open();
			}
			
			return false;
		});

		$('#planning').delegate('.editStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('eqlogicId')], 'eqLogic', $(this).data('eqlogicState')); 
			stateModal.open();

			return false;
		});

		$('#planning').delegate('.editZoneStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('zoneId')], 'zone', $(this).data('zoneState')); 
			stateModal.open();

			return false;
		});
		
		$('#planning').delegate('.zoneBtn', 'click', function () {
			var zoneModal = new eventplanner.ui.modal.EpModalZone(eventplanner.zone.byId($(this).data('zoneId')));
			zoneModal.open();

			return false;
		});
		
		$('#planning').delegate('.eqLogicModalLink', 'click', function () {
			var zone = eventplanner.zone.byId($(this).closest('.zoneItem').attr('data-id'));
			var eqLogicId = $(this).closest('.eqLogicItem').attr('data-id');
			
			var zoneModal = new eventplanner.ui.modal.EpModalZone(zone, eqLogicId);
			zoneModal.open();
						
			return false;
		});
		
		

		$('#planningTable').delegate( '.planningZoneCb', 'change' ,function(event) {
			var zoneId = $(this).data('zone-id');
			
			// Récupération de la liste des cb visibles
			var eqCb = $('#planningTable .planningEqCb[data-zone-id=' + zoneId + ']').not('.cbSearchHidden');
			
			// On leur attribut la même valeur que la Cb de la zone
			eqCb.prop('checked', $(this).prop('checked'));
			
			// On active le btn bootstrap ou pas
			if($(this).prop('checked')){
				eqCb.closest('label').addClass('active');
			}else{
				eqCb.closest('label').removeClass('active');
			}
		});
		
		// TRIGGER ADDITEM
		$("#planningTable").bind("addItem", function(event, _id, _type){
			if(_type == 'eqLogic'){
				var _eqData = eventplanner.eqLogic.byId(_id, true);
				eventplanner.ui.planning.zoneEqListSelector[_eqData.zoneId].loadTemplate(
					$("#templatePlanningTableEq"), 
					_eqData, 
					{append: true}
					);
			}
			if(_type == 'zone'){
				eventplanner.ui.planning.zoneEqListSelector[_id] = $('<div>').loadTemplate($("#templatePlanningTableZone"), eventplanner.zone.byId(_id, true)).contents().appendTo("#planningTable").find(".zoneEqList");
			}
			
			eventplanner.ui.planning.sortPlanning();
			return false;
		});
		
		// TRIGGER ACTUALISATION EQLOGIC
		$("#planningTable").delegate(".eqLogicItem", "updateItem", function(event){
			var newItem = $('<div>').loadTemplate(
				$("#templatePlanningTableEq"), 
				eventplanner.eqLogic.byId($(this).attr('data-id'), true), 
				{append: true});
				
			$(this).replaceWith($(newItem).contents());
			
			eventplanner.ui.planning.sortPlanning();
			return false;
		});

		$("#planningTable").delegate(".eqLogicItem", "removeItem", function(event){
			$(this).remove();
			return false;
		});
		
		// TRIGGER ACTUALISATION ZONE
		$("#planningTable").delegate(".zoneItem", "updateItem", function(event){
			var newItem = $('<div>').loadTemplate(
				$("#templatePlanningTableZone"),
				eventplanner.zone.byId($(this).attr('data-id'), true), 
				{append: true});
				
			// On ne met à jour que l'entête!
			$(this).find('.panel-heading').replaceWith($(newItem).find('.panel-heading'));
			
			eventplanner.ui.planning.sortPlanning();
			return false;
		});

		$("#planningTable").delegate(".zoneItem", "removeItem", function(event){
			$(this).remove();
			return false;
		});

		this.constructPlanning();
	},
	
	searchVal: function(searchVal){
		this.showAllZone();
		if(searchVal == ''){
			$('#planningSearch').parent().removeClass('has-error');
			// Réinitialisation: on affiche tout
			$('#planning .zoneItem').show();
			$('#planning .eqLogicItem')
				.show()
				.find('input[type=checkbox]').removeClass("cbSearchHidden");
		}else{
			$('#planningSearch').parent().addClass('has-error');
			// On cache tout par défaut
			$('#planning .zoneItem').hide();
			$('#planning .eqLogicItem')
				.hide()
				.find('input[type=checkbox]').addClass("cbSearchHidden");
			
			//Puis on affiche que ce que l'on cherche
			//On passe chaque zone en revue
			$("#planning .zoneItem").each(function(){
				$(this).find(".planningZoneName:contains('" + searchVal + "')")
					.closest('.zoneItem').show()
					.find('.eqLogicItem')
						.show()
						.find('input[type=checkbox]').removeClass("cbSearchHidden");
				
				$(this).find(".eqLogicItem:contains('" + searchVal + "')")
					.closest('.eqLogicItem')
						.show()
						.find('input[type=checkbox]').removeClass("cbSearchHidden")
					.closest('.zoneItem').show();
			});
		}
	},
	
	sortPlanning: function(){		
		var newDivOrder = $('#planning .zoneItem').sort(function (a, b) {
			// Récupération des zones concernées
			var zoneA = eventplanner.zone.byId(  $(a).attr('data-id') );
			var zoneB = eventplanner.zone.byId(  $(b).attr('data-id') );
			
			// Récupération des valeurs souhaitées pour le tri:
			var contentA = zoneA[eventplanner.ui.planning.sortBy].toLowerCase();
			var contentB = zoneB[eventplanner.ui.planning.sortBy].toLowerCase();
			
			if(eventplanner.ui.planning.sortOrder == 'asc'){
				return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
			}else{
				return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;				
			}
		});
		
		$('#planningTable').empty();
		$('#planningTable').append(newDivOrder);
	},

	constructPlanning: function(){
		this.zoneEqListSelector = {};

		var zonesData = eventplanner.zone.all(true);
		zonesData.forEach(function(_zoneData) {
    		eventplanner.ui.planning.zoneEqListSelector[_zoneData.zoneId] = $('<div>').loadTemplate($("#templatePlanningTableZone"), _zoneData).contents().appendTo("#planningTable").find(".zoneEqList");
		});

		var eqsData = eventplanner.eqLogic.all(true);
    	eqsData.forEach(function(_eqData, _i) {
    		eventplanner.ui.planning.zoneEqListSelector[_eqData.zoneId].loadTemplate($("#templatePlanningTableEq"), _eqData, {append: true});
		});
		
		this.sortPlanning();
	},

	showAllZone: function(){
		$('#planningTable').find('.panel-collapse').collapse('show');
	},

	hideAllZone: function(){
		$('#planningTable').find('.panel-collapse').collapse('hide');
	}
}

/////////////////////////////////////////////////
/// EQUIPEMENTS /////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.equipements = {
	title: 'Equipements',
	attributesColumns: {},
	$container: null,
	left: null,
	top: null,

	init: function(){
		this.$container = $('.screenContainer');
		this.left = this.$container.scrollLeft();
		this.top = this.$container.scrollTop();
		
		$('#eqLogicTable')
		  .on('sortStart filterStart', function() {
		    eventplanner.ui.equipements.left = eventplanner.ui.equipements.$container.scrollLeft();
		    eventplanner.ui.equipements.top = eventplanner.ui.equipements.$container.scrollTop();
		  })
		  .on('sortEnd filterEnd', function() {
		    eventplanner.ui.equipements.$container.scrollLeft(eventplanner.ui.equipements.left);
		    eventplanner.ui.equipements.$container.scrollTop(eventplanner.ui.equipements.top);
		  });
		
		$("#dupZoneForm select").loadTemplate(
			$("#templateEqZoneOptions"), 
			eventplanner.zone.all()
		);

		$('.saveEqBtn').click(function(event){
			var dataToSave = [];
			var dataToRemove = [];

			$('#eqLogicTable td.success').parent().each(function(i, eqLogicItem){
				var eqLogicId = $(eqLogicItem).attr('data-id');

				if(eqLogicId != ''){
					var eqLogic = eventplanner.eqLogic.byId(eqLogicId);
				}else{
					var eqLogic = new eventplanner.eqLogic.eqLogicItem({
						eqLogicId: '',
						eqLogicEventId: eventplanner.ui.currentUser.userEventId,
						eqLogicDisciplineId: eventplanner.ui.currentUser.userDisciplineId
					});
				}
				
				var eqLogic = eqLogic.getValues();
				
				$(eqLogicItem).find('.success[data-property]').each(function(j, prop){
					var propName = firstToLowerCase($(prop).attr('data-property').substring("eqLogic".length));
					
					if($(prop).attr('data-val')){
						var propVal = $(prop).attr('data-val');	
						if(propVal == '0'){
							propVal = null;
						}
					}else{
						var propVal = $(prop).text();	
					}
					
					if(propName == 'attribute'){
						if(!$(prop).attr('readonly')){
							eqLogic.attr[$(prop).attr('data-mattypeattributeid')] = propVal;
						}
					}else{
						eqLogic[propName] = propVal;
					}
				});
				
				dataToSave.push(eqLogic);
			});
			
			$('#eqLogicTable .eqLogicItem.danger').each(function(i, eqLogicItem){
				if($(eqLogicItem).attr('data-id') != ''){
					dataToRemove.push($(eqLogicItem).attr('data-id'));
				}
			});
			
			eventplanner.eqLogic.saveEqLogicList({
				saveList: dataToSave,
				deleteList: dataToRemove,
				success: function(_data) {
							eventplanner.ui.checkNewMsg().then(eventplanner.ui.equipements.constructEqList);
							eventplanner.ui.notification('success', "Modifications enregistrées.");
						},
				error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer les modifications.<br>" + _data.message);
						}
				});
		});
		
		$("#btnDupZoneSubmit").click(function(){
			var sourceZoneId = $('#dupZoneSource').val();
			
			var destZoneId = []; 
			$('#dupZoneDest :selected').each(function(i, selected){ 
			  destZoneId[i] = $(selected).val(); 
			});
			
			var eqFromSource = $('#eqLogicTable td[data-property="eqLogicZoneId"][data-val="' + sourceZoneId + '"]').parent();
			
			destZoneId.forEach(function(zoneDestId){
				eqFromSource.each(function(i, eqSource){
					var newEqLogicTr = $(eqSource).clone();
					newEqLogicTr.attr('data-id', '');
					newEqLogicTr.removeClass('danger');
					newEqLogicTr.find('td').addClass('success');
					
					var destZone = eventplanner.zone.byId(zoneDestId);
					newEqLogicTr.find('td[data-property="eqLogicZoneId"]')
						.attr('data-val', destZone.zoneId)
						.text(destZone.zoneName);
										
					$("#eqLogicTable > tbody").append(newEqLogicTr);
				});
			});

			$('#eqLogicTable').trigger('update');
			$('#zoneDupModal').modal('toggle');
		});

		$(".addEqLogicBtn").click(function(event){
			$("#eqLogicTable > tbody").loadTemplate(
				$("#templateEqTable"), 
	    		new eventplanner.eqLogic.contactItem({
					eqLogicEventId : eventplanner.ui.currentUser.userEventId
				}),
				{append: true}
			);
		});
		
		this.constructEqTable();

		var zoneList = {};
		eventplanner.zone.all().forEach(function(zone){
			zoneList[zone.zoneId] = zone.zoneName;
		});

		var matTypeList = {};
		eventplanner.matType.all().forEach(function(matType){
			matTypeList[matType.matTypeId] = matType.matTypeName;
		});

		$('#eqLogicTable')
			.tablesorter({
			    theme : "bootstrap",
			    widthFixed: true,
			    headerTemplate : '{content} {icon}',
			    widgets : ["uitheme", "filter", "zebra", "columnSelector", "stickyHeaders"],
			    widgetOptions : {
			      filter_reset : ".reset",
			      filter_cssFilter: "form-control",
			      columnSelector_mediaquery: false,
			      columnSelector_columns : {
			        0: 'disable',
			        1: 'disable',
			        2: 'disable'
			      },
			      stickyHeaders_attachTo : '#eqLogicTableWrapper'
			    },
			    sortList: [[0,0],[1,0]]
			})
			.editableTableWidget({
				showEditedCell: true,
				columns: {
					zone: 'zone',
					matType: 'matType',
					eqReal: 'eqReal'
				},
				types: {
					zone: {
						type: 'dropdown',
						source: zoneList
						},
					matType: {
						type: 'dropdown',
						source: matTypeList
						},
					eqReal: {
						type: 'dropdown',
						source: function(activeCell){
								var matTypeId = activeCell.parent().find('[data-property="eqLogicMatTypeId"]').attr('data-val');
								var eqRealList = {
									null: 'Aucun'
								};
								eventplanner.eqReal.byMatTypeId(matTypeId).forEach(function(eqReal){
									eqRealList[eqReal.eqRealId] = eqReal.eqRealName;
								});
								return eqRealList
							}
						}
			}
		});
		$.tablesorter.columnSelector.attachTo( $('#eqLogicTable'), '#eqColSelectBtn-target');
		
		$('#eqLogicTable').on('change', function(event){
			if($(event.activeCell).attr('data-property') == 'eqLogicMatTypeId'){
				var newEqLogic = new eventplanner.eqLogic.eqLogicItem({
						eqLogicId: $(event.activeCell).parent().attr('data-id'),
						eqLogicEventId: eventplanner.ui.currentUser.userEventId,
						eqLogicDisciplineId: eventplanner.ui.currentUser.userDisciplineId,
						eqLogicMatTypeId: $(event.activeCell).attr('data-val'),
						eqLogicZoneId: $(event.activeCell).parent().find('[data-property="eqLogicZoneId"]').attr('data-val'),
						eqLogicEqRealId: null,
						eqLogicComment: $(event.activeCell).parent().find('[data-property="eqLogicComment"]').text()
					});

				var newEqLogicItem = eventplanner.ui.equipements.getEqLogicItem(newEqLogic);
				newEqLogicItem.find('td')
					.not('[data-property="eqLogicZoneId"]')
					.not('[data-property="eqLogicComment"]')
					.addClass('success');
				$(event.activeCell).parent().replaceWith(newEqLogicItem);
			}
			
			$('#eqLogicTable').trigger('update');
		});
		
		$('#equipements').delegate('.addEqBtn', 'click', function(event){
			var newEqLogic = new eventplanner.eqLogic.eqLogicItem({
					eqLogicId: '',
					eqLogicEventId: eventplanner.ui.currentUser.userEventId,
					eqLogicDisciplineId: eventplanner.ui.currentUser.userDisciplineId
				});
				
			var newEqLogicItem = eventplanner.ui.equipements.getEqLogicItem(newEqLogic);
			newEqLogicItem.find('td').addClass('success');
			
			$("#eqLogicTable > tbody").append(newEqLogicItem);
			$('#eqLogicTable').trigger('update');
		});

		$('#eqLogicTable').delegate('.dupEqBtn', 'click', function(event){
			eventplanner.ui.equipements.duplicateRow(this);
			$('#eqLogicTable').trigger('update');
		});

		$('#eqLogicTable').delegate('.deleteEqBtn', 'click', function(event) {
			$(this).closest('.eqLogicItem').toggleClass('danger');
		});
	},

	constructEqTable: function(){
		eventplanner.matTypeAttribute.all().forEach(function(attr){
			$('#eqLogicTable thead tr').loadTemplate($('#templateAttributeHeader'), eventplanner.matTypeAttribute.byId(attr.matTypeAttributeId, true), {append: true})
		});

		this.constructEqList();
	},
	
	constructEqList: function(){
		$('#eqLogicTable > tbody').empty();

		eventplanner.eqLogic.all().forEach(function(eqLogic){
			$('#eqLogicTable > tbody').append(eventplanner.ui.equipements.getEqLogicItem(eqLogic));
		});
		
		$('#eqLogicTable').trigger('update');
	},

	duplicateRow: function(row){
		var eqLogicTr = $(row).closest('.eqLogicItem');
		var newEqLogicTr = eqLogicTr.clone();

		newEqLogicTr.attr('data-id', '');
		newEqLogicTr.removeClass('danger');
		newEqLogicTr.find('td').addClass('success');

		eqLogicTr.after(newEqLogicTr);

		return newEqLogicTr;
	},

	fillEqLogicAttribute: function(eqLogicItem, eqLogic){
		eqLogic.getMatType().getAllAttributes().forEach(function(matTypeAttr){
			var attrItem = eqLogicItem.find(".eqColAttr[data-matTypeAttributeId=" + matTypeAttr.matTypeAttributeId + "]");
			attrItem.removeAttr('readonly');

			eqLogicAttr = eqLogic.getEqLogicAttributesByMatTypeAttributeId(matTypeAttr.matTypeAttributeId);
			if(eqLogicAttr && eqLogicAttr.hasOwnProperty('eqLogicAttributeValue')){
				attrItem.text(eqLogicAttr.eqLogicAttributeValue);
			}else{
				attrItem.text('');
			}
		});
	},

	getEqLogicItem: function(eqLogic){
		var fullEqLogic = eqLogic.getFullData();
		if(fullEqLogic.eqLogicEqRealId == null){
			fullEqLogic.eqRealName = 'Aucun';
			fullEqLogic.eqRealId = '0';
		}
		
		var newEqLogicItem = $("<div>").loadTemplate($("#templateEqTable"), fullEqLogic).contents();

		$("#eqLogicTable th.eqColAttr").each(function(i, thAttr){
			newEqLogicItem.loadTemplate($('#templateAttributeCell'), {matTypeAttributeId: $(thAttr).attr('data-attribute-id')}, {append: true});
		});

		newEqLogicItem.find(".eqColAttr").attr('readonly');

		this.fillEqLogicAttribute(newEqLogicItem, eqLogic);
		
		return newEqLogicItem;
	}
};

/////////////////////////////////////////////////
/// ZONES ///////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.zones ={
	title: 'Zones',
	init: function(){
		$("#zoneTable")
	  		.tablesorter({
			    theme : "bootstrap",
			    widthFixed: false,
			    headerTemplate : '{content} {icon}',
			    widgets : ["uitheme", "zebra"],
			    widgetOptions : {
			      filter_reset : ".reset",
			      filter_cssFilter: "form-control",
			      filter_childRows  : true,
			    },
			    sortList: [[0,0]]
			});

		$('#zones').delegate('.editZoneBtn', 'click', function () {
			var zoneId = $(this).attr('data-zone-id');
			
			if(zoneId == 'new'){
				var currentEvent = eventplanner.ui.currentUser.getEvent();
				
				try {
				   	var zoneItem = new eventplanner.zone.zoneItem({
				   		zoneEventLevelId: currentEvent.eventDefaultEventLevelId,
						zoneEventId: currentEvent.eventId,
						zoneLocalisation: currentEvent.eventLocalisation,
						zoneInstallDate: currentEvent.eventStartDate,
						zoneUninstallDate: currentEvent.eventEndDate,
					});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer la zone.<br>" + e.message);
				}
				
				if(zoneItem != undefined){
					var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(zoneItem);
					zoneConfModal.open();
				}
			}else{
				var zoneConfModal = new eventplanner.ui.modal.EpModalZoneConfiguration(eventplanner.zone.byId(zoneId));
					zoneConfModal.open();
			}
		});

		$('#zoneTable').delegate('.deleteZoneBtn', 'click',  function (event) {
			var zone = eventplanner.zone.byId($(this).attr('data-zone-id'));
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression de la zone " + zone.zoneName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		zone.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Zone supprimée! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer la zone.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});

			event.preventDefault();
			return false;
		});

		$("#zoneTable").bind("addItem", function(event, _zoneId){
			var newItem = $('<div>').loadTemplate($("#templateZoneTable"), eventplanner.zone.byId(_zoneId));
			$(this).find('tbody').append($(newItem).contents());

			$('#zoneTable').trigger('update');
		});

		$("#zoneTable").delegate(".zoneItem", "updateItem", function(){
			var zoneId = $(this).attr('data-id');
			var newItem = $('<div>').loadTemplate($("#templateZoneTable"), eventplanner.zone.byId(zoneId));
			$(this).replaceWith($(newItem).contents());

			$('#zoneTable').trigger('update');
		});

		$("#zoneTable").delegate(".zoneItem", "removeItem", function(){
			$(this).remove();
			$('#zoneTable').trigger('update');
		});
		
		this.constructZoneTable();
	},
	
	constructZoneTable: function(){
		$("#zoneTable > tbody").loadTemplate($("#templateZoneTable"), eventplanner.zone.all(true));
		$('#zoneTable').trigger('update');
	}
}

/////////////////////////////////////////////////
/// CONFIG EVENT/////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.configevent = {
	title: 'Configuration de l\'événement',
	init: function(){
		$("#contactTable > tbody").loadTemplate(
			$("#templateContactTable"), 
			eventplanner.contact.all(true));

		$(".addContactBtn").click(function(event){
			$("#contactTable > tbody").loadTemplate(
				$("#templateContactTable"), 
	    		new eventplanner.contact.contactItem({
	    			contactName: 'Nouveau contact',
	    			contactFct: 'Fonction',
	    			contactZoneId: 0,
					contactEventId : eventplanner.ui.currentUser.userEventId
				}),
				{append: true}
			);
		});

		$(".saveContactBtn").click(function(event){
			var contactList = [];

			$('#contactTable .success').closest('.contactItem').each(function(i, contactItem){
				var contactId = $(contactItem).attr('data-id');

				if(contactId != ''){
					var originalContact = eventplanner.contact.byId(contactId);

					$(contactItem).find(".success").each(function(j, contactProp){
						console.log($(contactProp).attr('data-property') + " : " + $(contactProp).text());
					});

				}else{
					var originalContact = new eventplanner.contact.contactItem({
						contactName: $(contactItem).find("td[data-property=contactName]").text(),
						contactFct: $(contactItem).find("td[data-property=contactFct]").text(),
						contactZoneId: $(contactItem).find("td[data-property=contactZoneId]").attr('data-value'),
						contactEventId : eventplanner.ui.currentUser.userEventId
					});
				}
				contactList.push(originalContact);
			});

			console.log(contactList);
		});
		
		var zoneList = {
			0: 'Aucune'
		};
		eventplanner.zone.all().forEach(function(zone){
			zoneList[zone.zoneId] = zone.zoneName;
		});

		$('#contactTable').editableTableWidget({
			showEditedCell: true,
			columns: {zone: 'zone'},
			types: {
				zone: {
					type: 'dropdown',
					source: zoneList
					}
			}
		});

		/*
		$('#contactTable td').on('change', function(event, newValue){
			var contactId = $(this).closest('.contactItem').attr('data-id');
			console.log(contactId);
			if(contactId != ''){
				var originalContact = eventplanner.contact.byId(contactId);
			}else{
				var originalContact = new eventplanner.contact.contactItem({
					contactEventId : eventplanner.ui.currentUser.userEventId
				});
			}


			if(originalContact === false){
				eventplanner.ui.notification('error', "Contact inconnu, vérifier qu'il n'a pas été supprimé par ailleur, ou actualiser la page.<br>");
				return;
			}

			var newContact = originalContact.clone();

				if(newContact.hasOwnProperty($(this).data('property'))){
					var property = $(this).data('property');

					if(property == 'contactCoord'){
						var coordType = $(this).data('property-item');
						var newCoordArray = [];
						var coordFinded = false;

						newContact.contactCoord.forEach(function(coord){
					    	if(coord.type == coordType){
					    		coordFinded = true;
					    		if(newValue != ''){
					    			coord.value = newValue;
					    			newCoordArray.push(coord);
					    		}
					    	}else{
					    		newCoordArray.push(coord);
					    	}
					    });

						if(!coordFinded && newValue != ''){
							newCoordArray.push({
								type: coordType,
								value: newValue
							});
						}

						newContact.contactCoord = newCoordArray;
					}else if(property == 'contactZoneId'){
						var newZoneId = $(this).attr('data-value');
						console.log(newZoneId);
						if(newZoneId > 0){
							newContact[property] = newZoneId;
						}else{
							newContact[property] = null;
						}
					}else{
						newContact[property] = newValue;
					}
				}

				try{
					newContact.save({
						  success: function(thisTd, newValue){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
											$(thisTd).data('original-value', newValue);
										}
									}(this, newValue),
						  error: function(thisTd, newValue){
										return function(_data) {
											eventplanner.ui.notification('error', "Impossible d'enregistrer le contact.<br>" + _data.message);
										  	$(thisTd).addClass('danger');
									 	}
									}(this, newValue)
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
					$(this).addClass('danger');
				}
		});
		*/
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
				try {
				   	var missionItem = new eventplanner.mission.missionItem({
				   		missionDisciplineId: eventplanner.ui.currentUser.userDisciplineId,
						missionEventId: eventplanner.ui.currentUser.userEventId
					});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer la mission.<br>" + e.message);
				}
				
				if(missionItem != undefined){
					var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(missionItem);
					missionConfModal.open();
				}
			}else{
				var missionConfModal = new eventplanner.ui.modal.EpModalMissionConfiguration(eventplanner.mission.byId(missionId));
				missionConfModal.open();
			}
		});

		$('#mission').delegate('.editStateBtn', 'click', function () {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('missionId')], 'mission', $(this).data('missionState')); 
			stateModal.open();

			return false;
		});
	
		$('#missionTable').delegate('.deleteMissionBtn', 'click', function (event) {
			var mission = eventplanner.mission.byId($(this).attr('data-mission-id'));
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression de la mission " + mission.missionName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		mission.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Mission supprimée! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer la mission.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});

			event.preventDefault();
			return false;
		});

		$("#missionTable").bind("addItem", function(event, _missionId){
			var newItem = $('<div>').loadTemplate($("#templateMissionTable"), eventplanner.mission.byId(_missionId, true));
			$(this).append($(newItem).contents());
			eventplanner.ui.mission.sortMissionList();
		});

		$("#missionTable").delegate(".missionItem", "updateItem", function(){
			var missionId = $(this).attr('data-id');
			var newItem = $('<div>').loadTemplate($("#templateMissionTable"), eventplanner.mission.byId(missionId, true));
			$(this).replaceWith($(newItem).contents());
			eventplanner.ui.mission.sortMissionList();
		});

		$("#missionTable").delegate(".missionItem", "removeItem", function(){
			$(this).remove();
		});
		
		this.constructMissionTable();
	},
	
	constructMissionTable: function(){
		$("#missionTable").loadTemplate($("#templateMissionTable"), eventplanner.mission.all(true));
		this.sortMissionList();
	},

	sortMissionList: function(){		
		var newLiOrder = $("#missionTable .missionItem").sort(function (a, b) {
			var missionA = eventplanner.mission.byId(  $(a).attr('data-id') );
			var missionB = eventplanner.mission.byId(  $(b).attr('data-id') );
			
			// Récupération des valeurs souhaitées pour le tri:
			var contentA = (1000 - missionA.missionState) + missionA.missionDate;
			var contentB = (1000 - missionB.missionState) + missionB.missionDate;
			
			return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
		});
		
		$('#missionTable').empty();
		$('#missionTable').append(newLiOrder);
	}
}

/////////////////////////////////////////////////
/// SCAN ////////////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.scan = {
	title: 'Scan',
	init: function(_option){
		var eqRealId = _option.id;

		if(Number.isInteger(parseInt(eqRealId))){
			var eqReal = eventplanner.eqReal.byId(eqRealId);

			if(eqReal == false){
				eventplanner.ui.notification('error', 'Matériel inexistant dans l\'inventaire!');
				return false;
			}
		}else{
			eventplanner.ui.notification('error', 'ID incorrect!');
			return false;
		}

		if(Number.isInteger(parseInt(eventplanner.ui.currentUser.userActionOnScan))){
			// eq
			if(eventplanner.ui.currentUser.userActionOnScan >= 100 && eventplanner.ui.currentUser.userActionOnScan < 200 ){
				var eqLogic = eventplanner.eqLogic.byEqRealId(eqRealId);
				if(eqLogic !== false){
					eventplanner.eqLogic.updateState({
						listId: [eqLogic.eqLogicId],
						state: eventplanner.ui.currentUser.userActionOnScan,
						success: function(thisModal){
									return function(_data) {
										eventplanner.ui.checkNewMsg();
										eventplanner.ui.notification('success', "Etat modifié.");	
									}
								}(event.data),
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible de modifier l'état.<br>" + _data.message);
						}	
						});
				}else{
					eventplanner.ui.notification('error', 'Matériel non trouvé sur cet événement!');
				}
				
			}

			//eqReal
			if(eventplanner.ui.currentUser.userActionOnScan >= 300 && eventplanner.ui.currentUser.userActionOnScan < 400 ){
				eventplanner.eqReal.updateState({
					listId: [eqRealId],
					state: eventplanner.ui.currentUser.userActionOnScan,
					success: function(thisModal){
								return function(_data) {
									eventplanner.ui.checkNewMsg();
									eventplanner.ui.notification('success', "Etat modifié.");	
								}
							}(event.data),
					error: function(_data){
						eventplanner.ui.notification('error', "Impossible de modifier l'état.<br>" + _data.message);
					}	
					});
			}

		}else{
			switch(eventplanner.ui.currentUser.userActionOnScan){
				case 'zone':
					var eqLogic = eventplanner.eqLogic.byEqRealId(eqRealId);
					if(eqLogic !== false){
						var zoneModal = new eventplanner.ui.modal.EpModalZone(eventplanner.zone.byId(eqLogic.eqLogicZoneId));
							zoneModal.open();
					}else{
						eventplanner.ui.notification('error', 'Matériel non trouvé sur cet événement!');
					}
				break;

				case 'eqStateSelect':
					var eqLogic = eventplanner.eqLogic.byEqRealId(eqRealId);
					if(eqLogic !== false){
						var stateModal = new eventplanner.ui.modal.EpModalState([eqLogic.eqLogicId], 'eqLogic', eqLogic.eqLogicState); 
						stateModal.open();
					}else{
						eventplanner.ui.notification('error', 'Matériel non trouvé sur cet événement!');
					}
				break;

				case 'eqRealStateSelect':
					var stateModal = new eventplanner.ui.modal.EpModalState([eqRealId], 'eqReal', eqReal.eqRealState); 
					stateModal.open();
				break;
			}
		}
	}
};

/////////////////////////////////////////////////
/// EVENT INFOS///////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.eventinfos = {
	title: 'Infos événement',
	init: function(){
		var currentEvent = eventplanner.ui.currentUser.getEvent();

		// GENERAL
		$('#eventInfosContainer').html(currentEvent.eventGeneralInfo);

		$('#eventInfosEditorContainer').hide();
		$('#eventInfosTextarea').wysihtml5();
		
		$('#validEventInfoBtn')
			.hide()
			.click(function(){
				var newEvent = eventplanner.ui.currentUser.getEvent().clone();
				
				newEvent.eventGeneralInfo = $('#eventInfosTextarea').val();
			    				
				try{
					newEvent.save({
						success: function(_data) {
								eventplanner.ui.checkNewMsg();
						
								// On cache les éléments d'édition
								$('#validEventInfoBtn').hide();
								$('#eventInfosEditorContainer').hide();
								
								// On met à jour le DivContainer avec les infos éditées 
								$('#eventInfosContainer').html($('#eventInfosTextarea').val());
								
								// On affiche de DivContainer et le bouton éditer
								$('#editEventInfoBtn').show();
								$('#eventInfosContainer').show();
								
								eventplanner.ui.notification('success', "Changement enregistré.");	
							},
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer la modification.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
				return false;
			});
		
		$('#editEventInfoBtn').click(function(){
				// On cache le DivContainer et le bouton éditer
				$('#editEventInfoBtn').hide();
				$('#eventInfosContainer').hide();
				
				// On met à jour l'éditeur avec les infos du DivContainer
				$('#eventInfosTextarea').data("wysihtml5").editor.setValue($('#eventInfosContainer').html());
				
				// On affiche l'éditeur et le bouton de validation
				$('#validEventInfoBtn').show();
				$('#eventInfosEditorContainer').show();
			});
	}
};


/////////////////////////////////////////////////
/// CONTACT   ///////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.contact = {
	title: 'Contacts',
	init: function(){
		// CONTACT
		$("#contactTable").loadTemplate(
			$("#templateContactTable"), 
			eventplanner.contact.all(true));

		$("#contactTable").bind("addItem", function(event, _contactId){
			var newItem = $('<div>').loadTemplate($("#templateContactTable"), eventplanner.contact.byId(_contactId, true));
			$(this).append($(newItem).contents());

			$('#contactTable').trigger('update');
		});

		$("#contactTable").delegate(".contactItem", "updateItem", function(){
			var contactId = $(this).attr('data-id');
			var newItem = $('<div>').loadTemplate($("#templateContactTable"), eventplanner.contact.byId(contactId, true));
			$(this).replaceWith($(newItem).contents());

			$('#contactTable').trigger('update');
		});

		$("#contactTable").delegate(".contactItem", "removeItem", function(){
			$(this).remove();
			$('#contactTable').trigger('update');
		});
		
		$('#contact').delegate('.editContactBtn', 'click', function () {
			var contactId = $(this).attr('data-contact-id');
			
			if(contactId == 'new'){
				try {
				   	var contactItem = new eventplanner.contact.contactItem({
						contactEventId : eventplanner.ui.currentUser.userEventId
					});
				}
				catch (e) {
				   eventplanner.ui.notification('error', "Impossible de créer le contact.<br>" + e.message);
				}
				
				if(contactItem != undefined){
					var contactModal = new eventplanner.ui.modal.EpModalContactConfiguration(contactItem);
					contactModal.open();	
				}
			}else{
				var contactModal = new eventplanner.ui.modal.EpModalContactConfiguration(eventplanner.contact.byId(contactId));	
				contactModal.open();
			}
		});

		$('#contact').delegate('.deleteContactBtn', 'click', function (event) {
			var contact = eventplanner.contact.byId($(this).attr('data-contact-id'));
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression du contact " + contact.contactName + " ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		contact.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Contact supprimé! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer le contact.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});

			event.preventDefault();
			return false;
		});
	}
};


/////////////////////////////////////////////////
/// USER INFOS///////////////////////////////////
/////////////////////////////////////////////////
eventplanner.ui.userinfos = {
	title: 'Infos utilisateur',
	init: function(){
		$("#userinfos").find("#userName").val(eventplanner.ui.currentUser.userName);
		$("#userinfos").find("#userLogin").val(eventplanner.ui.currentUser.userLogin);

		if(eventplanner.ui.currentUser.userSlackID){
			$("#userinfos").find("#userSlackID").val(eventplanner.ui.currentUser.userSlackID);
		}

		$.each(eventplanner.ui.STATE.stateList, function(stateNbr, stateParam){
			// eq
			if(stateNbr >= 100 && stateNbr < 200 ){
				$("#userinfos").find('#eqStateList').loadTemplate(
			  		$("#userinfos").find("#templateStateSelectOptions"),
			  		{
			  			id: stateNbr, 
			  			text: stateParam.text
			  		} ,{
			  			append: true
			  		});
			}

			//eqReal
			if(stateNbr >= 300 && stateNbr < 400 ){
				$("#userinfos").find('#eqRealStateList').loadTemplate(
			  		$("#userinfos").find("#templateStateSelectOptions"),
			  		{
			  			id: stateNbr, 
			  			text: stateParam.text
			  		} ,{
			  			append: true
			  		});
			}
		});

		$("#userinfos").find('#scanSelect option[value="' + eventplanner.ui.currentUser.userActionOnScan + '"]').prop('selected', true);


		// Submit SCAN
		$("#userinfos").find('#userLoginForm').submit(this, function(event) {
				var newUser = eventplanner.ui.currentUser.clone();
				
				newUser.userLogin = $(this).find("#userLogin").val();
			    newUser.userName = $(this).find("#userName").val();
				
				if(($(this).find("#userPassword1").val() != '') || ($(this).find("#userPassword2").val() != '')){
			    	if(($(this).find("#userPassword1").val() == $(this).find("#userPassword2").val())){
			    		newUser.userPassword = $(this).find("#userPassword1").val();
			    	}else{
			    		eventplanner.ui.notification('error', "Les mots de passes saisis ne sont pas identiques. Pour ne pas modifier le mot de passe, laisser les 2 champs vides.");
			    		return false;
			    	}
			    }
				
				try{
					newUser.save({
						success: function(_data) {
								eventplanner.ui.checkNewMsg();
								eventplanner.ui.currentUser = new eventplanner.user.userItem(_data);
								eventplanner.ui.notification('success', "Changement enregistré.");	
							},
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer la modification.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}

			    return false;
			});

		// Submit Slack
		$("#userinfos").find('#userSlackForm').submit(this, function(event) {
				var newUser = eventplanner.ui.currentUser.clone();
				
				newUser.userSlackID = $(this).find("#userSlackID").val();
			    				
				try{
					newUser.save({
						success: function(_data) {
								eventplanner.ui.checkNewMsg();
								eventplanner.ui.currentUser = new eventplanner.user.userItem(_data);
								eventplanner.ui.notification('success', "Changement enregistré.");	
							},
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer la modification.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
							    
			    return false;
			});


		// Submit SCAN
		$("#userinfos").find('#userScanForm').submit(this, function(event) {
				var newUser = eventplanner.ui.currentUser.clone();
				
				newUser.userActionOnScan = $(this).find("#scanSelect").val();
			    				
				try{
					newUser.save({
						success: function(_data) {
								eventplanner.ui.checkNewMsg();
								eventplanner.ui.currentUser = new eventplanner.user.userItem(_data);
								eventplanner.ui.notification('success', "Changement enregistré.");	
							},
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer la modification.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}

			    return false;
			});
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
	this.modal.on('hidden.bs.modal', function () {
	    if($('.modal:visible').length > 0){
	    	$('body').addClass('modal-open');
	    }
	});
		
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
eventplanner.ui.modal.EpModalZone = function(_zone, presetEqLogicId = null){
	eventplanner.ui.modal.EpModal.call(this, _zone.zoneName, "zone");
	this.currentPage = 1;
	this.resultsPerPage = 20;
	this.data = _zone;
	
	this.preShow = function(){
		this.constructZone();
		this.constructMsgTable();
		this.constructEqTable();
		this.addTriggers();
		
		if(presetEqLogicId != null){
			this.modal.find("#linkEquipement").tab('show')
			this.modal.find('.eqLogicItem[data-id=' + presetEqLogicId + '] .collapse').collapse('show');
		}
		
		this.modal.find('.modalValidBtn').hide();
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
		// ZONE
		this.modal.find("#zone").bind("refreshZoneTable", this, function(event){
			//event.data.constructEqTable();
			// PROBLEME POUR NE RAFRAICHIR QUE LA DONNEE QUI VA BIEN...
		});
		this.modal.find("#zone").delegate(".zoneItem", "updateItem", function(thisModal){
			return function(event){
				thisModal.data = eventplanner.zone.byId(thisModal.data.zoneId, true);
				thisModal.constructZone();
				thisModal.constructMsgTable();
			}
		}(this));

		this.modal.find('#zone').delegate('.editStateBtn', 'click', this, function (event) {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('zoneId')], 'zone', $(this).data('zoneState')); 
			stateModal.open();

			return false;
		});

		// MSG
		this.modal.find('#progressZonePhotoUpload').hide();
		this.modal.find('#uploadZonePhotoFile').fileupload({
				disableImageResize: false,
			    imageMaxWidth: 800,
			    imageMaxHeight: 800,
		    	imageOrientation: true,
		    	disableImageMetaDataSave: true,
			    dataType: 'json',
			    replaceFileInput: false,
			    url: 'core/ajax/ajax.php',
			    formData:{ 
			    	eventplanner_token: EVENTPLANNER_AJAX_TOKEN,
			    	type: 'msg',
			    	action: 'uploadPhoto',
			    	zoneId: this.data.zoneId
			    },
			    done: function (e, data) {
					        if (data.result.state != 'ok') {
					            eventplanner.ui.notification('error', "Impossible d'enregistrer la photo.<br>" + data.result.result);
					        }else{
					        	eventplanner.ui.checkNewMsg();
					        	eventplanner.ui.notification('success', "Photo transférée.");
					        }

						    setTimeout(function(thisUploadForm){
					        	return function(){
							        	$(thisUploadForm).closest('.msgForm').find('#progressZonePhotoUpload').hide();
							        }
						    }(this), 2000);
			    		},
			    start: function (e) {
				            var progress = 0;
				            $(this).closest('.msgForm').find('#progressZonePhotoUpload').show();
				            $(this).closest('.msgForm').find('#progressZonePhotoUpload .progress-bar').css(
				                'width',
				                progress + '%'
				            );
				        },
		        progressall: function (e, data) {
				            var progress = parseInt(data.loaded / data.total * 100);
				            $(this).closest('.msgForm').find('#progressZonePhotoUpload .progress-bar').css(
				                'width',
				                progress + '%'
				            );
				        }
			});

		this.modal.find('.previous').click(this, function (event) {
			event.data.currentPage--;
			if(event.data.currentPage < 1){
				event.data.currentPage = 1;
			}
			event.data.constructMsgTable();
			return false;
		});

		this.modal.find('.next').click(this, function (event) {
			
			if (event.data.currentPage * event.data.resultsPerPage < eventplanner.msg.byZoneId(event.data.data.zoneId).length) {
				event.data.currentPage++;
				event.data.constructMsgTable();
			}
			
			return false;
		});

		this.constructMsgTable();
		
		this.modal.find("#zoneMsgTable").bind("addItem",  function(thisModal){
			return function(event, _msgId){
				thisModal.constructMsgTable();
			}
		}(this));

		// EQLOGIC
		this.modal.find("#zoneEqTable").bind("update", function(thisModal){
			return function(){
				thisModal.sortEqTable();
			}
		}(this));
		
		this.modal.find("#zoneEqTable").bind("addItem", function(thisModal){
			return function(event, _eqId){
				var eqLogic = eventplanner.eqLogic.byId(_eqId, true);
				var newItem = $('<div>').loadTemplate($("#templateZoneEqTable"), eqLogic);
				$(this).append($(newItem).contents());

				// Construction de la liste des attributs
				thisModal.constructAttributeTable(eqLogic)
				
				// ajout des liens
				thisModal.constructEqLinkTable(eqLogic.eqLogicId);

				$('#zoneEqTable').trigger('update');
			}
		}(this));

		this.modal.find("#zoneEqTable").delegate(".eqLogicItem", "updateItem", function(thisModal){
			return function(event, _eqId){
				var collapseState = $(this).find('.panel-collapse').hasClass('in');
				var eqId = $(this).attr('data-id');
				var eqLogic = eventplanner.eqLogic.byId(eqId, true);
				var newItem = $('<div>').loadTemplate($("#templateZoneEqTable"), eqLogic);
				if(collapseState){
					$(newItem).find('.panel-collapse').addClass('in');
				}
				$(this).replaceWith($(newItem).contents());

				// Construction de la liste des attributs
				thisModal.constructAttributeTable(eqLogic)
				
				// ajout des liens
				thisModal.constructEqLinkTable(eqLogic.eqLogicId);

				$('#zoneEqTable').trigger('update');
			}
		}(this));

		this.modal.find("#zoneEqTable").delegate(".eqLogicItem", "removeItem", function(){
			$(this).remove();
			$('#zoneEqTable').trigger('update');
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
			
			var stateModal = new eventplanner.ui.modal.EpModalState(eqList, 'eqLogic', eqState); 
			stateModal.open();

			return false;
		});
		
		this.modal.find('#equipements').delegate('.editStateBtn', 'click', this, function (event) {
			var stateModal = new eventplanner.ui.modal.EpModalState([$(this).data('eqlogicId')], 'eqLogic', $(this).data('eqlogicState')); 
			stateModal.open();

			return false;
		});

		// EQLINK
		/*
		// Déjà pris en compte dans le refresh de l'eqLogic
		this.modal.find(".eqLinkTable").bind("refreshEqLinkTable", this, function(event){
			event.data.constructEqLinkTable($(this).data('eqLogicId'));
		});
		*/
	}
	
	this.constructZone = function(){
		this.modal.find("#zoneInfo").loadTemplate(this.modal.find("#templateZoneInfo"), this.data);

		// Contacts
		$("#zoneContactList").loadTemplate(
			$("#templateZoneContact"), 
			eventplanner.contact.byZoneId(this.data.zoneId, true));
	}

	this.constructMsgTable = function(){
		var listeMsg = eventplanner.msg.byZoneId(this.data.zoneId, true);

		if (this.currentPage <= 1) {
            this.modal.find('.previous').attr('disabled','disabled');
        } else {
            this.modal.find('.previous').prop("disabled", false);
        }

        if (this.currentPage * this.resultsPerPage > listeMsg.length) {
            this.modal.find('.next').attr('disabled','disabled');
        } else {
            this.modal.find('.next').prop("disabled", false);
        }

		this.modal.find("#zoneMsgTable").loadTemplate(
			this.modal.find("#templateZoneMsgTable"), 
			listeMsg, 
			{
				paged: true, 
				pageNo: this.currentPage, 
				elemPerPage: this.resultsPerPage
			});
	}

	this.constructEqTable = function(){
		var eqLogicList = eventplanner.eqLogic.byZoneId(this.data.zoneId, true);
		
		// Construction des sections
		this.modal.find("#zoneEqTable").loadTemplate($("#templateZoneEqTable"), eqLogicList);
		
		// Complément des eqLinks
		$.each(eqLogicList, function(thisModal){
			return function(index, eqLogic){
				// Construction de la liste des attributs
				thisModal.constructAttributeTable(eqLogic)
				// Construction de la liste des liens
				thisModal.constructEqLinkTable(eqLogic.eqLogicId);
				// Contruction de la main courante
				thisModal.constructEqLogicMsgTable(eqLogic);
				// Tri
				thisModal.sortEqTable();
			}
		}(this));
	}
	
	this.sortEqTable = function(){		
		var newDivOrder = $('#zoneEqTable .eqLogicItem').sort(function (a, b) {
			// Récupération des zones concernées
			var eqLogicA = eventplanner.eqLogic.byId(  $(a).attr('data-id') );
			var eqLogicB = eventplanner.eqLogic.byId(  $(b).attr('data-id') );
			
			// Récupération des valeurs souhaitées pour le tri:
			var contentA = eqLogicA.getMatType().matTypeName.toLowerCase();
			var contentB = eqLogicB.getMatType().matTypeName.toLowerCase();
			
			return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
		});
		
		$('#zoneEqTable').empty();
		$('#zoneEqTable').append(newDivOrder);
	}

	this.constructEqLogicMsgTable = function(eqLogic){
		this.modal.find('.msgForm[data-eqLogic-id=' + eqLogic.eqLogicId + '] .progressEqLogicPhotoUpload').hide();
		this.modal.find('.msgForm[data-eqLogic-id=' + eqLogic.eqLogicId + '] .uploadEqLogicPhoto').fileupload({
			disableImageResize: false,
		    imageMaxWidth: 800,
		    imageMaxHeight: 800,
		    imageOrientation: true,
		    disableImageMetaDataSave: true,
		    dataType: 'json',
		    replaceFileInput: false,
		    url: 'core/ajax/ajax.php',
		    formData:{ 
		    	eventplanner_token: EVENTPLANNER_AJAX_TOKEN,
		    	type: 'msg',
		    	action: 'uploadPhoto',
		    	zoneId: this.data.zoneId,
		    	eqLogicId: eqLogic.eqLogicId
		    },
		    done: function (e, data) {
				        if (data.result.state != 'ok') {
				            eventplanner.ui.notification('error', "Impossible d'enregistrer la photo.<br>" + data.result.result);
				        }else{
				        	eventplanner.ui.checkNewMsg();
				        	eventplanner.ui.notification('success', "Photo transférée.");
				        }

				        setTimeout(function(thisUploadForm){
				        	return function(){
						        	$(thisUploadForm).closest('.msgForm').find('.progressEqLogicPhotoUpload').hide();
						        }
					    }(this), 2000);
		    		},
		    start: function (e) {
			            var progress = 0;
			            $(this).closest('.msgForm').find('.progressEqLogicPhotoUpload').show();
			            $(this).closest('.msgForm').find('.progressEqLogicPhotoUpload .progress-bar').css(
			                'width',
			                progress + '%'
			            );
			        },
	        progressall: function (e, data) {
			            var progress = parseInt(data.loaded / data.total * 100);
			            $(this).closest('.msgForm').find('.progressEqLogicPhotoUpload .progress-bar').css(
			                'width',
			                progress + '%'
			            );
			        }
		});
	}

	this.constructEqMarkers = function(){
		var eqLogics = eventplanner.eqLogic.byZoneId(this.data.zoneId, true);

		eqLogics.forEach(function(eq){
			if(is_array(eq.eqLogicLocalisation)){
				var eqMarker = eventplanner.ui.map.addEqMarkerOnMap(this.mapZone, eq);
				eqMarker.bindPopup('<div><b>' + eq.matTypeName + ' - ' + eq.eqRealName + '</b>');
			}
		}, this);
	}

	this.constructAttributeTable = function(eqLogic){
		this.modal.find('.eqLogicListAttribute[data-eq-logic-id=' + eqLogic.eqLogicId + ']').empty();

		eqLogic.getEqLogicAttributes().forEach(function(thisModal, eqLogicId){
			return function(attr){
				var attrData = {
					matTypeAttributeName: eventplanner.matTypeAttribute.byId(attr.eqLogicAttributeMatTypeAttributeId).matTypeAttributeName,
					eqLogicAttributeValue: attr.eqLogicAttributeValue
				}

				thisModal.modal.find('.eqLogicListAttribute[data-eq-logic-id=' + eqLogicId + ']').loadTemplate(thisModal.modal.find("#templateEqConfigurationEqLogicAttribute"), attrData, {append: true});
			}
		}(this, eqLogic.eqLogicId));
	}
	
	this.constructEqLinkTable = function(eqLogicId){
		var linkList = eventplanner.eqLink.byEqLogicId(eqLogicId, true);

		// Liste des liens (création des lignes)
		this.modal.find('.eqLinkTable[data-eq-logic-id=' + eqLogicId + ']').empty();
		$.each(linkList, function(thisModal, eqLogicId){
			return function(index, eqLink){
				thisModal.addEqLinkRow(eqLink, eqLogicId);
			}
		}(this, eqLogicId));

		var orientation = eventplanner.eqLogic.byId(eqLogicId).getOrientationByLinkType(3);
		if(orientation !== false){
			var eqLinkData = {
				eqLinkType: 'Orient.',
				eqLinkTargetEqLogicZoneName: orientation + '°'
			};
		
			this.modal.find('.eqLinkTable[data-eq-logic-id=' + eqLogicId + ']').loadTemplate($("#templateEqLinkTable"), eqLinkData, {append: true});
	
		}
	}

	this.addEqLinkRow = function(eqLink, eqLogicId){
		if(eqLink.eqLinkEqLogicId1 == eqLogicId){
			var targetEqLogic = eventplanner.eqLogic.byId(eqLink.eqLinkEqLogicId2, true);
		}else{
			var targetEqLogic = eventplanner.eqLogic.byId(eqLink.eqLinkEqLogicId1, true);
		}
		var eqLinkData = {
				eqLinkId: eqLink.eqLinkId,
				eqLinkType: eventplanner.eqLink.type[eqLink.eqLinkType],
				eqLinkComment: eqLink.eqLinkComment,
				eqLinkTargetEqLogicZoneName: targetEqLogic.zoneName,
				eqLinkTargetEqLogicMatTypeName: targetEqLogic.matTypeName,
				eqLinkTargetEqLogicEqRealName: targetEqLogic.eqRealName,
				eqLinkTargetEqLogicId: targetEqLogic.eqLogicId,
				eqLinkDistance: '(' + eqLink.getDistance() + 'm)'
			};
		
		this.modal.find('.eqLinkTable[data-eq-logic-id=' + eqLogicId + ']').loadTemplate($("#templateEqLinkTable"), eqLinkData, {append: true});
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
	this.newEqLinkId = 0;
	
	this.preShow = function(){
		this.modal.find("#eqLogicMatTypeId").change(this, function(event) {
			event.data.constructAndSelectEqReal();
			event.data.constructAttributeTable();
		});

		if(is_array(this.data.eqLogicLocalisation)){
			this.modal.find("#mapDiv").show();
		}else{
			this.modal.find("#mapDiv").hide();
		}

		this.constructEqLinkTable();
		this.modal.find('#eqLogicForm').delegate('.addEqLinkBtn', 'click', this, function (event) {
				var eqLink = {
					status: 'new',
					eqLinkId: 'new' + event.data.newEqLinkId++,
					eqLinkEqLogicId1: event.data.data.eqLogicId,
					eqLinkEqLogicId2: '0',
					eqLinkType: '1',
					eqLinkEventId: eventplanner.ui.currentUser.userEventId,
					eqLinkConfiguration: {}
				}

				event.data.addEqLinkRow(eqLink);

			});
			
		this.modal.find('.modalValidBtn').click(this, function(event){
			event.data.modal.find('#eqLogicForm').submit();
		});
		
		this.modal.find('.modalDeleteBtn').show().click(this, function(event){
			event.preventDefault();
			
			var eqLogicToRemove = event.data.data;
			bootbox.confirm({
			    message: "<strong>Confirmer la suppression de l'équipement ?</strong>",
			    buttons: {
			        confirm: {
			            label: 'Oui',
			            className: 'btn-success'
			        },
			        cancel: {
			            label: 'Non',
			            className: 'btn-danger'
			        }
			    },
			    callback: function (result) {
			    	if(result){
			    		eqLogicToRemove.remove({
			    			success: function(_data) {
											eventplanner.ui.checkNewMsg();
											eventplanner.ui.notification('success', "Equipement supprimé! ");	
										},
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de supprimer l'équipement.<br>" + _data.message);
							}
			    		});
			    	}
			    }
			});
			event.data.close();
			return false;
		});

		this.modal.find('#eqLogicForm').delegate('.deleteEqLinkBtn', 'click', this, function (event) {
			if($(this).closest('tr').attr('data-status') == 'deleted'){
				if(Number.isInteger(parseInt($(this).closest('tr').attr('data-eq-link-id')))){
					$(this).closest('tr').attr('data-status', 'old');
				}else{
					$(this).closest('tr').attr('data-status', 'new');
				}
				$(this).closest('tr').removeClass('danger');
				$(this).closest('tr').find('select').prop('disabled', false);
			}else{
				$(this).closest('tr').attr('data-status', 'deleted');
				$(this).closest('tr').addClass('danger');
				$(this).closest('tr').find('select').attr('disabled', 'disabled');
			}
		});

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
			this.mapZone = eventplanner.ui.map.initializeEventMap('mapZone' + this.id, this.data.eqLogicEventId, this.data.eqLogicLocalisation);
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
					state: is_array(this.data.eqLogicLocalisation),
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
			
			this.constructAttributeTable();

			this.modal.find('#eqLogicForm').submit(this, function(event) {
				var newEqLogic =  event.data.data.clone();
				
				newEqLogic.eqLogicZoneId = $(this).find("#eqLogicZoneId").val();
			    newEqLogic.eqLogicMatTypeId = $(this).find("#eqLogicMatTypeId").val();
			    newEqLogic.eqLogicEqRealId = $(this).find("#eqLogicEqRealId").val() == "None" ? null : $(this).find("#eqLogicEqRealId").val();
			    newEqLogic.eqLogicComment = $(this).find("#eqLogicComment").val();
			    newEqLogic.eqLogicEqLinks = event.data.getEqLinks();
			    if($(this).find("#eqLocalisation").bootstrapSwitch('state')){
			    	newEqLogic.eqLogicLocalisation = event.data.eqMarker.getLatLng();
			    }else{
			    	newEqLogic.eqLogicLocalisation = null;
			    }

			    newEqLogic.eqLogicAttributes = [];
			    $(this).find(".eqLogicAttribute").each(function(_newEqLogic){
			    	return function(i, eqLogicAttribute){
			    		if($(eqLogicAttribute).find('.eqLogicAttributeValue').val() != ''){
					    	_newEqLogic.eqLogicAttributes.push({
					    		id: $(eqLogicAttribute).attr('data-attribute-id'),
					    		value: $(eqLogicAttribute).find('.eqLogicAttributeValue').val(),
					    		matTypeAttributeId: $(eqLogicAttribute).attr('data-mat-type-attribute-id'),
					    		viewOnPlanning: ($(eqLogicAttribute).find('.eqLogicAttributeViewOnPlanning').bootstrapSwitch('state') ? "1" : "0")
					    	});
					    }
			    	}
			    }(newEqLogic));
				
				
				try{
					newEqLogic.save({
						success: function(thisModal){
									return function(_data) {
										eventplanner.ui.checkNewMsg();
								        thisModal.close();
										eventplanner.ui.notification('success', "Equipement enregistré.");	
									}
								}(event.data),
						error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer l'équipement.<br>" + _data.message);
						  }	
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}

			    return false;
			});
		}
	
	this.getEqLinks = function(){
	    var eqLinkTable = this.modal.find("#eqLinkTable");
	    var eqLinkOldList = eqLinkTable.find("tr[data-status=old]");
	    var eqLinkNewList = eqLinkTable.find("tr[data-status=new]");
	    var eqLinkDeletedList = eqLinkTable.find("tr[data-status=deleted]").not("tr[data-eq-link-id^=new]");
	    
	    var getEqLinkValues = function(jqEqLink){
	    	var eqLinkData = {
	    		eqLinkTargetEqLogicId: $(jqEqLink).find(".eqLinkEqLogicIdSelect").val(),
	    		eqLinkType: $(jqEqLink).find(".eqLinkTypeSelect").val(),
	    		eqLinkComment: $(jqEqLink).find(".eqLinkComment").val()
	    	}

	    	if(Number.isInteger(parseInt($(jqEqLink).attr('data-eq-link-id')))){
	    		eqLinkData.eqLinkId = $(jqEqLink).attr('data-eq-link-id');
	    	}else{
	    		eqLinkData.eqLinkId = '';
	    	}

	    	return eqLinkData;
	    }

	    var eqLinks = {
	    	update: [],
	    	create: [],
	    	del: []
	    }

	    $(eqLinkOldList).each(function(_eqLinks, _getEqLinkValues){
	    		return function(){
		    		_eqLinks.update.push(_getEqLinkValues(this));
		    	}
	    	}(eqLinks, getEqLinkValues)
	    );

	    $(eqLinkNewList).each(function(_eqLinks, _getEqLinkValues){
	    		return function(){
		    		_eqLinks.create.push(_getEqLinkValues(this));
		    	}
	    	}(eqLinks, getEqLinkValues)
	    );

	    $(eqLinkDeletedList).each(function(_eqLinks, _getEqLinkValues){
	    		return function(){
		    		_eqLinks.del.push(_getEqLinkValues(this));
		    	}
	    	}(eqLinks, getEqLinkValues)
	    );

	    return eqLinks;
	}
	
	this.constructAndSelectEqReal = function(){
	  this.modal.find('#eqLogicEqRealId option').remove();
	  
	  this.modal.find('#eqLogicEqRealId').append($("<option></option>")
						.attr("value", 'None')
						.text("Aucun"));

	  this.modal.find("#eqLogicEqRealId").loadTemplate($("#templateEqRealOptions"), eventplanner.eqReal.byMatTypeId(this.modal.find('#eqLogicMatTypeId option:selected').val()), {append: true});
	  this.modal.find('#eqLogicEqRealId option[value="' + this.data.eqLogicEqRealId + '"]').prop('selected', true);
	}

	this.constructEqLinkTable = function(){
		var linkList = eventplanner.eqLink.byEqLogicId(this.data.eqLogicId, true);

		// Liste des liens (création des lignes)
		this.modal.find("#eqLinkTable tbody").empty();
		$.each(linkList, function(thisModal){
			return function(index, eqLink){
				thisModal.addEqLinkRow(eqLink);
			}
		}(this));
	}

	this.addEqLinkRow = function(eqLink){
		if(!eqLink.hasOwnProperty('status')){
			eqLink.status = "old";
		}
		this.modal.find("#eqLinkTable tbody").loadTemplate($("#templateEqConfigurationEqLinkTable"), eqLink, {append: true});

		// Liste des eqLogic (ajout des options aux selects)
		$.each(eventplanner.eqLogic.all(true), function(thisModal, eqLink){
			return function(index, eqLogic){
				if(eqLogic.eqLogicId != thisModal.data.eqLogicId){
					if(!eqLogic.hasOwnProperty('eqRealName')){
						eqLogic.eqRealName = '';
					}
					var eqLogicData = {
						eqLogicId: eqLogic.eqLogicId,
						eqLogicName: eqLogic.zoneName + ' - ' + eqLogic.matTypeName + ' ' + eqLogic.eqRealName
					};

					thisModal.modal.find("tr[data-eq-link-id=" + eqLink.eqLinkId + "] .eqLinkEqLogicIdSelect").loadTemplate($("#templateEqLogicOptions"), eqLogicData, {append: true});
				}
			}
		}(this, eqLink));
		
		// Rangement des options par nom
		var options = this.modal.find("tr[data-eq-link-id=" + eqLink.eqLinkId + "] .eqLinkEqLogicIdSelect option");
		var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
		arr.sort(function(o1, o2) {
		  var t1 = o1.t.toLowerCase(), t2 = o2.t.toLowerCase();

		  return t1 > t2 ? 1 : t1 < t2 ? -1 : 0;
		});
		options.each(function(i, o) {
		  o.value = arr[i].v;
		  $(o).text(arr[i].t);
		});

		// Liste des types (ajout des options aux selects)
		$.each(eventplanner.eqLink.type, function(thisModal, eqLink){
			return function(index, type){
				var typeData = {
					eqLinkTypeId: index,
					eqLinkTypeName: type
				};

				thisModal.modal.find("tr[data-eq-link-id=" + eqLink.eqLinkId + "] .eqLinkTypeSelect").loadTemplate($("#templateEqLinkTypeOptions"), typeData, {append: true});
			}
		}(this, eqLink));

		if(eqLink.eqLinkEqLogicId1 == this.data.eqLogicId){
			var eqLogicId = eqLink.eqLinkEqLogicId2;
		}else{
			var eqLogicId = eqLink.eqLinkEqLogicId1;
		}
		this.modal.find("tr[data-eq-link-id=" + eqLink.eqLinkId + "] .eqLinkEqLogicIdSelect option[value=" + eqLogicId + "]").prop('selected', true);
		this.modal.find("tr[data-eq-link-id=" + eqLink.eqLinkId + "] .eqLinkTypeSelect  option[value=" + eqLink.eqLinkType + "]").prop('selected', true);

	}

	this.constructAttributeTable = function(){
		this.modal.find("#attributs").loadTemplate(this.modal.find("#templateEqConfigurationEqLogicAttribute"), eventplanner.matType.byId(this.modal.find('#eqLogicMatTypeId option:selected').val()).getAllAttributes());
		
		this.modal.find("#attributs .eqLogicAttributeViewOnPlanning").bootstrapSwitch({
			state: false,
			onText: "Oui",
			offText: "Non",
			labelText: "Planning"
		});
		
		this.data.getEqLogicAttributes().forEach(function(thisModal){
			return function(attr){
				var attribute = thisModal.modal.find(".eqLogicAttribute[data-mat-type-attribute-id=" + attr.eqLogicAttributeMatTypeAttributeId + "]");
				
				attribute.attr('data-attribute-id', attr.eqLogicAttributeId);
				attribute.find('.eqLogicAttributeValue').val(attr.eqLogicAttributeValue);
				attribute.find('.eqLogicAttributeViewOnPlanning').bootstrapSwitch('state', !!parseInt(attr.eqLogicAttributeViewOnPlanning));
			}
		}(this));
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
			
			if(this.data.zoneId==''){
				this.modal.find('.eqZoneConf').hide();
			}
			
			this.constructEqTable();
			
			$("#eqTableZone").bind("refreshEqLogicTable", function(thisModal){
				return function() {
					thisModal.constructEqTable();
				}
			}(this));

			this.modal.find("#zoneEventLevelId").loadTemplate($("#templateZoneEventLevel"), eventplanner.eventLevel.all(true), {success: function(thisModal){
				return function() {
					thisModal.modal.find('#zoneEventLevelId option[value="' + thisModal.data.zoneEventLevelId + '"]').prop('selected', true);
				}
			}(this)});
			
			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#zoneForm').submit();
			});
			
			this.modal.find('.modalDeleteBtn').show().click(this, function(event){
				event.preventDefault();
				
				var zoneToDelete = event.data.data;
				bootbox.confirm({
				    message: "<strong>Confirmer la suppression de la zone " + zoneToDelete.zoneName + " ?</strong>",
				    buttons: {
				        confirm: {
				            label: 'Oui',
				            className: 'btn-success'
				        },
				        cancel: {
				            label: 'Non',
				            className: 'btn-danger'
				        }
				    },
				    callback: function (result) {
				    	if(result){
				    		zoneToDelete.remove({
				    			success: function(_data) {
												eventplanner.ui.checkNewMsg();
												eventplanner.ui.notification('success', "Zone supprimée! ");	
											},
								error: function(_data){
									eventplanner.ui.notification('error', "Impossible de supprimer la zone.<br>" + _data.message);
								}
				    		});
				    	}
				    }
				});
	
				event.data.close();
				return false;
			});
			
			this.modal.find('#zoneForm').delegate('.editEqBtn', 'click', this, function (event) {
				var eqId = $(this).attr('data-eq-id');
				
				if(eqId == 'new'){
					try {
					   	var eqLogicItem = new eventplanner.eqLogic.eqLogicItem({
				   			eqLogicDisciplineId: eventplanner.ui.currentUser.userDisciplineId,
							eqLogicZoneId: event.data.data.zoneId,
							eqLogicEventId: eventplanner.ui.currentUser.userEventId
						});
					}
					catch (e) {
					   eventplanner.ui.notification('error', "Impossible de créer l'équipement.<br>" + e.message);
					}
					
					if(eqLogicItem != undefined){
						var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eqLogicItem);
						eqModal.open();
					}
				}else{
					var eqModal = new eventplanner.ui.modal.EpModalEqConfiguration(eventplanner.eqLogic.byId(eqId));
					eqModal.open();
				}
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
				var newZone = event.data.data.clone();
				
				newZone.zoneEventLevelId = $(this).find("#zoneEventLevelId").val();
			    newZone.zoneName = $(this).find("#zoneName").val();
			    newZone.zoneLocalisation = event.data.zoneMarker.getLatLng();
			    newZone.zoneInstallDate = formatDateDmy2Ymd($(this).find("#zoneInstallDate").val());
			    newZone.zoneUninstallDate = formatDateDmy2Ymd($(this).find("#zoneUninstallDate").val());
			    newZone.zoneComment = $(this).find("#zoneComment").val();
				
				try{
					newZone.save({
					      success: function(thisModal){
								return function(_data) {
									eventplanner.ui.checkNewMsg();
									if(thisModal.data.zoneId==""){
										thisModal.data.zoneId = _data.zoneId;
										thisModal.modal.find('.eqZoneConf').show();
									}else{
										thisModal.close();
									}
									eventplanner.ui.notification('success', "Zone enregistrée.");	
								}
							}(event.data),
						  error: function(_data){
					        eventplanner.ui.notification('error', "Impossible d'enregistrer la zone.<br>" + _data.message);
					      }			  
					    });
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
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
			
			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#eventForm').submit();
			});
			
			this.modal.find('#eventForm').submit(this, function(event) {
				var newEvent = event.data.data.clone();
				
				newEvent.eventName = $(this).find("#eventName").val();
			    newEvent.eventVille = $(this).find("#eventVille").val();				
			    newEvent.eventLocalisation = event.data.eventMarker.getLatLng();
			    newEvent.eventStartDate = formatDateDmy2Ymd($(this).find("#eventStartDate").val());
			    newEvent.eventEndDate = formatDateDmy2Ymd($(this).find("#eventEndDate").val());
				
				try{
					newEvent.save({
					      success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Evenement enregistré.");	
										}
									}(event.data),
						  error: function(_data){
					        eventplanner.ui.notification('error', "Impossible d'enregistrer l'événement.<br>" + _data.message);
					      }			  
					    });
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
			    return false;
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
			this.modal.find("#eqRealMatTypeId").loadTemplate(this.modal.find("#templateEqMatTypeOptions"), eventplanner.matType.all(), {
				success: function(thisModal){
					return function() {
						thisModal.modal.find('#eqRealMatTypeId option[value="' + thisModal.data.eqRealMatTypeId + '"]').prop('selected', true);
					}
				}(this)
			});
			
			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#eqRealForm').submit();
			});
			
			this.modal.find('#eqRealForm').submit(this, function(event) {
				var newEqReal = event.data.data.clone();
				
				newEqReal.eqRealMatTypeId = $(this).find("#eqRealMatTypeId").val();
			    newEqReal.eqRealName = $(this).find("#eqRealName").val();
			    newEqReal.eqRealComment = $(this).find("#eqRealComment").val();
				
				try{
					newEqReal.save({
					      success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Matériel enregistré.");	
										}
									}(event.data),
						  error: function(_data){
					        eventplanner.ui.notification('error', "Impossible d'enregistrer le matériel.<br>" + _data.message);
					      }			  
					    });
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}

			    return false;
			});
		}
	
	this.postShow = function(){}
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
		// ZONES
		this.modal.find("#missionZoneSelect").loadTemplate($("#templateZoneOptions"), eventplanner.zone.all());
		$.each(this.data.getZones(), function(thisModal){
			return function(i,item){
				thisModal.modal.find("#missionZoneList").loadTemplate($("#templateMissionZoneOption"),item, {append: true});
				thisModal.modal.find('#missionZoneSelect option[value=' + item.zoneId + ']').remove();
			}
		}(this));
		
		this.sortList(this.modal.find(".missionZoneItem"), this.modal.find("#missionZoneList"));
		this.sortList(this.modal.find("#missionZoneSelect option"), this.modal.find("#missionZoneSelect"));

		this.modal.find(".addZoneOptionBtn").click(this, function(event){
			var zoneId = event.data.modal.find("#missionZoneSelect").val();
			if(typeof eventplanner.zone.byId(zoneId) === "object"){
				event.data.modal.find("#missionZoneList").loadTemplate($("#templateMissionZoneOption"), eventplanner.zone.byId(zoneId), {append: true});
				event.data.modal.find('#missionZoneSelect option[value=' + zoneId + ']').remove();
				event.data.sortList(event.data.modal.find(".missionZoneItem"), event.data.modal.find("#missionZoneList"));
			}
		});

		this.modal.find("#missionZoneList").delegate('.deleteZoneOptionBtn', 'click', this, function (event) {
			event.preventDefault();
			
			var zoneId = $(this).closest('.list-group-item').attr('data-zone-id');
			$(this).closest('.list-group-item').remove();
			event.data.modal.find("#missionZoneSelect").loadTemplate($("#templateZoneOptions"),eventplanner.zone.byId(zoneId), {append: true});
			event.data.sortList(event.data.modal.find("#missionZoneSelect option"), event.data.modal.find("#missionZoneSelect"));
		});

		// USERS
		this.modal.find("#missionUserSelect").loadTemplate($("#templateUserOptions"), eventplanner.user.all());
		$.each(this.data.getUsers(), function(thisModal){
			return function(i,item){
				thisModal.modal.find("#missionUserList").loadTemplate($("#templateMissionUserOption"),item, {append: true});
				thisModal.modal.find('#missionUserSelect option[value=' + item.userId + ']').remove();				
			}
		}(this));
		this.sortList(this.modal.find(".missionUserItem"), this.modal.find("#missionUserList"));
		this.sortList(this.modal.find("#missionUserSelect option"), this.modal.find("#missionUserSelect"));

		this.modal.find(".addUserOptionBtn").click(this, function(event){
			var userId = event.data.modal.find("#missionUserSelect").val();
			if(typeof eventplanner.user.byId(userId) === "object"){
				event.data.modal.find("#missionUserList").loadTemplate($("#templateMissionUserOption"), eventplanner.user.byId(userId), {append: true});
				event.data.modal.find('#missionUserSelect option[value=' + userId + ']').remove();
				event.data.sortList(event.data.modal.find(".missionUserItem"), event.data.modal.find("#missionUserList"));
				if((event.data.modal.find('.missionUserItem').length > 0) && (event.data.modal.find('#stateSelect').val() == '400')){
					 event.data.modal.find('#stateSelect option[value="401"]').prop('selected', true);
				}
			}
		});

		this.modal.find("#missionUserList").delegate('.deleteUserOptionBtn', 'click', this, function (event) {
			event.preventDefault();
			
			var userId = $(this).closest('.list-group-item').attr('data-user-id');
			$(this).closest('.list-group-item').remove();
			event.data.modal.find("#missionUserSelect").loadTemplate($("#templateUserOptions"),eventplanner.user.byId(userId), {append: true});
			event.data.sortList(event.data.modal.find("#missionUserSelect option"), event.data.modal.find("#missionUserSelect"));
			if((event.data.modal.find('.missionUserItem').length == 0) && (event.data.modal.find('#stateSelect').val() == '401')){
				event.data.modal.find('#stateSelect option[value="400"]').prop('selected', true);
			}
		});

		// ETATS
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
		
		this.modal.find('.modalValidBtn').click(this, function(event){
			event.data.modal.find('#missionForm').submit();
		});
		
		this.modal.find('#missionForm').submit(this, function(event) {
			var newMission = event.data.data.clone();
			
			newMission.missionName = $(this).find("#missionName").val();
			newMission.missionComment = $(this).find("#missionComment").val();
			newMission.missionState = $(this).find("#stateSelect").val();
			newMission.missionUsers = [];
			$(this).find('.missionUserItem')
		    	.each(function(_newMission){
			    	return function(i, _userItem){ 
			    		_newMission.missionUsers.push($(_userItem).attr("data-user-id"));
			    	}
			    }(newMission));
			newMission.missionZones = [];
			$(this).find('.missionZoneItem')
		    	.each(function(_newMission){
			    	return function(i, _zoneItem){ 
			    		_newMission.missionZones.push($(_zoneItem).attr("data-zone-id"));
			    	}
			    }(newMission));
			
			try{
				newMission.save({
					  success: function(thisModal){
									return function(_data) {
										eventplanner.ui.checkNewMsg();
										thisModal.close();
										eventplanner.ui.notification('success', "Mission enregistrée.");	
									}
								}(event.data),
					  error: function(_data){
						eventplanner.ui.notification('error', "Impossible d'enregistrer la mission.<br>" + _data.message);
					  }			  
					});
			}catch(e){
				eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
			}

		    return false;
		});
	}
	
	this.postShow = function(){}

	this.sortList = function(itemList, container){		
		var newDivOrder = itemList.sort(function (a, b) {
			
			// Récupération des valeurs souhaitées pour le tri:
			var contentA = $(a).text().toLowerCase();
			var contentB = $(b).text().toLowerCase();
			
			return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
		});
		
		container.empty();
		container.append(newDivOrder);
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
			this.modal.find("#matTypeParentId").loadTemplate(this.modal.find("#templateMatTypeParentOption"), eventplanner.matType.all(), {append: true});
			if(this.data.matTypeId != ''){
				this.modal.find('#matTypeParentId option[value=' + this.data.matTypeId + ']').attr('disabled','disabled')
			}
			this.modal.find('#matTypeParentId').val(this.data.matTypeParentId);

			this.data.getAttributes().forEach(function(attribute){
	    		this.modal.find("#attributesList").loadTemplate(this.modal.find("#templateMatTypeAttribute"), attribute, {prepend: true});
	    	}, this);

	    	this.modal.find(".addAttributeBtn").click(this, function(event){
	    		var attrName = event.data.modal.find("#addAttributeName").val();
	    		var newDiv = $("<div>").loadTemplate(event.data.modal.find("#templateMatTypeAttribute"), {matTypeAttributeId: '', matTypeAttributeName: attrName});
	    		$(this).closest('.list-group-item').before(newDiv.contents());
	    		event.data.modal.find("#addAttributeName").val("");
	    	});
	    	
	    	this.modal.find(".deleteAttributeBtn").click(this, function(event){
	    		$(this).closest('.list-group-item').remove();
	    	});
	    	
	    	this.addParentAttribute(this.data.matTypeParentId);

	    	this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#matTypeForm').submit();
			});
			
			this.modal.find('#matTypeForm').submit(this, function(event) {
				var newMatType = event.data.data.clone();
				
				newMatType.matTypeName = $(this).find("#matTypeName").val();
			    newMatType.matTypeParentId = $(this).find("#matTypeParentId").val() == "" ? null : $(this).find("#matTypeParentId").val();
				newMatType.matTypeAttributes = [];					
				$(this).find(".matTypeAttributeItem").each(function(_newMatType){
			    	return function(i, matTypeAttributeItem){
				    	_newMatType.matTypeAttributes.push({
				    		id: $(matTypeAttributeItem).attr('data-attribute-id'),
				    		name: $(matTypeAttributeItem).find('input').val(),
				    		options: {default: ""}
				    	});
			    	}
			    }(newMatType));
				
				try{
					newMatType.save({
						  success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
											thisModal.close();
											eventplanner.ui.notification('success', "Type de matériel enregistré.");	
										}
									}(event.data),
						  error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer le type de matériel.<br>" + _data.message);
						  }			  
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
			    return false;
			});	
		}
	
	this.postShow = function(){}
	
	this.addParentAttribute = function(parentId){
		if(parentId != null){
			var parentMatType = eventplanner.matType.byId(parentId);
			
			parentMatType.getAttributes().forEach(function(attribute){
				this.modal.find("#attributesList").loadTemplate(this.modal.find("#templateMatTypeAttributeParent"), $.extend({}, parentMatType, attribute), {prepend: true});
			}, this);
			
			this.addParentAttribute(parentMatType.matTypeParentId);
		}
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
			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#userForm').submit();
			});
		}
	
	this.postShow = function(){
			this.modal.find("#userEnable")
				.bootstrapSwitch({
					state: !!parseInt(this.data.userEnable),
					onText: "Oui",
					offText: "Non"
				})

			this.modal.find('#userForm').submit(this, function(event) {
				var newUser = event.data.data.clone();
				
				newUser.userLogin = $(this).find("#userLogin").val();
			    newUser.userName = $(this).find("#userName").val();
				newUser.userEnable = ($(this).find("#userEnable").bootstrapSwitch('state') ? "1" : "0");
				if(newUser.userId == ''){
			    	newUser.userPassword = newUser.userLogin;
			    }
				
				try{
					newUser.save({
						  success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
											thisModal.close();
											eventplanner.ui.notification('success', "Utilisateur enregistré.");	
										}
									}(event.data),
						  error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer l'utilisateur.<br>" + _data.message);
						  }			  
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
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

/// MODAL Contact CONFIGURATION ///////////////
eventplanner.ui.modal.EpModalContactConfiguration = function(_contact){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un contact", "contactConfiguration");
	
	this.data = _contact;
	
	this.preShow = function(){
			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#contactForm').submit();
			});

			this.modal.find("#contactZoneId").loadTemplate($("#templateContactZoneOptions"), eventplanner.zone.all(true), {success: function(thisModal){
				return function() {
					thisModal.modal.find('#contactZoneId option[value="' + thisModal.data.contactZoneId + '"]').prop('selected', true);
				}
			}(this)});
		}
	
	this.postShow = function(){
			this.modal.find('#contactForm').submit(this, function(event) {
				var newContact = event.data.data.clone();
				
				newContact.contactName = $(this).find("#contactName").val();
			    newContact.contactFct = $(this).find("#contactFct").val();
			    newContact.contactZoneId = $(this).find("#contactZoneId").val();
				newContact.contactCoord = [];
				$(this).find(".contactCoord").each(function(_newContact){
			    	return function(i, contactCoord){
			    		if($(contactCoord).val() != ''){
					    	_newContact.contactCoord.push({
					    		type: $(contactCoord).attr('data-coord-type'),
					    		value: $(contactCoord).val()
					    	});
					    }
			    	}
			    }(newContact));
				
				try{
					newContact.save({
						  success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
											thisModal.close();
											eventplanner.ui.notification('success', "Contact enregistré.");	
										}
									}(event.data),
						  error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer le contact.<br>" + _data.message);
						  }			  
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
			    return false;
			});
		}
}

eventplanner.ui.modal.EpModalContactConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalContactConfiguration,
        enumerable: false,
        writable: true,
        configurable: true
    }
});


/// MODAL Plan CONFIGURATION ///////////////
eventplanner.ui.modal.EpModalPlanConfiguration = function(_plan){
	eventplanner.ui.modal.EpModal.call(this, "Configuration d'un plan", "planConfiguration");
	
	this.data = _plan;
	this.bounds = this.data.planBounds;
	
	this.preShow = function(){
			if(this.data.planId == ""){
				this.modal.find('.planFileUpload').hide();
				this.modal.find('.planMap').hide();
			}else{
				this.initUpload();
			}
			this.modal.find('.progress').hide();

			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#planForm').submit();
			});		

			this.modal.find('#generateTiles').click(this, function(event){
				var planParam = {
			        id: event.data.data.planId,
			        bounds: event.data.data.planBounds
			        };
		
			    eventplanner.plan.generateTiles({
			      plan: planParam,
			      success: function(_data) {
								eventplanner.ui.notification('success', "Demande de génération des tuiles OK. Voir l'onglet 'Journaux' pour suivre l'avancement.");	
							},
				  error: function(_data){
						        eventplanner.ui.notification('error', "Impossible de lancer la génération des tuiles..<br>" + _data.message);
						    }
			    });

				return false;
			});

			if(!is_array(this.bounds) || !is_array(this.bounds[0]) || !is_array(this.bounds[1]) || !is_array(this.bounds[2])){
				var currentEvent = eventplanner.ui.currentUser.getEvent();
				
				this.bounds = [
					{
						lat: currentEvent.eventLocalisation.lat + (180/Math.PI)*(100/6378137), 
						lng: currentEvent.eventLocalisation.lng + (180/Math.PI)*(-100/6378137)/Math.cos(Math.PI/180.0*currentEvent.eventLocalisation.lat)
					},
					{
						lat:currentEvent.eventLocalisation.lat + (180/Math.PI)*(100/6378137), 
						lng: currentEvent.eventLocalisation.lng + (-180/Math.PI)*(-100/6378137)/Math.cos(Math.PI/180.0*currentEvent.eventLocalisation.lat)
					},
					{
						lat:currentEvent.eventLocalisation.lat + (180/Math.PI)*(-100/6378137), 
						lng: currentEvent.eventLocalisation.lng + (-180/Math.PI)*(100/6378137)/Math.cos(Math.PI/180.0*currentEvent.eventLocalisation.lat)
					}
				];
			}
		}
	
	this.postShow = function(){
		this.initMap();
		this.addPlanLayer();
		this.reloadLog();	

		this.modal.find('#planForm').submit(this, function(event) {
				var newPlan = event.data.data.clone();
				
				newPlan.planName = $(this).find("#planName").val();
				newPlan.planBounds = event.data.bounds;
				
				try{
					newPlan.save({
						  success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
											if(thisModal.data.planId==""){
												thisModal.data.planId = _data.planId;
												thisModal.initUpload();
											}else{
												thisModal.close();
											}
											eventplanner.ui.notification('success', "Plan enregistré.");	
										}
									}(event.data),
						  error: function(_data){
							eventplanner.ui.notification('error', "Impossible d'enregistrer le plan.<br>" + _data.message);
						  }			  
						});
				}catch(e){
					eventplanner.ui.notification('error', "Probléme lors de l'enregistrement.<br>" + e.message);
				}
				
			    return false;
			});
	}

	this.initUpload = function(){
		this.modal.find('.planFileUpload').show();
		this.modal.find('#planFile').fileupload({
			    acceptFileTypes: '/(\.|\/)(pdf|jpg)$/i',
			    dataType: 'json',
			    replaceFileInput: false,
			    url: 'core/ajax/ajax.php',
			    formData:{ 
			    	eventplanner_token: EVENTPLANNER_AJAX_TOKEN,
			    	type: 'plan',
			    	action: 'uploadPlanFile',
			    	planId: this.data.planId
			    },
			    done: function(thisModal){
				    	return function (e, data) {
				        if (data.result.state != 'ok') {
				            eventplanner.ui.notification('error', "Impossible d'enregistrer le Plan.<br>" + data.result.result);
				            return;
				        }else{
				        	eventplanner.ui.notification('success', "Fichier transféré.");
							thisModal.modal.find('.planMap').show();
							thisModal.eventMapPlanConfig.invalidateSize();
							thisModal.addPlanLayer();
				        }
				    }
			    }(this),
			    start: function(thisModal){
			        	return function (e) {
				            var progress = 0;
				            thisModal.modal.find('.progress').show();
				            thisModal.modal.find('#progress .progress-bar').css(
				                'width',
				                progress + '%'
				            );
				        }
				    }(this),
		        progressall: function(thisModal){
			        	return function (e, data) {
				            var progress = parseInt(data.loaded / data.total * 100);
				            thisModal.modal.find('#progress .progress-bar').css(
				                'width',
				                progress + '%'
				            );
				        }
				    }(this)
			});
	}
	
	this.initMap = function(){
		var currentEvent = eventplanner.ui.currentUser.getEvent();
		
		this.eventMapPlanConfig = eventplanner.ui.map.initialiseMap('mapPlanConfig' + this.id, currentEvent.eventLocalisation, 18);
	}

	this.addPlanLayer = function(){
		// Test si le plan existe déjà en LD
	    var http = new XMLHttpRequest();
	    http.open('HEAD', "./ressources/eventPlan/" + this.data.planId + "/planLD.jpg", false);
	    http.send();
	    
	    if(http.status!=404){
	    	var icon = L.AwesomeMarkers.icon({icon: '',markerColor: 'red'});

			this.marker1 = L.marker(this.bounds[0], {draggable: true, icon: icon, title:'Haut gauche'}).addTo(this.eventMapPlanConfig);
			this.marker2 = L.marker(this.bounds[1], {draggable: true, icon: icon, title:'Haut droite'}).addTo(this.eventMapPlanConfig);
			this.marker3 = L.marker(this.bounds[2], {draggable: true, icon: icon, title:'Bas gauche'}).addTo(this.eventMapPlanConfig);

			this.marker1.on('drag dragend', this.repositionImageFct);
			this.marker2.on('drag dragend', this.repositionImageFct);
			this.marker3.on('drag dragend', this.repositionImageFct);
			
	    	this.overlay = L.imageOverlay.rotated("./ressources/eventPlan/" + this.data.planId + "/planLD.jpg", this.marker1.getLatLng() ,  this.marker2.getLatLng() ,  this.marker3.getLatLng() , {
			    opacity: 0.4,
			    interactive: true
			});
			this.eventMapPlanConfig.addLayer(this.overlay);

			return true;
	    }

		return false;
	}

	this.reloadLog = function(){
		this.modal.find('#planLogContainer').load('ressources/eventPlan/' + this.data.planId + '/log.txt');

		setTimeout(function(thisModal){
				return function(){
					if(thisModal.modal.hasClass('in')){
						thisModal.reloadLog();
					}
				}
		}(this), 5000);
		
	}
	
	this.repositionImageFct = function(thisModal) {
		return function(){
			thisModal.overlay.reposition(thisModal.marker1.getLatLng(), thisModal.marker2.getLatLng(), thisModal.marker3.getLatLng());

			thisModal.bounds = [
					thisModal.marker1.getLatLng(),
					thisModal.marker2.getLatLng(),
					thisModal.marker3.getLatLng()
				];
		}
	}(this);
}

eventplanner.ui.modal.EpModalPlanConfiguration.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalPlanConfiguration,
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
			
			this.listId.forEach(function(thisModal){
				return function(id) {
				  var objectTo = eventplanner[thisModal.type].byId(id, true);
				  var name = '';
				  var typeName = '';
				  
				  switch(thisModal.type){
				  	case 'eqLogic':
				  		typeName = 'Equipement';
				  		name = (objectTo.zoneName||'') + ' - ' + (objectTo.matTypeName||'') + ' ' + (objectTo.eqRealName||''); 
				  	break;
				  	case 'eqReal':
				  		typeName = 'Matériel';
				  		name = (objectTo.eqRealName||''); 
				  	break;
				  	case 'zone':
				  		typeName = 'Zone';
				  		name = (objectTo.zoneName||''); 
				  	break;
				  	case 'mission':
				  		typeName = 'Mission';
				  		name = (objectTo.missionName||''); 
				  	break;
				  }
				  
				  thisModal.modal.find('#stateToList').loadTemplate(
				  	thisModal.modal.find("#templateStateTo"),
				  	{
				  		name:name,
				  		typeName:typeName
				  	} , 
				  	{
				  		append: true
				  	}
				  );
				}	
			}(this));
			
			// ZONE: Application de l'état aux eqLogic automatiquement
			this.modal.find("#eqLogicStateSwitch")
				.bootstrapSwitch({
					state: false,
					onText: "Oui",
					offText: "Non"
				})
			
			if((this.type == 'zone') && (eventplanner.ui.STATE.stateList[this.modal.find("#stateSelect").val()].hasOwnProperty('eqLogicState'))){
				this.modal.find(".zoneEqlogicState").show();
				this.modal.find(".zoneEqLogicState").html(eventplanner.ui.STATE.stateList[eventplanner.ui.STATE.stateList[this.modal.find("#stateSelect").val()].eqLogicState].text);				
			}else{
				this.modal.find(".zoneEqlogicState").hide();
			}
			
			this.modal.find("#stateSelect").change(this, function(event){
					if((event.data.type == 'zone') && (eventplanner.ui.STATE.stateList[event.data.modal.find("#stateSelect").val()].hasOwnProperty('eqLogicState'))){
						event.data.modal.find(".zoneEqlogicState").show();
						event.data.modal.find(".zoneEqLogicState").html(eventplanner.ui.STATE.stateList[eventplanner.ui.STATE.stateList[event.data.modal.find("#stateSelect").val()].eqLogicState].text);				
					}else{
						event.data.modal.find(".zoneEqlogicState").hide();
					}
				}
			);
						
			this.modal.find('.modalValidBtn').click(this, function(event){
				event.data.modal.find('#stateForm').submit();
			});
			
			this.modal.find('#stateForm').submit(this, function(event) {
				var newState = $(this).find("#stateSelect").val();

			    switch(event.data.type){
			    	case 'eqLogic':
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
								eventplanner.ui.notification('error', "Impossible de modifier l'état.<br>" + _data.message);
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
								eventplanner.ui.notification('error', "Impossible de modifier l'état.<br>" + _data.message);
							}	
							});
			    	break;

			    	case 'zone':
			    		eventplanner.zone.updateState({
							listId: event.data.listId,
							state: newState,
							eqLogicState: ($(this).find("#eqLogicStateSwitch").bootstrapSwitch('state') ? "1" : "0"),
							success: function(thisModal){
										return function(_data) {
											eventplanner.ui.checkNewMsg();
									        thisModal.close();
											eventplanner.ui.notification('success', "Etat modifié.");	
										}
									}(event.data),
							error: function(_data){
								eventplanner.ui.notification('error', "Impossible de modifier l'état.<br>" + _data.message);
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
								eventplanner.ui.notification('error', "Impossible de modifier l'état.<br>" + _data.message);
							}	
							});
			    	break;
			    }
			    return false;
			});
		}
	
	this.postShow = function(){}
}

eventplanner.ui.modal.EpModalState.prototype = Object.create(eventplanner.ui.modal.EpModal.prototype, {
    constructor: {
        value: eventplanner.ui.modal.EpModalState,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
