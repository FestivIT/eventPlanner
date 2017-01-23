eventplanner.eqLogic = {
    dataReady: $.Deferred(),
    container: {},
    

    // Chargement initial des données depuis le serveur
    load: function(){
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.eqLogic.container[element.eqLogicId] = element;
                });

                eventplanner.eqLogic.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
        paramsAJAX.data = {
            action: 'all'
        };
        $.ajax(paramsAJAX);

        return eventplanner.eqLogic.dataReady;
    },

    // enregistrement d'un eqLogic
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['eqLogic'];
        var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.eqLogic.updateData(_data.result);
                    //eventplanner.msg.lastMsgDate = _data.date;
                }
                return _data;
            }
        };

        try {
            eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
        } catch (e) {
            (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
            return;
        }

        var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            eqLogic: json_encode(_params.eqLogic)
        };
        return $.ajax(paramsAJAX);
    },
    
    updateState: function(_params) {
	    var paramsRequired = ['listId','state'];
	    var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.eqLogic.updateData(_data.result);
                    //eventplanner.msg.lastMsgDate = _data.date;
                }
                return _data;
            }
        };
	
	    try {
	        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
	    } catch (e) {
	        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
	        return;
	    }
	
	    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
	    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
	    paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
	    paramsAJAX.data = {
	        action: 'updateState',
	        listId: json_encode(_params.listId),
	        state: _params.state
	    };
	    return $.ajax(paramsAJAX);
	},

    updateData: function(_data){
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqLogicId')){
                this.container[_data.eqLogicId] = _data;
            }           
        }else{
            // c'est un array, donc plusieurs enregistrement à traiter
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqLogicId')){
                    eventplanner.eqLogic.container[element.eqLogicId] = element;
                }
            });
        }
    },

    // Accés aux données
    all: function(_fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = $.map(this.container, function(value, index) {
                return [value];
            });

            // Tri
            dataSelection.sort(this.compareZoneIdAsc);

            // Si on demande les data consolidées (pour l'utilisation avec les template)
            if(_fulldata){
                dataSelection = this.getFullData(dataSelection);
            }
            
            return dataSelection;

        }else{
            return false;
        }
    },

     // Accés aux données
    byId: function(_id, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){

            // Selection des données à conserver dans le container:
            if(this.container.hasOwnProperty(_id)){
            	var dataSelection = this.container[_id];
            }else{
            	return false;
            }
            // Si on demande les data consolidées (pour l'utilisation avec les template)
            if(_fulldata){
                dataSelection = this.getFullData(dataSelection);
            }
            
            return dataSelection;
        }else{
            return false;
        }
    },
    
    // Accés aux données
    byEventId: function(_eventId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.eqLogic.container[id].eqLogicEventId == _eventId){
                    dataSelection.push(eventplanner.eqLogic.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareZoneIdAsc);

            // Si on demande les data consolidées (pour l'utilisation avec les template)
            if(_fulldata){
                dataSelection = this.getFullData(dataSelection);
            }
            
            return dataSelection;

        }else{
            return false;
        }
    },
    
    // Accés aux données
    byZoneId: function(_zoneId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.eqLogic.container[id].eqLogicZoneId == _zoneId){
                    dataSelection.push(eventplanner.eqLogic.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareZoneIdAsc);

            // Si on demande les data consolidées (pour l'utilisation avec les template)
            if(_fulldata){
                dataSelection = this.getFullData(dataSelection);
            }
            
            return dataSelection;

        }else{
            return false;
        }
    },

    getFullData: function(_data){
        var processData = function(_eqLogicData){
            // Event
            var event;// = eventplanner.event.byId(_eqLogicData.eqLogicEventId);
            if(!is_object(event)){
                event = {};
            }
            
            // Zone
            var zone = eventplanner.zone.byId(_eqLogicData.eqLogicZoneId);
            if(!is_object(zone)){
                zone = {};
            }
            
            // matType
            var matType = eventplanner.matType.byId(_eqLogicData.eqLogicMatTypeId);
            if(!is_object(matType)){
                matType = {};
            }

            // EqReal
            var eqReal = eventplanner.eqReal.byId(_eqLogicData.eqLogicEqRealId);
            if(!is_object(eqReal)){
                eqReal = {};
            }
           
            // Concaténation
            return $.extend(true, {}, _eqLogicData, event, zone, matType, eqReal);
        }
       
       if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqLogicId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];
            
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqLogicId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
        	return _data;
        }
    },

    compareZoneIdAsc: function(a,b) {
      if (a.zoneId < b.zoneId)
        return -1;
      if (a.zoneId > b.zoneId)
        return 1;
      return 0;
    }
}
