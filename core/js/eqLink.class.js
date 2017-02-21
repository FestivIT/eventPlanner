eventplanner.eqLink = {
    dataReady: $.Deferred(),
    container: {},
    type: {
        1: 'Eth',
        2: 'Wifi2.4',
        3: 'Wifi5',
        4: 'VDSL'
    },
    

    // Chargement initial des données depuis le serveur
    load: function(){
    	this.dataReady = $.Deferred();
    	this.container = {};
    	
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.eqLink.container[element.eqLinkId] = element;
                });

                eventplanner.eqLink.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/eqLink.ajax.php';
        paramsAJAX.data = {
            action: 'all'
        };
        $.ajax(paramsAJAX);

        return this.dataReady;
    },

    // enregistrement d'un eqLink
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['eqLink'];
        var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.eqLink.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/eqLink.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            eqLink: json_encode(_params.eqLink)
        };
        return $.ajax(paramsAJAX);
    },
    
    updateData: function(_data){
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqLinkId')){
                this.container[_data.eqLinkId] = _data;
            }           
        }else{
            // c'est un array, donc plusieurs enregistrement à traiter
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqLinkId')){
                    eventplanner.eqLink.container[element.eqLinkId] = element;
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
            dataSelection.sort(this.compareEqLogicId1Asc);

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
               if(eventplanner.eqLink.container[id].eqLinkEventId == _eventId){
                    dataSelection.push(eventplanner.eqLink.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareEqLogicId1Asc);

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
    byEqLogicId: function(_eqLogicId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if((eventplanner.eqLink.container[id].eqLinkEqLogicId1 == _eqLogicId) || (eventplanner.eqLink.container[id].eqLinkEqLogicId2 == _eqLogicId)){
                    dataSelection.push(eventplanner.eqLink.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareEqLogicId1Asc);

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
        var processData = function(_eqLinkData){
            // Event
            var event = eventplanner.event.byId(_eqLinkData.eqLinkEventId);
            if(!is_object(event)){
                event = {};
            }

            // EqLogic1
            var eqLogic1 = eventplanner.eqLogic.byId(_eqLinkData.eqLinkEqLogicId1, true);
            if(!is_object(eqLogic1)){
                eqLogic1 = {};
            }

            // EqLogic2
            var eqLogic2 = eventplanner.eqLogic.byId(_eqLinkData.eqLinkEqLogicId2, true);
            if(!is_object(eqLogic1)){
                eqLogic2 = {};
            }

            var newEqLinkData = $.extend(true, {}, _eqLinkData, event);
            newEqLinkData.eqLogic1 = eqLogic1;
            newEqLinkData.eqLogic2 = eqLogic2;
            newEqLinkData.eqLinkTypeName = eventplanner.eqLink.type[newEqLinkData.eqLinkType];
           
            // Concaténation
            return newEqLinkData;
        }
       
       if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqLinkId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];
            
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqLinkId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
            return _data;
        }
    },

    compareEqLogicId1Asc: function(a,b) {
      if (a.eqLinkEqLogicId1 < b.eqLinkEqLogicId1)
        return -1;
      if (a.eqLinkEqLogicId1 > b.eqLinkEqLogicId1)
        return 1;
      return 0;
    }
}
