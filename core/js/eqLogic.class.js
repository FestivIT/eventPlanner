eventplanner.eqLogic = {
    dataReady: $.Deferred(),
    container: {},
    eqLogicItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }
        if(!this.hasOwnProperty('eqLogicId')){
            this.eqLogicId = ''; // Nouveau équipement
        }
        if(!this.hasOwnProperty('eqLogicEventId')){
            throw new Error("eqLogicEventId manquant!");
        }
        if(!this.hasOwnProperty('eqLogicDisciplineId')){
            throw new Error("eqLogicDisciplineId manquant!");
        }
        if(!this.hasOwnProperty('eqLogicZoneId')){
            if(eventplanner.zone.all().length != 0){
                this.eqLogicZoneId = eventplanner.zone.all()[0].zoneId; // Sélection par défaut d'une zone...
            }else{
                throw new Error("Créer d'abord une zone pour pouvoir créer un équipement!");
            }
        }
        if(!this.hasOwnProperty('eqLogicMatTypeId')){
            this.eqLogicMatTypeId = eventplanner.matType.all()[0].matTypeId; // Sélection par défaut d'un type...
        }
        if(!this.hasOwnProperty('eqLogicEqRealId')){
            this.eqLogicEqRealId = null;
        }
        if(!this.hasOwnProperty('eqLogicComment')){
            this.eqLogicComment = ''; 
        }
        if(!this.hasOwnProperty('eqLogicState')){
            this.eqLogicState = 100; 
        }
        if(!this.hasOwnProperty('eqLogicLocalisation')){
            this.eqLogicLocalisation = ''; 
        }

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

        this.getEqLogicAttributes = function(_fullData = false){
            return eventplanner.eqLogicAttribute.byEqLogicId(this.eqLogicId, _fullData);
        }

		this.getFullData = function(){
			return eventplanner.eqLogic.getFullData(this);
		}
        
        this.getEqLogicAttributesForPlanning = function(_fullData = false){
            return eventplanner.eqLogicAttribute.byEqLogicId(this.eqLogicId, _fullData, true);
        }
        

        this.getEqLogicAttributesByMatTypeAttributeId = function(_matTypeAttributeId, _fullData = false){
            var result = false;
            this.getEqLogicAttributes(_fullData).forEach(function(attr){
                if(attr.eqLogicAttributeMatTypeAttributeId == _matTypeAttributeId){
                    result = attr;
                }
            });
            return result;
        }    

        this.duplicate = function(){
            var eqLogicItem = new eventplanner.eqLogic.eqLogicItem(this);
            eqLogicItem.eqLogicId = '';
            eqLogicItem.eqLogicEqRealId = null;

            return eqLogicItem;
        }

        this.remove = function(_params = {}){
            return eventplanner.eqLogic.remove($.extend(_params, {id: this.eqLogicId}));
        }
        
        this.checkValues = function(){            
            if(this.eqLogicEventId == ""){
                throw new Error("L'équipement doit être rattaché à un événement.");
            }
            
            if(this.eqLogicDisciplineId == ""){
                throw new Error("L'équipement doit être rattaché à une discipline.");
            }         
			
            if(this.eqLogicZoneId == ""){
                throw new Error("L'équipement doit être rattaché à une zone.");
            } 
			
            if(this.eqLogicMatTypeId == ""){
                throw new Error("Un type de matériel doit être défini.");
            }
			
            if(this.eqLogicEqRealId == ""){
                this.eqLogicEqRealId = null;
            }			
			
            if(this.eqLogicState <= 0){
                throw new Error("L'état de l'équipement n'est pas valide.");
            }
                        
            return true;
        }
        
        this.getValues = function(){
            var values = {};
            
            for (keys in this){
                if(typeof this[keys] != 'function'){
                    if(keys.substring(0, "eqLogic".length) == "eqLogic"){
                        values[firstToLowerCase(keys.substring("eqLogic".length))] = this[keys];
                    }
                }
            }
            
            return values;
        };
        
        this.clone = function(){
            return new eventplanner.eqLogic.eqLogicItem(this);
        }
        
        this.save = function(_params = {}){
            this.checkValues();

            return eventplanner.eqLogic.save($.extend({eqLogic: this.getValues()}, _params));
        }
    },
    

    // Chargement initial des données depuis le serveur
    load: function(){
        return $.when(
                    eventplanner.loadDataFromServer('eqLogic'),
                    eventplanner.loadDataFromServer('eqLogicAttribute')
                );
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eqLogic', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('eqLogic', _params);
    },

    updateState: function(_params) {
        return eventplanner.updateStateToServer('eqLogic' ,_params);
    },
    
    saveEqLogicList: function(_params) {
    	var paramsRequired = ['saveList', 'deleteList'];
        var paramsSpecifics =  {
        	pre_success: function(_data) {
	            		if(_data.state == 'ok'){
			        		/*
			        		eventplanner.updateDataFromServer('eqLogic', _data.result);
                            _data.result = new eventplanner.eqLogic.eqLogicItem(_data.result);
                            */
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
        paramsAJAX.url = 'core/ajax/ajax.php';
        paramsAJAX.data = {
            type: 'eqLogic',
            action: 'saveEqLogicList',
            saveList: json_encode(_params.saveList),
            deleteList: json_encode(_params.deleteList)
        };
        return $.ajax(paramsAJAX);
    },

    // Accés aux données
    all: function(_fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = $.map(this.container, function(value, index) {
                return [value];
            });

            // Tri
            dataSelection.sort(this.compareMatTypeIdAsc);

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
      if (a.eqLogicZoneId < b.eqLogicZoneId)
        return -1;
      if (a.eqLogicZoneId > b.eqLogicZoneId)
        return 1;
      return 0;
    },

    compareMatTypeIdAsc: function(a,b) {
      if (a.eqLogicMatTypeId < b.eqLogicMatTypeId)
        return -1;
      if (a.eqLogicMatTypeId > b.eqLogicMatTypeId)
        return 1;
      return 0;
    }
}

eventplanner.eqLogicAttribute = {
    dataReady: $.Deferred(),
    container: {},
    eqLogicAttributeItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }
        if(!this.hasOwnProperty('eqLogicAttributeId')){
            this.eqLogicAttributeId = ''; // Nouveau attribut
        }
        if(!this.hasOwnProperty('eqLogicAttributeEqLogicId')){
            throw "eqLogicAttributeEqLogicId manquant!";
        }
        if(!this.hasOwnProperty('eqLogicAttributeMatTypeAttributeId')){
            throw "eqLogicAttributeMatTypeAttributeId manquant!";
        }
        if(!this.hasOwnProperty('eqLogicAttributeValue')){
            this.eqLogicAttributeValue = '';
        }
        if(!this.hasOwnProperty('eqLogicAttributeViewOnPlanning')){
            this.eqLogicAttributeViewOnPlanning = '0';
        }

        this.getMatTypeAttribute = function(_fullData = false){
            return eventplanner.matTypeAttribute.byId(this.eqLogicAttributeMatTypeAttributeId, _fullData);
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('eqLogicAttribute');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eqLogicAttribute', _params);
    },

    // Accés aux données
    all: function(_fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = $.map(this.container, function(value, index) {
                return [value];
            });

            // Tri
            dataSelection.sort(this.compareNameAsc);

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
    byEqLogicId: function(_eqLogicId, _fulldata = false, _viewOnPlanningFilter = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if((eventplanner.eqLogicAttribute.container[id].eqLogicAttributeEqLogicId == _eqLogicId) && (eventplanner.eqLogicAttribute.container[id].eqLogicAttributeViewOnPlanning == '1' || !_viewOnPlanningFilter)){
                    dataSelection.push(eventplanner.eqLogicAttribute.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareNameAsc);

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
        var processData = function(_eqLogicAttributeData){
            // EqLogic
            var eqLogic = eventplanner.eqLogic.byId(_eqLogicAttributeData.eqLogicAttributeEqLogicId, true);
            if(!is_object(eqLogic)){
                eqLogic = {};
            }

            // matTypeAttribute
            var matTypeAttribute = _eqLogicAttributeData.getMatTypeAttribute(true);
            if(!is_object(matTypeAttribute)){
                matTypeAttribute = {};
            }
           
            // Concaténation
            return $.extend(true, {}, _eqLogicAttributeData, eqLogic, matTypeAttribute);
        }
       
       if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqLogicAttributeId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];
            
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqLogicAttributeId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
            return _data;
        }
    },

    compareNameAsc: function(a,b) {
      if(a.hasOwnProperty('matTypeAttributeName')){
	      if (a.matTypeAttributeName.toLowerCase() < b.matTypeAttributeName.toLowerCase())
	        return -1;
	      if (a.matTypeAttributeName.toLowerCase() > b.matTypeAttributeName.toLowerCase())
	        return 1;
      }
      return 0;
    }
}
