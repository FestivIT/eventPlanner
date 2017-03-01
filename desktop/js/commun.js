$( document ).ready(function() {
	eventplanner.user.isConnect(
		{success: function(_data){
			$.when(eventplanner.ui.init()).then(function (){
				var page = getUrlParameter("p");
				if(page != false){
					if(eventplanner.ui.hasOwnProperty(page) && eventplanner.ui[page].hasOwnProperty('init')){
						if(page == 'scan'){
							var option = {id: getUrlParameter('id')};
						}else{
							var option = {};
						}
						eventplanner.ui.loadPage(page, option);
					}else{
						eventplanner.ui.loadPage("dashboard");
					}
				}else{
					eventplanner.ui.loadPage("dashboard");
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
		var theDate = new Date(date.replace(' ', 'T'));
		var days = ["Dimanche","Lundi","Mardi", "Mercredi","Jeudi","Vendredi","Samedi"];
		return days[theDate.getDay()] + " " + theDate.getDate() + '/' + (theDate.getMonth() + 1) + ' ' + theDate.getHours() + ':' + theDate.getMinutes();
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

$.addTemplateFormatter("formatMissionUsers", function(missionId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), [eventplanner.mission.byId(missionId).getUsers()]).html();
});
$.addTemplateFormatter("formatMissionZones", function(missionId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), [eventplanner.mission.byId(missionId).getZones()]).html();
});
$.addTemplateFormatter("formatContactCoord", function(contactId, templateId) {
    return $('<div>').loadTemplate($('#' + templateId), eventplanner.contact.byId(contactId).contactCoord).html();
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
