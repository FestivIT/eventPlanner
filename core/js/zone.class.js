eventplanner.zone = {
    dataReady: $.Deferred(),
    container: {},
    
    // Chargement initial des données depuis le serveur
    load: function(){
    	this.dataReady = $.Deferred();
    	this.container = {};
    	
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.zone.container[element.zoneId] = element;
                });

                eventplanner.zone.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/zone.ajax.php';
        paramsAJAX.data = {
            action: 'all',
            fullData: true
        };
        $.ajax(paramsAJAX);

        return this.dataReady;
    },

    // enregistrement d'une zone
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['zone'];
        var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.zone.updateData(_data.result);
                    //eventplanner.msg.lastMsgDate = _data.date;
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
        paramsAJAX.url = 'core/ajax/zone.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            zone: json_encode(_params.zone)
        };
        return $.ajax(paramsAJAX);
    },
    
    updateState: function(_params) {
	    var paramsRequired = ['listId','state'];
	    var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.zone.updateData(_data.result);
                    //eventplanner.msg.lastMsgDate = _data.date;
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
	    paramsAJAX.url = 'core/ajax/zone.ajax.php';
	    paramsAJAX.data = {
	        action: 'updateState',
	        listId: json_encode(_params.listId),
	        state: _params.state
	    };
	    return $.ajax(paramsAJAX);
	},

    updateData: function(_data){
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('zoneId')){
                this.container[_data.zoneId] = _data;
            }           
        }else{
            // c'est un array, donc plusieurs enregistrement à traiter
            _data.forEach(function(element) {
                if(element.hasOwnProperty('zoneId')){
                    eventplanner.zone.container[element.zoneId] = element;
                }
            });
        }
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
      if (a.zoneName < b.zoneName)
        return -1;
      if (a.zoneName > b.zoneName)
        return 1;
      return 0;
    }
}
