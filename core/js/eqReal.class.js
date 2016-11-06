eventplanner.eqReal = function() {
};

eventplanner.eqReal.all = function(_params) {
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
    paramsAJAX.url = 'core/ajax/eqReal.ajax.php';
    paramsAJAX.data = {
        action: 'all',
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.eqReal.save = function(_params) {
    var paramsRequired = ['eqReal'];
    var paramsSpecifics =  {};

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
    $.ajax(paramsAJAX);
};

eventplanner.eqReal.byId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/eqReal.ajax.php';
    paramsAJAX.data = {
        action: 'byId',
        fullData: true,
        id: _params.id
    };
    $.ajax(paramsAJAX);
};

eventplanner.eqReal.byMatTypeId = function(_params) {
    var paramsRequired = ['matTypeId'];
    var paramsSpecifics = {};

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
        action: 'byMatTypeId',
        fullData: true,
        matTypeId: _params.matTypeId
    };
    $.ajax(paramsAJAX);
};
