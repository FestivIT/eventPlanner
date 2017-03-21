eventplanner.msg = {
    dataReady: $.Deferred(),
    container: {},
    lastMsgId: 0,
    msgItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        this.getTextContent = function(){
            switch(this.msgContent.type){
                case "text":
                    return this.msgContent.value.toLowerCase();
                break;

                default:
                    return "";
                break;
            }
        }
		
        this.checkValues = function(){
        	if(this.msgDate == ""){
				throw new Error("Le format de la date n'est pas valide.");
			}
			
			if(this.msgUserId == ""){
				throw new Error("Le message doit être rattaché à un utilisateur.");
			}
			
			return true;
        }
        
        this.getValues = function(){
        	var values = {};
        	
        	for (keys in this){
        		if(typeof this[keys] != 'function'){
        			if(keys.substring(0, "msg".length) == "msg"){
        				values[firstToLowerCase(keys.substring("msg".length))] = this[keys];
        			}
        		}
        	}
        	
        	return values;
        };
        
        this.clone = function(){
            return new eventplanner.msg.msgItem(this);
        }
        
        this.save = function(_params = {}){
        	this.checkValues();

			return eventplanner.msg.save($.extend({msg: this.getValues()}, _params));
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
    	this.dataReady = $.Deferred();
    	this.container = {};
    	this.lastMsgId = 0;
    	
        var params = {
            initialLoad: true,
            success: function(_data, _date) {
                eventplanner.msg.dataReady.resolve();
            }
        };

        this.lastMsgId = 0; // reset du lastId
        this.getLastMsg(params);

        return this.dataReady;
    },

    // récupération de la liste des message depuis la dernière réception réussie
    getLastMsg: function(_params) {
        var paramsRequired = [];
        var paramsSpecifics =  {
            pre_success: function(initialLoad){
                return function(_data){
                    if(_data.state == 'ok'){
                        eventplanner.updateDataFromServer('msg', _data.result);

                        var elementToUpdate = {
                            msg: {
                                add:[]
                            }
                        };

                        // Traitement des datas du Msg
                        _data.result.forEach(function(element) {
                            //eventplanner.msg.container[element.msgId] = element;

                            eventplanner.msg.lastMsgId = Math.max(eventplanner.msg.lastMsgId,element.msgId);

                            elementToUpdate['msg']['add'].push(element.msgId);

                            if(!initialLoad && is_object(element.msgData) && element.msgData.hasOwnProperty('type')){
                                // Construction d'un objet contenant les type/id à updater
                                if(!is_array(elementToUpdate[element.msgData.type])){
                                    elementToUpdate[element.msgData.type] = [];
                                }
                                if(!is_array(elementToUpdate[element.msgData.type][element.msgData.op])){
                                    elementToUpdate[element.msgData.type][element.msgData.op] = [];
                                }
                                
                                // Process data que pour les données autre que les msg
                                if(element.msgData.type != 'msg'){
                                    elementToUpdate[element.msgData.type][element.msgData.op].push(element.msgData.content[element.msgData.type + 'Id']);
                                    eventplanner.msg.processMsgData(element.msgData);
                                }
                            }
                        });

                        if(Object.keys(elementToUpdate).length > 0){
                            eventplanner.ui.updateUI(elementToUpdate);
                        }
                    }
                    return _data;
                }
            }(_params.initialLoad)
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
            type: 'msg',
            action: 'sinceId',
            id: this.lastMsgId
        };
        return $.ajax(paramsAJAX);
    },

    processMsgData: function(_data){
        switch(_data.op) {
            case 'add':
                var itemId = _data.content[_data.type + 'Id'];
                eventplanner.updateDataFromServer(_data.type, _data.content);
            break;
            
            case 'update':
                var itemId = _data.content[_data.type + 'Id'];
                eventplanner.updateDataFromServer(_data.type, _data.content);
            break;
            
            case 'remove':
                var itemId = _data.content[_data.type + 'Id'];        
                delete eventplanner[_data.type].container[itemId];
            break;
        }
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('msg', _params);
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
    searchAll: function(_searchVal){
        if(this.dataReady.state() == 'resolved'){
            var listAll = this.all(true);

            // Selection des données à conserver dans le container:
            var dataSelection = Array();

            listAll.forEach(function(msg){
                if(msg.msgContentText.indexOf(_searchVal.toLowerCase()) !== -1){
                    dataSelection.push(msg);
                } else if(msg.hasOwnProperty('userName') && msg.userName.toLowerCase().indexOf(_searchVal.toLowerCase()) !== -1){
                    dataSelection.push(msg);
                } else if(msg.hasOwnProperty('zoneName') && msg.zoneName.toLowerCase().indexOf(_searchVal.toLowerCase()) !== -1){
                    dataSelection.push(msg);
                } else if(msg.hasOwnProperty('eqRealName') && msg.eqRealName.toLowerCase().indexOf(_searchVal.toLowerCase()) !== -1){
                    dataSelection.push(msg);
                } else if(msg.hasOwnProperty('matTypeName') && msg.matTypeName.toLowerCase().indexOf(_searchVal.toLowerCase()) !== -1){
                    dataSelection.push(msg);
                }
            });
            
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
            return $.extend(true, {msgContentText: _msgData.getTextContent()}, _msgData, user, zone, eqLogic);
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
