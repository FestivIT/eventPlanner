eventplanner.mission = {
    dataReady: $.Deferred(),
    container: {},
    missionItem: function(_data){ 
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('missionId')){
            this.zoneId = ''; // Nouvelle mission
        }
        if(!this.hasOwnProperty('missionEventId')){
            throw new Error("missionEventId manquant!");
        }
        if(!this.hasOwnProperty('missionDisciplineId')){
            //throw new Error("missionDisciplineId manquant!");
            this.missionDisciplineId = 1; // TEMPORAIRE
            console.log('missionDisciplineId temporaire: 1');
        }
        if(!this.hasOwnProperty('missionName')){
            this.missionName = "";
        }
        if(!this.hasOwnProperty('missionComment')){
            this.missionComment = "";
        }
        if(!this.hasOwnProperty('missionState')){
            this.missionState = 400;
        }
        if(!this.hasOwnProperty('missionDate')){
            this.missionDate = '2000-01-01 00:00:01';
        }
        if(!this.hasOwnProperty('missionZones')){
            this.missionZones = [];
        }
        if(!this.hasOwnProperty('missionUsers')){
            this.missionUsers = [];
        }

        this.getUsers = function(_fullData = false){
            var userList = [];
            this.missionUsers.forEach(function(userId){
                userList.push(eventplanner.user.byId(userId, _fullData));
            })
            return userList;
        }

        this.getZones = function(_fullData = false){
            var zoneList = [];
            this.missionZones.forEach(function(zoneId){
                zoneList.push(eventplanner.zone.byId(zoneId, _fullData));
            })
            return zoneList;
        }

        this.remove = function(_params = {}){
            return eventplanner.mission.remove($.extend(_params, {id: this.missionId}));
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('mission');
    },

    // enregistrement d'une mission
    save: function(_params) {
        return eventplanner.saveDataToServer('mission', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('mission', _params);
    },

    updateState: function(_params) {
        return eventplanner.updateStateToServer('mission' ,_params);
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


