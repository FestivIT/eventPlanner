eventplanner.plan = {
    dataReady: $.Deferred(),
    container: {},
    planItem: function(_data){ 
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('planId')){
            this.planId = ''; // Nouveau plan
        }
        if(!this.hasOwnProperty('planOrganisationId')){
            //throw "planOrganisationId manquant!";
            this.planOrganisationId = 1; // TEMPORAIRE
            console.log('planOrganisationId temporaire: 1');
        }
        if(!this.hasOwnProperty('planName')){
            this.planName = "";
        }
        if(!this.hasOwnProperty('planBounds')){
            this.planBounds = [];
        }
        
    	this.getOrganisation = function(_fullData = false){
            return eventplanner.organisation.byId(this.planOrganisationId, _fullData);
        }

        this.remove = function(_params = {}){
            return eventplanner.plan.remove($.extend(_params, {id: this.planId}));
        }
    },
    
    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('plan');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('plan', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('plan', _params);
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
      if (a.planName < b.planName)
        return -1;
      if (a.planName > b.planName)
        return 1;
      return 0;
    }
}
