eventplanner.organisation = {
    dataReady: $.Deferred(),
    container: {},
    organisationItem: function(_data){ 
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('organisationId')){
            this.organisationId = ''; // Nouveau plan
        }
        if(!this.hasOwnProperty('organisationName')){
            this.organisationName = "";
        }

        this.remove = function(_params = {}){
            return eventplanner.organisation.remove($.extend(_params, {id: this.organisationId}));
        }
		
        this.checkValues = function(){            
            if(this.organisationName == ""){
                throw new Error("Le nom de l'organisation ne peut pas être vide.");
            }
            
            return true;
        }
        
        this.getValues = function(){
            var values = {};
            
            for (keys in this){
                if(typeof this[keys] != 'function'){
                    if(keys.substring(0, "organisation".length) == "organisation"){
                        values[firstToLowerCase(keys.substring("organisation".length))] = this[keys];
                    }
                }
            }
            
            return values;
        };
        
        this.clone = function(){
            return new eventplanner.organisation.organisationItem(this);
        }
        
        this.save = function(_params = {}){
            this.checkValues();

            return eventplanner.organisation.save($.extend({organisation: this.getValues()}, _params));
        }
    },
    
    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('organisation');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('organisation', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('organisation', _params);
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
        //Traitement
        // faire un merge des des _data + les donnée captées par le byId...
        // NB: stocker dans les container les champs avec les préfix déjà là...
        
        // ! tester si c'est un tableau --> traiter chaque item (c'est une liste d'objet)
        // si c'est un objet: traiter le seul objet
        
        // ! pour les missions, les champs missionZones et missionUsers sont des listes d'ID
        return _data;
    },

    compareNameAsc: function(a,b) {
      if (a.organisationName.toLowerCase() < b.organisationName.toLowerCase())
        return -1;
      if (a.organisationName.toLowerCase() > b.organisationName.toLowerCase())
        return 1;
      return 0;
    }
}
