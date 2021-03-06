eventplanner.eqReal = {
    dataReady: $.Deferred(),
    container: {},
    eqRealItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('eqRealId')){
            this.eqRealId = ''; // Nouveau matériel
        }
        if(!this.hasOwnProperty('eqRealDisciplineId')){
            throw new Error("eqRealDisciplineId manquant!");
        }
        if(!this.hasOwnProperty('eqRealMatTypeId')){
            if(eventplanner.matType.all().length != 0){
                this.eqRealMatTypeId = eventplanner.matType.all()[0].matTypeId;
            }else{
                throw new Error("Créer d'abord un type de matériel pour pouvoir créer un équipement!");
            }
        }
        if(!this.hasOwnProperty('eqRealName')){
            this.eqRealName = ""; 
        }
        if(!this.hasOwnProperty('eqRealComment')){
            this.eqRealComment = ""; 
        }
        if(!this.hasOwnProperty('eqRealState')){
            this.eqRealState = 300; 
        }
        if(!this.hasOwnProperty('eqRealLocalisation')){
            this.eqRealLocalisation = ""; 
        }

    	this.getMatType = function(_fullData = false){
			return eventplanner.matType.byId(this.eqRealMatTypeId, _fullData);
    	}
    	
    	this.getEqLogics = function(_fullData = false){
			return eventplanner.eqLogic.byEqRealId(this.eqRealId, _fullData);
    	}

        this.remove = function(_params = {}){
            return eventplanner.eqReal.remove($.extend(_params, {id: this.eqRealId}));
        }
        
        this.checkValues = function(){            
            if(this.eqRealDisciplineId == ""){
                throw new Error("Le matériel doit être rattaché à une discipline.");
            }
            
            if(this.eqRealMatTypeId == ""){
                throw new Error("Un type de matériel doit être défini.");
            }         
			
            if(this.eqRealName == ""){
                throw new Error("Le nom du matériel ne peut pas être vide.");
            } 
			
            if(this.eqRealState <= 0){
                throw new Error("L'état du matériel n'est pas valide.");
            }
                        
            return true;
        }
        
        this.getValues = function(){
            var values = {};
            
            for (keys in this){
                if(typeof this[keys] != 'function'){
                    if(keys.substring(0, "eqReal".length) == "eqReal"){
                        values[firstToLowerCase(keys.substring("eqReal".length))] = this[keys];
                    }
                }
            }
            
            return values;
        };
        
        this.clone = function(){
            return new eventplanner.eqReal.eqRealItem(this);
        }
        
        this.save = function(_params = {}){
            this.checkValues();

            return eventplanner.eqReal.save($.extend({eqReal: this.getValues()}, _params));
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('eqReal');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eqReal', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('eqReal', _params);
    },

    updateState: function(_params) {
        return eventplanner.updateStateToServer('eqReal' ,_params);
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
               if(eventplanner.eqReal.container[id].eqRealMatTypeId == _matTypeId){
                    dataSelection.push(eventplanner.eqReal.container[id]);
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
        var processData = function(_eqRealData){
            // matType
            var matType = eventplanner.matType.byId(_eqRealData.eqRealMatTypeId);
            if(!is_object(matType)){
                matType = {};
            }

            // Concaténation
            return $.extend(true, {}, _eqRealData, matType);
        }
       
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqRealId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];

            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqRealId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
        	return _data;	
        }
    },

    compareNameAsc: function(a,b) {
      if(a.hasOwnProperty('matTypeName')){
	      if (a.matTypeName.toLowerCase() < b.matTypeName.toLowerCase())
	        return -1;
	      if (a.matTypeName.toLowerCase() > b.matTypeName.toLowerCase())
	        return 1;
      }
      return 0;
    }
}
