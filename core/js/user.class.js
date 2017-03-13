eventplanner.user = {
    dataReady: $.Deferred(),
    container: {},
    connectCheck: 0,
    userItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('userId')){
            this.userId = ''; // Nouvel utilisateur
        }
        if(!this.hasOwnProperty('userDisciplineId')){
            //throw "userDisciplineId manquant!";
            this.userDisciplineId = 1; // TEMPORAIRE
            console.log('userDisciplineId temporaire: 1');
        } 
        if(!this.hasOwnProperty('userLogin')){
            this.userLogin = '';
        } 
        if(!this.hasOwnProperty('userName')){
            this.userName = '';
        } 
        if(!this.hasOwnProperty('userEventId')){
            this.userEventId = null;
        } 
        if(!this.hasOwnProperty('userEventLevelId')){
            this.userEventLevelId = null;
        } 
        if(!this.hasOwnProperty('userActionOnScan')){
            this.userActionOnScan = 'zone';
        } 
        if(!this.hasOwnProperty('userSlackID')){
            this.userSlackID = '';
        } 
        if(!this.hasOwnProperty('userEnable')){
            this.userEnable = '1';
        }
        if(!this.hasOwnProperty('userLastConnection')){
            this.userLastConnection = '0000-00-00 00:00:00';
        }
        if(!this.hasOwnProperty('userRights')){
            this.userRights = {};
        }

        this.getEvent = function(_fullData = false){
            return eventplanner.event.byId(this.userEventId, _fullData);
        }

        this.getDiscipline = function(_fullData = false){
            return eventplanner.discipline.byId(this.userDisciplineId, _fullData);
        }

        this.remove = function(_params = {}){
            return eventplanner.user.remove($.extend(_params, {id: this.userId}));
        }
    },
    
    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('user');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('user', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('user', _params);
    },
    
    // login d'un user
    login: function(_params) {
        var paramsRequired = ['username','password'];
	    var paramsSpecifics = {};
	    try {
	        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
	    } catch (e) {
	        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
	        return;
	    }
	    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
	    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
	    paramsAJAX.url = 'core/ajax/user.ajax.php';
	    paramsAJAX.data = {
	        action: 'login',
	        username: _params.username,
	        password: _params.password,
	        storeConnection: _params.storeConnection || 0,
	    };
	    return $.ajax(paramsAJAX);
    },
    
    
    isConnect: function(_params) {
	    if (Math.round(+new Date() / 1000) > (eventplanner.user.connectCheck + 300)) {
	        var paramsRequired = [];
	        var paramsSpecifics =  {
	        	pre_success: function(_data){
		        	if(_data.state == 'ok'){
		        		
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
	        paramsAJAX.url = 'core/ajax/ajax.php';
	        paramsAJAX.global = false;
	        paramsAJAX.data = {
                type: 'user',
	            action: 'isConnect',
	        };
	        return $.ajax(paramsAJAX);
	    } else {
	        if ('function' == typeof (_params.success)) {
	            _params.success(true);
	        }
	        return true;
	    }
    },
	
	get: function(_params) {
	    var paramsRequired = [];
	    var paramsSpecifics = {};
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
            type: 'user',
	        action: 'get'
	    };
	    return $.ajax(paramsAJAX);
	},
    
    updateData: function(_data){
    	if(is_object(_data)){
    		// c'est un objet, donc un seul enregistrement à traiter
    		if(_data.hasOwnProperty('userId')){
    			this.container[_data.userId] = _data;
    		}    		
    	}else{
    		// c'est un array, donc plusieurs enregistrement à traiter
    		_data.forEach(function(element) {
                if(element.hasOwnProperty('userId')){
	    			eventplanner.user.container[element.userId] = element;
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
    byName: function(_name = '', _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
            	if(eventplanner.user.container[id].userName == _name){
                    dataSelection = eventplanner.user.container[id];
                }
            });

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

    getFullData: function(_data){
        //Traitement
        // faire un merge des des _data + les donnée captées par le byId...
        // NB: stocker dans les container les champs avec les préfix déjà là...

        // ! tester si c'est un tableau --> traiter chaque item (c'est une liste d'objet)
        // si c'est un objet: traiter le seul objet
        return _data;
    },

    compareNameAsc: function(a,b) {
      if (a.userName.toLowerCase() < b.userName.toLowerCase())
        return -1;
      if (a.userName.toLowerCase() > b.userName.toLowerCase())
        return 1;
      return 0;
    }
}

