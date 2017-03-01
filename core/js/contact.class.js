eventplanner.contact = {
    dataReady: $.Deferred(),
    container: {},
    contactItem: function(){ 
        this.getZone = function(_fullData = false){
            return eventplanner.zone.byId(this.contactZoneId, _fullData);
        }
    },
    

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('contact');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('contact', _params);
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
    byEventId: function(_eventId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.contact.container[id].contactEventId == _eventId){
                    dataSelection.push(eventplanner.contact.container[id]);
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

    // Accés aux données
    byZoneId: function(_zoneId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.contact.container[id].contactZoneId == _zoneId){
                    dataSelection.push(eventplanner.contact.container[id]);
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
        var processData = function(_contactData){
            // Event
            var event = eventplanner.event.byId(_contactData.contactEventId);
            if(!is_object(event)){
                event = {};
            }

            // Zone
            var zone = eventplanner.zone.byId(_contactData.contactZoneId, true);
            if(!is_object(zone)){
                zone = {};
            }

            var newContactData = $.extend(true, {}, _contactData, event, zone);
           
            // Concaténation
            return newContactData;
        }
       
       if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('contactId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];
            
            _data.forEach(function(element) {
                if(element.hasOwnProperty('contactId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
            return _data;
        }
    },

    compareName: function(a,b) {
      if (a.contactName < b.contactName)
        return -1;
      if (a.contactName > b.contactName)
        return 1;
      return 0;
    }
}