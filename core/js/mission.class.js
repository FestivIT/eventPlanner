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
            throw new Error("missionDisciplineId manquant!");
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
            var d = new Date(),
                month = '' + (d.getMonth() + 1).toString(),
                day = '' + d.getDate().toString(),
                year = d.getFullYear().toString(),
                hr = '' + d.getHours().toString(),
                min = d.getMinutes().toString(),
                sec = d.getSeconds().toString();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
            if (hr.length < 2) hr = '0' + hr;
            if (min.length < 2) min = '0' + min;
            if (sec.length < 2) sec = '0' + sec;

            var date = [year, month, day].join('-');
            var hour = [hr, min, sec].join(':');
            this.missionDate = date + ' ' + hour;
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
		
        this.checkValues = function(){
        	if(this.missionEventId == ""){
				throw new Error("La mission doit être rattaché à un événement.");
			}
			
        	if(this.missionDisciplineId == ""){
				throw new Error("La mission doit être rattaché à une discipline.");
			}
			
			if(this.missionName == ""){
				throw new Error("Le nom de la mission ne peut pas être vide.");
			}
			
		    if(this.missionState <= 0){
				throw new Error("L'état de la mission n'est pas valide.");
			}
			
		    if(this.missionDate == ""){
				throw new Error("Le format de la date n'est pas valide.");
			}
			
		    if(!is_array(this.missionZones)){
				throw new Error("La liste des zones de cette mission doit être un tableau.");
			}
			
		    if(!is_array(this.missionUsers)){
				throw new Error("La liste des utilisateurs sur cette mission doit être un tableau.");
			}
			
			return true;
        }
        
        this.getValues = function(){
        	var values = {};
        	
        	for (keys in this){
        		if(typeof this[keys] != 'function'){
        			if(keys.substring(0, "mission".length) == "mission"){
        				values[firstToLowerCase(keys.substring("mission".length))] = this[keys];
        			}
        		}
        	}
        	
        	return values;
        };
        
        this.clone = function(){
            return new eventplanner.mission.missionItem(this);
        }
        
        this.save = function(_params = {}){
        	this.checkValues();

			return eventplanner.mission.save($.extend({mission: this.getValues()}, _params));
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


