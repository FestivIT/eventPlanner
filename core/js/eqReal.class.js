eventplanner.eqReal = {
    dataReady: $.Deferred(),
    container: {},
    eqRealItem: function(){ 
    	this.getMatType = function(_fullData = false){
			return eventplanner.matType.byId(this.eqRealMatTypeId, _fullData);
    	}
    	
    	this.getEqLogics = function(_fullData = false){
			return eventplanner.eqLogic.byEqRealId(this.eqRealId, _fullData);
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
      if (a.matTypeName < b.matTypeName)
        return -1;
      if (a.matTypeName > b.matTypeName)
        return 1;
      return 0;
    }
}
