eventplanner.eqLogic = {
    dataReady: $.Deferred(),
    container: {},
    eqLogicItem: function(){ 
    	this.getEvent = function(_fullData = false){
    		return eventplanner.event.byId(this.eqLogicEventId, _fullData);
    	}
    	
    	this.getEqReal = function(_fullData = false){
    		return eventplanner.eqReal.byId(this.eqLogicEqRealId, _fullData);
    	}
    	
    	this.getMatType = function(_fullData = false){
    		return eventplanner.matType.byId(this.eqLogicMatTypeId, _fullData);
    	}
    	
    	this.getZone = function(_fullData = false){
    		return eventplanner.zone.byId(this.eqLogicZoneId, _fullData);
    	}
    	
    	this.getEqLinks = function(_fullData = false){
    		return eventplanner.eqLink.byEqLogicId(this.eqLogicId, _fullData);
    	}
    },
    

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('eqLogic');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eqLogic', _params);
    },

    updateState: function(_params) {
        return eventplanner.updateStateToServer('eqLogic' ,_params);
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

    byEqRealId: function(_eqRealId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.eqLogic.container[id].eqLogicEqRealId == _eqRealId){
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
            var event = eventplanner.event.byId(_eqLogicData.eqLogicEventId);
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
