$( document ).ready(function() {
	eventplanner.user.isConnect(
		{success: function(_data){
			// Enregistrement de l'utilisateur.
			eventplanner.ui.currentUser = new eventplanner.user.userItem(_data);
			$.when(eventplanner.ui.init()).then(function (){

				$('#epOrganisationMenu').html(eventplanner.ui.currentUser.getDiscipline().getOrganisation().organisationName);
				$('#epUserMenu').html(eventplanner.ui.currentUser.userName);
				
				var page = getUrlParameter("p");
				var lastPage = localStorage.getItem('lastPage');
				
				if(page != false){
					if(eventplanner.ui.hasOwnProperty(page) && eventplanner.ui[page].hasOwnProperty('init')){
						if(page == 'scan'){
							var option = {id: getUrlParameter('id')};
						}else{
							var option = {};
						}
						eventplanner.ui.loadPage(page, option);
					}else{
						if(lastPage != null){
							eventplanner.ui.loadPage(lastPage);
						}else{
							eventplanner.ui.loadPage("dashboard");
						}
					}
				}else{
					if(lastPage != null){
						eventplanner.ui.loadPage(lastPage);
					}else{
						eventplanner.ui.loadPage("dashboard");
					}
				}
			});
		},
		error: function(_data){
			eventplanner.ui.notification('warning', _data.message);
		}
	});
});

$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

$.tablesorter.themes.bootstrap = {
		    table        : 'table  table-bordered table-striped table-condensed',
		    caption      : 'caption',
		    header       : 'bootstrap-header',
		    iconSortNone : 'bootstrap-icon-unsorted',
		    iconSortAsc  : 'glyphicon glyphicon-chevron-up',
		    iconSortDesc : 'glyphicon glyphicon-chevron-down',
		  };

$.addTemplateFormatter("getConfigurationKey", function(value, template) {
	if(is_object(value) && value.hasOwnProperty(template)){
    	return value[template];
    }else{
    	return "";
    }
});

$.addTemplateFormatter("JSONStringify", function(value, template) {
    return JSON.stringify(value);
});

$.addTemplateFormatter("prepend", function(value, template) {
	if(value == undefined){
		value = "";
	}
    return template.toString() + value.toString();
});

$.addTemplateFormatter("append", function(value, template) {
    return value.toString() + template.toString();
});

function formatState(state){
	if(eventplanner.ui.STATE.stateList.hasOwnProperty(state)){
		return eventplanner.ui.STATE.stateList[state].text;
	}else{
		return eventplanner.ui.STATE["default"].text;
	}
}
$.addTemplateFormatter("formatState", function(value, template) {
    return formatState(value);
});

function formatStateColorClass(state){
	if(eventplanner.ui.STATE.stateList.hasOwnProperty(state)){
		return eventplanner.ui.STATE.stateList[state].colorClass;
	}else{
		return eventplanner.ui.STATE["default"].colorClass;
	}
}
$.addTemplateFormatter("formatStateColorClass", function(value, template) {
	if(template == undefined){
		template = "";
	}else{
		if(template.substring(template.length-1, template.length) != " "){
			template = template + "-";
		}		
	}
	
	var colorClass = formatStateColorClass(value);
	
	// cas particuliers...
	if(colorClass=="active" && template.substring(template.length-6, template.length)=="label-"){
		colorClass="default";
	}
	
    return template + colorClass;
});

function formatDateMsg(date){
	if(date != null){
		var d = new Date(date.replace(' ', 'T')),
		        month = '' + (d.getMonth() + 1).toString(),
                day = '' + d.getDate().toString(),
                year = d.getFullYear().toString(),
                hr = '' + d.getHours().toString(),
                min = d.getMinutes().toString(),
                sec = d.getSeconds().toString();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            if (hr.length < 2) hr = '0' + hr;
            if (min.length < 2) min = '0' + min;
            if (sec.length < 2) sec = '0' + sec;

		var days = ["Dimanche","Lundi","Mardi", "Mercredi","Jeudi","Vendredi","Samedi"];
		return days[d.getDay()] + " " + day + '/' + month + ' ' + hr + ':' + min + ':' + sec;
	}else{
		return '';
	}
}
$.addTemplateFormatter("formatDateMsg", function(value, template) {
    return formatDateMsg(value);
});

