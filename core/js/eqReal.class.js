eventplanner.eqReal = {
    dataReady: $.Deferred(),
    container: {},
    eqRealItem: function(){ 
    	this.getMatType = function(_fullData = false){
			return eventplanner.matType.byId(this.eqRealMatTypeId, _fullData);
    	}
    	
    	this.getEqLogics = function(_fullData = false){
			return eventplanner.eqLogic.byEqRealId(this.eqRealId, _fullData);
    	}
    },

    // Chargement initial des données depuis le serveur
    load: function(){
    	this.dataReady = $.Deferred();
    	this.container = {};
    	
        var params = {
            success: function(_data, _date) {
                _data.forEach(function(element) {
                    eventplanner.eqReal.container[element.eqRealId] = $.extend(new eventplanner.eqReal.eqRealItem(), element);
                });

                eventplanner.eqReal.dataReady.resolve();
            }
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/eqReal.ajax.php';
        paramsAJAX.data = {
            action: 'all'
        };
        $.ajax(paramsAJAX);

        return this.dataReady;
    },

    // enregistrement d'un eqReal
    save: function(_params) {
        // éventuellement ajouter un futur "cache" si offline... ?

        var paramsRequired = ['eqReal'];
        var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.eqReal.updateData(_data.result);
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
        paramsAJAX.url = 'core/ajax/eqReal.ajax.php';
        paramsAJAX.data = {
            action: 'save',
            eqReal: json_encode(_params.eqReal)
        };
        return $.ajax(paramsAJAX);
    },
    
    updateState: function(_params) {
	    var paramsRequired = ['listId','state'];
	    var paramsSpecifics =  {
            pre_success: function(_data){
                if(_data.state == 'ok'){
                    eventplanner.eqReal.updateData(_data.result);
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
	    paramsAJAX.url = 'core/ajax/eqReal.ajax.php';
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
            if(_data.hasOwnProperty('eqRealId')){
                this.container[_data.eqRealId] = $.extend(new eventplanner.eqReal.eqRealItem(), _data);
            }           
        }else{
            // c'est un array, donc plusieurs enregistrement à traiter
            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqRealId')){
                    eventplanner.eqReal.container[element.eqRealId] = $.extend(new eventplanner.eqReal.eqRealItem(), element);
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
    
    // Accés aux données
    byMatTypeId: function(_matTypeId, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            Object.keys(this.container).forEach(function(id) {
               if(eventplanner.eqReal.container[id].eqRealMatTypeId == _matTypeId){
                    dataSelection.push(eventplanner.eqReal.container[id]);
                }
            });

            // Tri
            dataSelection.sort(this.compareZoneIdAsc);

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
        var processData = function(_eqRealData){
            // matType
            var matType = eventplanner.matType.byId(_eqRealData.eqRealMatTypeId);
            if(!is_object(matType)){
                matType = {};
            }

            // Concaténation
            return $.extend(true, {}, _eqRealData, matType);
        }
       
        if(is_object(_data)){
            // c'est un objet, donc un seul enregistrement à traiter
            if(_data.hasOwnProperty('eqRealId')){
                return processData(_data);
            }           
        }else if(is_array(_data)){
            // c'est un array, donc plusieurs enregistrement à traiter
            var dataArray = [];

            _data.forEach(function(element) {
                if(element.hasOwnProperty('eqRealId')){
                    dataArray.push(processData(element));
                }
            });

            return dataArray;
        }else{
        	return _data;	
        }
    },

    compareNameAsc: function(a,b) {
      if (a.matTypeName < b.matTypeName)
        return -1;
      if (a.matTypeName > b.matTypeName)
        return 1;
      return 0;
    }
}
