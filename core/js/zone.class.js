
eventplanner.zone = function() {
};

eventplanner.zone.all = function(_params) {
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
    paramsAJAX.url = 'core/ajax/zone.ajax.php';
    paramsAJAX.data = {
        action: 'all',
    };
    $.ajax(paramsAJAX);
};

eventplanner.zone.save = function(_params) {
    var paramsRequired = ['zone'];
    var paramsSpecifics =  {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/zone.ajax.php';
    paramsAJAX.data = {
        action: 'save',
        zone: json_encode(_params.zone),
    };
    $.ajax(paramsAJAX);
};

eventplanner.zone.byId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/zone.ajax.php';
    paramsAJAX.data = {
        action: 'byId',
        id: _params.id
    };
    $.ajax(paramsAJAX);
};

eventplanner.zone.byEventId = function(_params) {
    var paramsRequired = ['eventId'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/zone.ajax.php';
    paramsAJAX.data = {
        action: 'byEventId',
        eventId: _params.eventId
    };
    $.ajax(paramsAJAX);
};

eventplanner.zone.updateState = function(_params) {
    var paramsRequired = ['listId','state'];
    var paramsSpecifics =  {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/zone.ajax.php';
    paramsAJAX.data = {
        action: 'updateState',
        listId: json_encode(_params.listId),
        state: _params.state
    };
    $.ajax(paramsAJAX);
};