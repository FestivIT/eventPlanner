eventplanner = {
	loadDataFromServer: function(_type){
		this[_type].dataReady = $.Deferred();
    	this[_type].container = {};
    	
        var params = {
            success: function(_type){
	            	return function(_data, _date) {
	            		eventplanner.updateDataFromServer(_type, _data);
		                eventplanner[_type].dataReady.resolve();
	            	}
	        	}(_type)
        };

        var params = $.extend({}, eventplanner.private.default_params, params || {});

        var paramsAJAX = eventplanner.private.getParamsAJAX(params);
        paramsAJAX.url = 'core/ajax/ajax.php';
        paramsAJAX.data = {
            type: _type,
            action: 'all'
        };
        $.ajax(paramsAJAX);

        return this[_type].dataReady;
	},

	saveDataToServer: function(_type, _params){
		var paramsRequired = [_type];
        var paramsSpecifics =  {
        	pre_success: function(_type){
	            	return function(_data) {
	            		if(_data.state == 'ok'){
			        		eventplanner.updateDataFromServer(_type, _data.result);
                            _data.result = new eventplanner[_type][_type + 'Item'](_data.result);
			        	}
                        return _data;
	            	}
	        	}(_type)
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
        paramsAJAX.data = {
            type: _type,
            action: 'save'
        };
        paramsAJAX.data[_type] = json_encode(_params[_type]);
        return $.ajax(paramsAJAX);
	},

    removeDataFromServer : function(_type, _params){
        var paramsRequired = ['id'];
        var paramsSpecifics =  {
            pre_success: function(_type){
                    return function(_data) {
                        if(_data.state == 'ok'){
                            // _data.result
                        }
                        return _data;
                    }
                }(_type)
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
        paramsAJAX.data = {
            type: _type,
            id: _params.id,
            action: 'remove'
        };
        return $.ajax(paramsAJAX);
    },

	updateDataFromServer: function(_type , _data){
    	if(is_object(_data)){
    		// c'est un objet, donc un seul enregistrement à traiter
    		if(_data.hasOwnProperty(_type + 'Id')){
    			eventplanner[_type].container[_data[_type + 'Id']] = new eventplanner[_type][_type + 'Item'](_data);
    		}    		
    	}else{
    		// c'est un array, donc plusieurs enregistrement à traiter
    		_data.forEach(function(element) {
                if(element.hasOwnProperty(_type + 'Id')){
    				eventplanner[_type].container[element[_type + 'Id']] = new eventplanner[_type][_type + 'Item'](element);
	    		}
            });
    	}
    },

    updateStateToServer: function(_type ,_params) {
    	var paramsRequired = ['listId','state'];
    	if(_type == 'zone'){
        	paramsRequired.push('eqLogicState');
    	}
        var paramsSpecifics =  {
        	pre_success: function(_type){
	            	return function(_data) {
	            		if(_data.state == 'ok'){
			        		eventplanner.updateDataFromServer(_type, _data.result);
			        	}
			        	return _data;
	            	}
	        	}(_type)
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
        paramsAJAX.data = {
            type: _type,
            action: 'updateState',
            listId: json_encode(_params.listId),
            state: _params.state
        };
        if(_type == 'zone'){
        	paramsAJAX.data.eqLogicState = _params.eqLogicState;
    	}
        return $.ajax(paramsAJAX);
    },

};
