 eventplanner.user = function() {
 };
 
 eventplanner.user.connectCheck = 0;

 eventplanner.user.all = function(_params) {
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
        action: 'all',
    };
    $.ajax(paramsAJAX);
}

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

eventplanner.user.save = function(_params) {
    var paramsRequired = ['user'];
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
        action: 'save',
        user: json_encode(_params.user)
    };
    $.ajax(paramsAJAX);
}

eventplanner.user.setOptions = function(_params) {
    var paramsRequired = ['key', 'value'];
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
        action: 'setOptions',
        key: _params.key,
        value: _params.value
    };
    $.ajax(paramsAJAX);
}

eventplanner.user.get = function(_params) {
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
        action: 'get',
        profils: json_encode(_params.profils)
    };
    $.ajax(paramsAJAX);
};

eventplanner.user.isConnect = function(_params) {
    if (Math.round(+new Date() / 1000) > (eventplanner.user.connectCheck + 300)) {
        var paramsRequired = [];
        var paramsSpecifics = {
            pre_success: function(data) {
                if (data.state != 'ok') {
                    return {state: 'ok', result: false};
                } else {
                    eventplanner.user.connectCheck = Math.round(+new Date() / 1000);
                    return {state: 'ok', result: true};
                }
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
        paramsAJAX.global = false;
        paramsAJAX.data = {
            action: 'isConnect',
        };
        $.ajax(paramsAJAX);
    } else {
        if ('function' == typeof (_params.success)) {
            _params.success(true);
        }
    }
}

eventplanner.user.login = function(_params) {
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
    $.ajax(paramsAJAX);
};

eventplanner.user.refresh = function(_params) {
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
        action: 'refresh',
    };
    $.ajax(paramsAJAX);
};

eventplanner.user.byId = function(_params) {
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
        action: 'byId',
        id: _params.id
    };
    $.ajax(paramsAJAX);
};
