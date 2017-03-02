eventplanner.matType = {
    dataReady: $.Deferred(),
    container: {},
    matTypeItem: function(){ 
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
    matTypeAttributeItem: function(){ 

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
        return _data;
    },

    compareNameAsc: function(a,b) {
      if (a.matTypeAttributeName < b.matTypeAttributeName)
        return -1;
      if (a.matTypeAttributeName > b.matTypeAttributeName)
        return 1;
      return 0;
    }
}
