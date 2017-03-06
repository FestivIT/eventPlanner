eventplanner.discipline = {
    dataReady: $.Deferred(),
    container: {},
    disciplineItem: function(_data){ 
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }
        if(!this.hasOwnProperty('disciplineId')){
            this.disciplineId = ''; // Nouvelle discipline
        }
        if(!this.hasOwnProperty('disciplineOrganisationId')){
            //throw "disciplineOrganisationId manquant!";
            this.disciplineOrganisationId = 1; // TEMPORAIRE
            console.log('disciplineOrganisationId temporaire: 1');
        }
        if(!this.hasOwnProperty('disciplineName')){
            this.disciplineName = ''; 
        }

        this.getOrganisation = function(_fullData = false){
            return eventplanner.organisation.byId(this.disciplineOrganisationId, _fullData);
        }

        this.remove = function(_params = {}){
            return eventplanner.discipline.remove($.extend(_params, {id: this.disciplineId}));
        }
    },
    

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('discipline');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('discipline', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('discipline', _params);
    },

    // Accés aux données
    all: function(_fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = $.map(this.container, function(value, index) {
                return [value];
            });

            // Tri
            dataSelection.sort(this.compareName);

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
    byOrganisationId: function(_organisationId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.discipline.container[id].disciplineOrganisationId == _disciplineId){
                    dataSelection.push(eventplanner.discipline.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareName);

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

    compareName: function(a,b) {
      if (a.disciplineName < b.disciplineName)
        return -1;
      if (a.disciplineName > b.disciplineName)
        return 1;
      return 0;
    }
}
