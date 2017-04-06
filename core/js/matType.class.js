eventplanner.matType = {
    dataReady: $.Deferred(),
    container: {},
    matTypeItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('matTypeId')){
            this.matTypeId = ''; // Nouveau matType
        }
        if(!this.hasOwnProperty('matTypeDisciplineId')){
            throw new Error("matTypeDisciplineId manquant!");
        }
        if(!this.hasOwnProperty('matTypeName')){
            this.matTypeName = "";
        }
        if(!this.hasOwnProperty('matTypeParentId')){
            this.matTypeParentId = null;
        }

    	this.getParent = function(_fullData = false){
			return eventplanner.matType.byId(this.matTypeParentId, _fullData);
    	}
    	
    	this.getAttributes = function(_fullData = false){
			return eventplanner.matTypeAttribute.byMatTypeId(this.matTypeId, _fullData);
    	}
    	
    	this.getAllAttributes = function(_fullData = false){
    		if(this.matTypeParentId != null){
				var parentMatType = eventplanner.matType.byId(this.matTypeParentId);
				return this.getAttributes().concat(parentMatType.getAllAttributes());
			}else{
				return this.getAttributes();
			}
    	}

        this.remove = function(_params = {}){
            return eventplanner.matType.remove($.extend(_params, {id: this.matTypeId}));
        }
        
        this.checkValues = function(){
        	if(this.matTypeDisciplineId == ""){
				throw new Error("Le type de matériel doit être rattaché à une discipline.");
			}
			
			if(this.matTypeName == ""){
				throw new Error("Le nom du type de matériel ne peut pas être vide.");
			}
			
		    if(this.matTypeParentId == ""){
				this.matTypeParentId = null;
			}
			
			return true;
        }
        
        this.getValues = function(){
        	var values = {};
        	
        	for (keys in this){
        		if(typeof this[keys] != 'function'){
        			if(keys.substring(0, "matType".length) == "matType"){
        				values[firstToLowerCase(keys.substring("matType".length))] = this[keys];
        			}
        		}
        	}
        	
        	return values;
        };
        
        this.clone = function(){
            return new eventplanner.matType.matTypeItem(this);
        }
        
        this.save = function(_params = {}){
        	this.checkValues();

			return eventplanner.matType.save($.extend({matType: this.getValues()}, _params));
        }        
    },

    // Chargement initial des données depuis le serveur
    load: function(){
    	return $.when(
		    		eventplanner.loadDataFromServer('matType'),
		    		eventplanner.loadDataFromServer('matTypeAttribute')
		    	);
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('matType', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('matType', _params);
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
    
    getFullData: function(_data){
        return _data;
    },

    compareNameAsc: function(a,b) {
      if (a.matTypeName < b.matTypeName)
        return -1;
      if (a.matTypeName > b.matTypeName)
        return 1;
      return 0;
    }
}

eventplanner.matTypeAttribute = {
    dataReady: $.Deferred(),
    container: {},
    matTypeAttributeItem: function(_data){ 
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('matTypeAttributeId')){
            this.matTypeAttributeId = ''; // Nouveau matTypeAttribute
        }
        if(!this.hasOwnProperty('matTypeAttributeOptions')){
            this.matTypeAttributeOptions = {};
        }
        if(!this.hasOwnProperty('matTypeAttributeMatTypeId')){
            throw "matTypeAttributeMatTypeId manquant!";
        }
        if(!this.hasOwnProperty('matTypeAttributeName')){
            this.matTypeAttributeName = '';
        }

        this.getMatType = function(_fullData = false){
            return eventplanner.matType.byId(this.matTypeAttributeMatTypeId, _fullData);
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('matTypeAttribute');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('matTypeAttribute', _params);
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
    byMatTypeId: function(_matTypeId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.matTypeAttribute.container[id].matTypeAttributeMatTypeId == _matTypeId){
                    dataSelection.push(eventplanner.matTypeAttribute.container[id]);
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
        var processData = function(_matTypeAttributeData){
            // matType
            var matType = _matTypeAttributeData.getMatType(true);
            if(!is_object(matType)){
                matType = {};
            }
           
            // Concaténation
            return $.extend(true, {}, _matTypeAttributeData, matType);
        }
       
       if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('matTypeAttributeId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];
            
            _data.forEach(function(element) {
                if(element.hasOwnProperty('matTypeAttributeId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
            return _data;
        }
    },

    compareNameAsc: function(a,b) {
    	if (a.getMatType().matTypeName < b.getMatType().matTypeName){
		    return -1;
    	}else if (a.getMatType().matTypeName > b.getMatType().matTypeName){
        	return 1;
    	}else{
    		if (a.matTypeAttributeName.toLowerCase() < b.matTypeAttributeName.toLowerCase())
		        return -1;
		    if (a.matTypeAttributeName.toLowerCase() > b.matTypeAttributeName.toLowerCase())
		        return 1;
		    return 0;
    	}
    }
}
