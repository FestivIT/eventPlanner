eventplanner.event = {
    dataReady: $.Deferred(),
    container: {},
    

    // Chargement initial des données depuis le serveur
    load: function(){
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.event.container[element.eventId] = element;
                });

                eventplanner.event.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/event.ajax.php';
        paramsAJAX.data = {
            action: 'all'
        };
        $.ajax(paramsAJAX);

        return eventplanner.event.dataReady;
    },

    // enregistrement d'un event
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['event'];
        var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.event.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/event.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            event: json_encode(_params.event)
        };
        return $.ajax(paramsAJAX);
    },
    
    updateData: function(_data){
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eventId')){
                this.container[_data.eventId] = _data;
            }           
        }else{
            // c'est un array, donc plusieurs enregistrement à traiter
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eventId')){
                    eventplanner.event.container[element.eventId] = element;
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
            dataSelection.sort(this.compareIdDesc);

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

    compareIdDesc: function(a,b) {
      if (a.eventId > b.eventId)
        return -1;
      if (a.eventId < b.eventId)
        return 1;
      return 0;
    }
}

eventplanner.event.byDayInterval = function(_params) {
    var paramsRequired = ['dayBefore', 'dayAfter'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/event.ajax.php';
    paramsAJAX.data = {
        action: 'byDayInterval',
        dayBefore: _params.dayBefore,
        dayAfter: _params.dayAfter
    };
    $.ajax(paramsAJAX);
};