eventplanner.mission = {
    dataReady: $.Deferred(),
    container: {},
    

    // Chargement initial des données depuis le serveur
    load: function(){
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.mission.container[element.missionId] = element;
                });

                eventplanner.mission.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/mission.ajax.php';
        paramsAJAX.data = {
            action: 'all',
            fullData: true
        };
        $.ajax(paramsAJAX);

        return eventplanner.mission.dataReady;
    },

    // enregistrement d'une mission
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['mission'];
        var paramsSpecifics =  {
        	pre_success: function(_data){
	        	if(_data.state == 'ok'){
	        		eventplanner.mission.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/mission.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            mission: json_encode(_params.mission)
        };
        return $.ajax(paramsAJAX);
    },
    
    updateData: function(_data){
    	if(is_object(_data)){
    		// c'est un objet, donc un seul enregistrement à traiter
    		if(_data.hasOwnProperty('missionId')){
    			this.container[_data.missionId] = _data;
    		}    		
    	}else{
    		// c'est un array, donc plusieurs enregistrement à traiter
    		_data.forEach(function(element) {
                if(element.hasOwnProperty('missionId')){
	    			eventplanner.mission.container[element.missionId] = element;
	    		}
            });
    	}
    },

    updateState: function(_params) {
        var paramsRequired = ['listId','state'];
        var paramsSpecifics =  {
        	pre_success: function(_data){
	        	if(_data.state == 'ok'){
	        		eventplanner.mission.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/mission.ajax.php';
        paramsAJAX.data = {
            action: 'updateState',
            listId: json_encode(_params.listId),
            state: _params.state
        };
        return $.ajax(paramsAJAX);
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
            	if($.inArray(_zoneId.toString(), eventplanner.mission.container[id].missionZones) > -1){
                    dataSelection.push(eventplanner.mission.container[id]);
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
            var dataSelection = this.container[_id];

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
            	if($.inArray(_userId.toString(), eventplanner.mission.container[id].missionUsers) > -1){
                    dataSelection.push(eventplanner.mission.container[id]);
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
    byUserIdMaxState: function(_userId, _maxState, _fulldata = false){
    	if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
            	if((eventplanner.mission.container[id].missionState <= _maxState) && ($.inArray(_userId.toString(), eventplanner.mission.container[id].missionUsers) > -1)){
                    dataSelection.push(eventplanner.mission.container[id]);
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

    getFullData: function(_data){
        var processData = function(_missionData){
        	// pour ne pas modifier le container d'origine.
        	_missionData = $.extend(true, {}, _missionData);
        	
    		if(is_array(_missionData.missionUsers)){
    			var userArray = [];
    			
    			_missionData.missionUsers.forEach(function(userId) {
    				var user = eventplanner.user.byId(userId);
		            if(is_object(user)){
		                userArray.push(user);
		            }
	            });
	            
	            _missionData.missionUsers = userArray;
    		}
    		
    		if(is_array(_missionData.missionZones)){
    			var zoneArray = [];
    			
    			_missionData.missionZones.forEach(function(zoneId) {
    				var zone = eventplanner.zone.byId(zoneId);
		            if(is_object(zone)){
		                zoneArray.push(zone);
		            }
	            });
	            
	            _missionData.missionZones = zoneArray;
    		}
    		   		
    		return _missionData;
    	}
                
       if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('missionId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];
            
            _data.forEach(function(element) {
                if(element.hasOwnProperty('missionId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
        	return _data;
        }
    },

    compareIdDesc: function(a,b) {
      if (parseInt(a.missionId) > parseInt(b.missionId))
        return -1;
      if (parseInt(a.missionId) < parseInt(b.missionId))
        return 1;
      return 0;
    }
}


