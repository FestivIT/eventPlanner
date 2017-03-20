eventplanner.eqLink = {
    dataReady: $.Deferred(),
    container: {},
    type: {
        1: 'Eth',
        2: 'Wifi2.4',
        3: 'Wifi5',
        4: 'VDSL'
    },
    eqLinkItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }
        if(!this.hasOwnProperty('eqLinkId')){
            this.eqLinkId = ''; // Nouveau lien
        }
        if(!this.hasOwnProperty('eqLinkEventId')){
            throw new Error("eqLinkEventId manquant!");
        }
        if(!this.hasOwnProperty('eqLinkEqLogicId1')){
            this.eqLinkEqLogicId1 = '';
        }
        if(!this.hasOwnProperty('eqLinkEqLogicId2')){
            this.eqLinkEqLogicId2 = '';
        }
        if(!this.hasOwnProperty('eqLinkType')){
            this.eqLinkType = eventplanner.eqLink.type[1];
        }
        if(!this.hasOwnProperty('eqLinkConfiguration')){
            this.eqLinkConfiguration = [];
        }

        this.getEqLogics = function(_fullData = false){
            return [eventplanner.eqLogic.byId(this.eqLinkEqLogicId1, _fullData),
                    eventplanner.eqLogic.byId(this.eqLinkEqLogicId2, _fullData)];
        }
        
        this.getPointsLocalisation = function(){
            var eqLogic1 = eventplanner.eqLogic.byId(this.eqLinkEqLogicId1);
            var eqLogic2 = eventplanner.eqLogic.byId(this.eqLinkEqLogicId2);
            var result = [];
            
            if(eqLogic1.eqLogicConfiguration.hasLocalisation){
                result.push(eqLogic1.eqLogicConfiguration.localisation);
            }else{
                result.push(eqLogic1.getZone().zoneLocalisation);
            }
            
            if(eqLogic2.eqLogicConfiguration.hasLocalisation){
                result.push(eqLogic2.eqLogicConfiguration.localisation);
            }else{
                result.push(eqLogic2.getZone().zoneLocalisation);
            }
            
            return result;
        }

        this.remove = function(_params = {}){
            return eventplanner.eqLink.remove($.extend(_params, {id: this.eqLinkId}));
        }
    },
    

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('eqLink');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eqLink', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('eqLink', _params);
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