function formatList(list, template, itemName){
	var items = "";
	if(is_array(list)){
		$.each(list, function( index, item ) {
		  itemToAdd = $(template);
	
		  if(itemName != ''){
		  	itemToAdd.text(item[itemName]);
		  }else{
		  	itemToAdd.text(item);
		  }
	
		  items += itemToAdd.prop('outerHTML') + ' ';
		});
	}
	return items;
}
$.addTemplateFormatter("formatList", function(list, template) {
    return formatList(list, template, '');
});
$.addTemplateFormatter("formatMsgContent", function(msgId, templateId) {
	var msg = eventplanner.msg.byId(msgId);

	if(msg.msgContent.hasOwnProperty('type')){
		return $('<div>').loadTemplate($('.' + templateId + '[msg-content-type=' + msg.msgContent.type + ']'), msg.msgContent).html();
	}else{
		return msg.msgContent;
	}    
});
$.addTemplateFormatter("formatMissionUsers", function(missionId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), [eventplanner.mission.byId(missionId).getUsers()]).html();
});
$.addTemplateFormatter("formatMissionZones", function(missionId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), [eventplanner.mission.byId(missionId).getZones()]).html();
});
$.addTemplateFormatter("formatContactCoord", function(contactId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), eventplanner.contact.byId(contactId).contactCoord).html();
});
$.addTemplateFormatter("contactCoord", function(contactId, coordType) {
    var result = "";
    var contact = eventplanner.contact.byId(contactId);

    if(contact){
    	contact.contactCoord.forEach(function(coord){
	    	if(coord.type == coordType){
	    		result = coord.value;
	    	}
	    });
    }
    
    return result;
});
$.addTemplateFormatter("formatEqLogicAttributes", function(eqLogicId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), eventplanner.eqLogic.byId(eqLogicId).getEqLogicAttributes(true)).html();
});
$.addTemplateFormatter("formatEqLogicAttributesForPlanning", function(eqLogicId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), eventplanner.eqLogic.byId(eqLogicId).getEqLogicAttributesForPlanning(true)).html();
});

$.addTemplateFormatter("formatEqLogicEqLink", function(eqLogicId, templateId) {
	var linkList = eventplanner.eqLink.byEqLogicId(eqLogicId, true);
	var eqLinkDataList = [];
	
	linkList.forEach(function(eqLink){
		if(eqLink.eqLinkEqLogicId1 == eqLogicId){
			var targetEqLogic = eventplanner.eqLogic.byId(eqLink.eqLinkEqLogicId2, true);
		}else{
			var targetEqLogic = eventplanner.eqLogic.byId(eqLink.eqLinkEqLogicId1, true);
		}
		
		eqLinkDataList.push({
				eqLinkId: eqLink.eqLinkId,
				eqLinkType: eventplanner.eqLink.type[eqLink.eqLinkType],
				eqLinkComment: eqLink.eqLinkComment,
				eqLinkTargetEqLogicZoneName: targetEqLogic.zoneName,
				eqLinkTargetEqLogicMatTypeName: targetEqLogic.matTypeName,
				eqLinkTargetEqLogicEqRealName: targetEqLogic.eqRealName,
				eqLinkTargetEqLogicId: targetEqLogic.eqLogicId
			});
	});

    return $('<div>').loadTemplate($('#' + templateId), eqLinkDataList).html();
});


function formatDateYmd2Dmy(date){
	return date.split("-").reverse().join("/");
}
$.addTemplateFormatter("formatDateYmd2Dmy", function(value, template) {
    return formatDateYmd2Dmy(value);
});

function formatDateDmy2Ymd(date){
	return date.split("/").reverse().join("-");
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
    return false;
}

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

/**
 * Retourne une fonction qui, tant qu'elle continue à être invoquée,
 * ne sera pas exécutée. La fonction ne sera exécutée que lorsque
 * l'on cessera de l'appeler pendant plus de N millisecondes.
 * Si le paramètre `immediate` vaut vrai, alors la fonction 
 * sera exécutée au premier appel au lieu du dernier.
 * Paramètres :
 *  - func : la fonction à `debouncer`
 *  - wait : le nombre de millisecondes (N) à attendre avant 
 *           d'appeler func()
 *  - immediate (optionnel) : Appeler func() à la première invocation
 *                            au lieu de la dernière (Faux par défaut)
 *  - context (optionnel) : le contexte dans lequel appeler func()
 *                          (this par défaut)
 */
function debounce(func, wait, immediate, context) {
    var result;
    var timeout = null;
    return function() {
        var ctx = context || this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) result = func.apply(ctx, args);
        };
        var callNow = immediate && !timeout;
        // Tant que la fonction est appelée, on reset le timeout.
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(ctx, args);
        return result;
    };
}
