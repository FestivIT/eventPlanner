function handleAjaxError(_request, _status, _error, _div_alert) {
    $.hideLoading();
    var div_alert = init(_div_alert, $('#div_alert'));
    if (_request.status != '0') {
        if (init(_request.responseText, '') != '') {
            div_alert.showAlert({message: _request.responseText, level: 'danger'});
        } else {
            div_alert.showAlert({message: _request.status + ' : ' + _error, level: 'danger'});
        }
    }
}

function init(_value, _default) {
    if (!isset(_default)) {
        _default = '';
    }
    if (!isset(_value)) {
        return _default;
    }
    return _value;
}

function getUrlVars(_key) {
    var vars = [], hash, nbVars = 0;
    var hashes = window.location.search.replace('?','').split('&');
    for (var i = 0; i < hashes.length; i++) {
        if (hashes[i] !== "" && hashes[i] !== "?") {
            hash = hashes[i].split('=');
            nbVars++;
            vars[hash[0]] = hash[1];
            if (isset(_key) && _key == hash[0]) {
                return hash[1];
            }
        }
    }
    if (isset(_key)) {
        return false;
    }
    vars.length = nbVars;
    return vars;
}
