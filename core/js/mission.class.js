eventplanner.mission = function() {
};

eventplanner.mission.all = function(_params) {
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
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'all',
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.mission.save = function(_params) {
    var paramsRequired = ['mission'];
    var paramsSpecifics =  {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});
    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'save',
        mission: json_encode(_params.mission),
        fullData: true
    };
    $.ajax(paramsAJAX);
};


eventplanner.mission.updateState = function(_params) {
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
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'updateState',
        listId: json_encode(_params.listId),
        state: _params.state
    };
    $.ajax(paramsAJAX);
};



eventplanner.mission.byId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'byId',
        id: _params.id,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.mission.byEventId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'byEventId',
        eventId: _params.eventId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.mission.byZoneId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'byZoneId',
        zoneId: _params.zoneId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};


eventplanner.mission.byUserId = function(_params) {
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
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'byUserId',
        userId: _params.userId,
        fullData: true
    };
    $.ajax(paramsAJAX);
};

eventplanner.mission.byUserIdMaxState = function(_params) {
    var paramsRequired = ['userId', 'maxState'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/mission.ajax.php';
    paramsAJAX.data = {
        action: 'byUserIdMaxState',
        userId: _params.userId,
        maxState: _params.maxState,
        fullData: true
    };
    $.ajax(paramsAJAX);
};