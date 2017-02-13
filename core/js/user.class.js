eventplanner.user = {
    dataReady: $.Deferred(),
    container: {},
    connectCheck: 0,
    
    // Chargement initial des données depuis le serveur
    load: function(){
    	this.dataReady = $.Deferred();
    	this.container = {};
    	
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.user.container[element.userId] = element;
                });
                
                eventplanner.user.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/user.ajax.php';
        paramsAJAX.data = {
            action: 'all',
            fullData: true
        };
        $.ajax(paramsAJAX);

        return this.dataReady;
    },
    
    // enregistrement d'un user
    save: function(_params) {
        var paramsRequired = ['user'];
        var paramsSpecifics =  {
        	pre_success: function(_data){
	        	if(_data.state == 'ok'){
	        		eventplanner.user.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/user.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            user: json_encode(_params.user),
        };
        return $.ajax(paramsAJAX);
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
		        		eventplanner.ui.currentUser = _data.result;
		        	}
		        	return _data;
	        	}
	        	/*pre_success: function(data) {
	                if (data.state != 'ok') {
	                    return {state: 'ok', result: false};
	                } else {
	                    eventplanner.user.connectCheck = Math.round(+new Date() / 1000);
	                    return {state: 'ok', result: true};
	                }
	            }*/
	        };
	        try {
	            eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
	        } catch (e) {
	            (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
	            return;
	        }
	        var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
	        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
	        paramsAJAX.url = 'core/ajax/user.ajax.php';
	        paramsAJAX.global = false;
	        paramsAJAX.data = {
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
    
    setOptions: function(_params) {
	    var paramsRequired = ['key', 'value'];
	    var paramsSpecifics =  {
        	pre_success: function(_data){
	        	if(_data.state == 'ok'){
	        		eventplanner.ui.currentUser = _data.result;
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
	    paramsAJAX.url = 'core/ajax/user.ajax.php';
	    paramsAJAX.data = {
	        action: 'setOptions',
	        key: _params.key,
	        value: _params.value
	    };
	    return $.ajax(paramsAJAX);
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
	    paramsAJAX.url = 'core/ajax/user.ajax.php';
	    paramsAJAX.data = {
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
    byId: function(_id, _fulldata = false){
    	// si l'ID n'est pas trouvé, alors relancer un LOAD pour essayer de le trouver.
    	// (cas d'un user qui serait créé entre temps... voir comment industrialisé ça)
    	// (peut-être via l'intégration des messages sans "EventID" dans toutes les requettes (peu importe l'event)
    	// (notamment pour la mise à jour des user + matType...)
    	
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
      if (a.userName < b.userName)
        return -1;
      if (a.userName > b.userName)
        return 1;
      return 0;
    }
}
/*
eventplanner.user.remove = function(_params) {
    var paramsRequired = ['id'];
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
        action: 'remove',
        id: _params.id
    };
    $.ajax(paramsAJAX);
}
*/

