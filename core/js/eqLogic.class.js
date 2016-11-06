eventplanner.eqLogic = function() {
};

eventplanner.eqLogic.all = function(_params) {
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
    paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
    paramsAJAX.data = {
        action: 'all',
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.eqLogic.save = function(_params) {
    var paramsRequired = ['eqLogic'];
    var paramsSpecifics =  {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
    paramsAJAX.data = {
        action: 'save',
        eqLogic: json_encode(_params.eqLogic),
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.eqLogic.byId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
    paramsAJAX.data = {
        action: 'byId',
        id: _params.id,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.eqLogic.byEventId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
    paramsAJAX.data = {
        action: 'byEventId',
        eventId: _params.eventId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.eqLogic.byZoneId = function(_params) {
    var paramsRequired = ['zoneId'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/eqLogic.ajax.php';
    paramsAJAX.data = {
        action: 'byZoneId',
        zoneId: _params.zoneId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};