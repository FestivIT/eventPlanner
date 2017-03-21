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
            throw new Error("planOrganisationId manquant!");
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

        this.getLBounds = function(){
            return L.latLngBounds([
                L.latLng(this.planBounds[0].lat, this.planBounds[0].lng),
                L.latLng(this.planBounds[1].lat, this.planBounds[1].lng),
                L.latLng(this.planBounds[2].lat, this.planBounds[2].lng)
                ]
            );
        }

        this.remove = function(_params = {}){
            return eventplanner.plan.remove($.extend(_params, {id: this.planId}));
        }
		
        this.checkValues = function(){            
            if(this.planName == ""){
                throw new Error("Le nom du plan ne peut pas être vide.");
            }
			
            if(this.planOrganisationId == ""){
                throw new Error("Le plan doit être rattaché à une organisation.");
            }
			
            if(!is_array(this.planBounds)){
                throw new Error("Les points géographiques du plan doivent etre un tableau.");
            }
            
            return true;
        }
        
        this.getValues = function(){
            var values = {};
            
            for (keys in this){
                if(typeof this[keys] != 'function'){
                    if(keys.substring(0, "plan".length) == "plan"){
                        values[firstToLowerCase(keys.substring("plan".length))] = this[keys];
                    }
                }
            }
            
            return values;
        };
        
        this.clone = function(){
            return new eventplanner.plan.planItem(this);
        }
        
        this.save = function(_params = {}){
            this.checkValues();

            return eventplanner.plan.save($.extend({plan: this.getValues()}, _params));
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

    generateTiles: function(_params) {
        console.log(_params);
        this.save({
            plan:{
                id: _params.plan.id,
                bounds: _params.plan.bounds
            },
            success: function(){
                return function(_data){
                    console.log(_params);
                    var paramsRequired = [];
                    var paramsSpecifics =  {};

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
                        type: 'plan',
                        action: 'generateTiles',
                        id: _data.planId
                    };
                    return $.ajax(paramsAJAX);
                }
            }(_params)
        });
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
      if (a.planName.toLowerCase() < b.planName.toLowerCase())
        return -1;
      if (a.planName.toLowerCase() > b.planName.toLowerCase())
        return 1;
      return 0;
    }
}
