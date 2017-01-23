eventplanner.msg = {
    dataReady: $.Deferred(),
    container: {},
    lastMsgDate: '',

    // Chargement initial des données depuis le serveur
    load: function(){
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.msg.container[element.msgId] = element;
                });
                eventplanner.msg.lastMsgDate = _date;
                eventplanner.msg.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/msg.ajax.php';
        paramsAJAX.data = {
            action: 'all'
        };
        $.ajax(paramsAJAX);

        return eventplanner.msg.dataReady;
    },

    // récupération de la liste des message depuis la dernière réception réussie
    sinceDate: function(_params) {
        var paramsRequired = ['date'];
        var paramsSpecifics = {};

        try {
            eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
        } catch (e) {
            (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
            return;
        }

        var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/msg.ajax.php';
        paramsAJAX.data = {
            action: 'sinceDate',
            date: _params.date
        };
        return $.ajax(paramsAJAX);
    },

    // enregistrement d'un message
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['msg'];
        var paramsSpecifics =  {
        	pre_success: function(_data){
	        	if(_data.state == 'ok'){
	        		eventplanner.msg.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/msg.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            msg: json_encode(_params.msg),
        };
        return $.ajax(paramsAJAX);
    },

    updateData: function(_data){
    	if(is_object(_data)){
    		// c'est un objet, donc un seul enregistrement à traiter
    		if(_data.hasOwnProperty('msgId')){
    			this.container[_data.msgId] = _data;
    		}    		
    	}else{
    		// c'est un array, donc plusieurs enregistrement à traiter
    		_data.forEach(function(element) {
                if(element.hasOwnProperty('msgId')){
	    			eventplanner.msg.container[element.msgId] = element;
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
    byZoneId: function(_zoneId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.msg.container[id].msgZoneId == _zoneId){
                    dataSelection.push(eventplanner.msg.container[id]);
                }
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
    byEqId: function(_eqId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.msg.container[id].msgEqId == _eqId){
                    dataSelection.push(eventplanner.msg.container[id]);
                }
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
    byUserId: function(_userId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.msg.container[id].msgUserId == _userId){
                    dataSelection.push(eventplanner.msg.container[id]);
                }
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
        var processData = function(_msgData){
            // User
            var user = eventplanner.user.byId(_msgData.msgUserId);
            if(!is_object(user)){
                user = {};
            }

            // Zone
            var zone = eventplanner.zone.byId(_msgData.msgZoneId);
            if(!is_object(zone)){
                zone = {};
            }

            // Eq (fulldata pour récuéper les infos matType)
            var eqLogic = eventplanner.eqLogic.byId(_msgData.msgEqId, true);
            if(!is_object(eqLogic)){
                eqLogic = {};
            }
           
            // Concaténation
            return $.extend(true, {}, _msgData, user, zone, eqLogic);
        }
       
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('msgId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];

            _data.forEach(function(element) {
                if(element.hasOwnProperty('msgId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
        	return _data;	
        }
    },

    compareIdDesc: function(a,b) {
      if (parseInt(a.msgId) > parseInt(b.msgId))
        return -1;
      if (parseInt(a.msgId) < parseInt(b.msgId))
        return 1;
      return 0;
    }
};
