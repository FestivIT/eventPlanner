
eventplanner.msg = function() {
};

eventplanner.msg.all = function(_params) {
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
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'all',
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.msg.save = function(_params) {
    var paramsRequired = ['msg'];
    var paramsSpecifics =  {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'save',
        msg: json_encode(_params.msg),
    };
    $.ajax(paramsAJAX);
};

eventplanner.msg.byId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'byId',
        id: _params.id,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.msg.byEventId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'byEventId',
        eventId: _params.eventId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.msg.byZoneId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'byZoneId',
        zoneId: _params.zoneId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.msg.byEqId = function(_params) {
    var paramsRequired = ['eqId'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'byEqId',
        eqId: _params.zoneId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.msg.byUserId = function(_params) {
    var paramsRequired = ['userId'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/msg.ajax.php';
    paramsAJAX.data = {
        action: 'byUserId',
        userId: _params.userId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};